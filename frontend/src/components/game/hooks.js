import { useState, useCallback, useMemo } from 'react';

// Hook to manage game state and year progression
export function useGameState(initialWealth = 50000) {
  const [year, setYear] = useState(0);
  const [wealth, setWealth] = useState(initialWealth);
  const [investments, setInvestments] = useState([]);
  const [loans, setLoans] = useState([]);
  const [insurance, setInsurance] = useState([]);
  const [gameHistory, setGameHistory] = useState([]);
  const [gameActive, setGameActive] = useState(true);

  const addYearToHistory = useCallback(
    (yearData) => {
      setGameHistory((prev) => [...prev, yearData]);
    },
    []
  );

  const completeYear = useCallback(
    (yearData) => {
      setYear((prev) => prev + 1);
      setWealth(yearData.wealth);
      addYearToHistory(yearData);
    },
    [addYearToHistory]
  );

  const endGame = useCallback(() => {
    setGameActive(false);
  }, []);

  const resetGame = useCallback(() => {
    setYear(0);
    setWealth(initialWealth);
    setInvestments([]);
    setLoans([]);
    setInsurance([]);
    setGameHistory([]);
    setGameActive(true);
  }, [initialWealth]);

  return {
    year,
    wealth,
    investments,
    setInvestments,
    loans,
    setLoans,
    insurance,
    setInsurance,
    gameHistory,
    gameActive,
    completeYear,
    endGame,
    resetGame,
  };
}

// Hook to manage investment portfolio
export function useInvestmentPortfolio(investmentOptions) {
  const [investments, setInvestments] = useState([]);

  const addInvestment = useCallback(
    (name, amount) => {
      const existing = investments.find((inv) => inv.name === name);
      if (existing) {
        setInvestments(
          investments.map((inv) =>
            inv.name === name ? { ...inv, amount: inv.amount + amount } : inv
          )
        );
      } else {
        setInvestments([...investments, { name, amount }]);
      }
    },
    [investments]
  );

  const removeInvestment = useCallback(
    (name) => {
      setInvestments(investments.filter((inv) => inv.name !== name));
    },
    [investments]
  );

  const getPortfolioStats = useMemo(() => {
    return {
      totalInvested: investments.reduce((sum, inv) => sum + inv.amount, 0),
      count: investments.length,
      breakdown: investments.map((inv) => {
        const option = investmentOptions.find((opt) => opt.name === inv.name);
        return {
          name: inv.name,
          amount: inv.amount,
          riskLevel: option?.riskLevel || 'Unknown',
        };
      }),
    };
  }, [investments, investmentOptions]);

  return {
    investments,
    addInvestment,
    removeInvestment,
    getPortfolioStats,
  };
}

// Hook to manage loans and debt
export function useLoanManagement(LOAN_INTEREST_RATE = 0.08, LOAN_TERM_YEARS = 5) {
  const [loans, setLoans] = useState([]);

  const createLoan = useCallback(
    (amount) => {
      const loanId = `LOAN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newLoan = {
        id: loanId,
        amount,
        interestRate: LOAN_INTEREST_RATE * 100,
        yearsRemaining: LOAN_TERM_YEARS,
        createdYear: 0,
      };
      setLoans((prev) => [...prev, newLoan]);
      return newLoan;
    },
    [LOAN_INTEREST_RATE, LOAN_TERM_YEARS]
  );

  const repayLoan = useCallback(
    (loanId, amount) => {
      setLoans(
        loans
          .map((loan) =>
            loan.id === loanId
              ? { ...loan, amount: Math.max(0, loan.amount - amount) }
              : loan
          )
          .filter((loan) => loan.amount > 0)
      );
    },
    [loans]
  );

  const progressLoans = useCallback(() => {
    setLoans((prevLoans) =>
      prevLoans
        .map((loan) => ({
          ...loan,
          yearsRemaining: loan.yearsRemaining - 1,
        }))
        .filter((loan) => loan.yearsRemaining > 0)
    );
  }, []);

  const getTotalDebt = useMemo(() => {
    return loans.reduce((sum, loan) => sum + loan.amount, 0);
  }, [loans]);

  return {
    loans,
    createLoan,
    repayLoan,
    progressLoans,
    getTotalDebt,
  };
}

// Hook to manage insurance policies
export function useInsuranceManagement() {
  const [insurance, setInsurance] = useState([]);

  const buyInsurance = useCallback(
    (type, premium, coverage) => {
      const existing = insurance.find((ins) => ins.type === type);
      if (!existing) {
        setInsurance([
          ...insurance,
          {
            type,
            premium,
            coverage,
            active: true,
          },
        ]);
      }
    },
    [insurance]
  );

  const cancelInsurance = useCallback(
    (type) => {
      setInsurance(insurance.filter((ins) => ins.type !== type));
    },
    [insurance]
  );

  const hasInsurance = useCallback(
    (type) => {
      return insurance.some((ins) => ins.type === type);
    },
    [insurance]
  );

  const getTotalPremium = useMemo(() => {
    return insurance.reduce((sum, ins) => sum + ins.premium, 0);
  }, [insurance]);

  return {
    insurance,
    buyInsurance,
    cancelInsurance,
    hasInsurance,
    getTotalPremium,
  };
}

// Hook for game events
export function useGameEvents(scriptedEvents) {
  const [processedEvents, setProcessedEvents] = useState([]);

  const getYearEvent = useCallback(
    (year) => {
      if (year < scriptedEvents.length) {
        return scriptedEvents[year];
      }
      return null;
    },
    [scriptedEvents]
  );

  const recordEvent = useCallback((event) => {
    setProcessedEvents((prev) => [...prev, event]);
  }, []);

  return {
    getYearEvent,
    processedEvents,
    recordEvent,
  };
}
