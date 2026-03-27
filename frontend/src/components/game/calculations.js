// Calculate wealth for current year based on investments and returns
export function calculateYearlyWealth(investments, investmentOptions, marketModifier) {
  let totalValue = 0;

  investments.forEach((inv) => {
    const option = investmentOptions.find((opt) => opt.name === inv.name);
    if (!option) return;

    const [minReturn, maxReturn] = option.baseReturnRange;
    const range = maxReturn - minReturn;
    const baseReturn = minReturn + Math.random() * range;
    const adjustedReturn = baseReturn + marketModifier;
    const gain = (inv.amount * adjustedReturn) / 100;

    totalValue += inv.amount + gain;
  });

  return totalValue;
}

// Apply insurance coverage when an event occurs
export function applyInsuranceCoverage(eventImpact, insurance) {
  let totalCoverage = 0;
  let applicableInsurance = [];

  if (eventImpact.type === 'medical' || eventImpact.type === 'accident') {
    const medical = insurance.find((i) => i.type === 'Medical');
    if (medical) {
      totalCoverage += Math.abs(eventImpact.amount) * 0.7;
      applicableInsurance.push('Medical Insurance');
    }
  }

  if (eventImpact.type === 'accident') {
    const accident = insurance.find((i) => i.type === 'Accident');
    if (accident) {
      totalCoverage += Math.abs(eventImpact.amount) * 0.7;
      applicableInsurance.push('Accident Insurance');
    }
  }

  if (eventImpact.type === 'property') {
    const house = insurance.find((i) => i.type === 'House');
    if (house) {
      totalCoverage += Math.abs(eventImpact.amount) * 0.7;
      applicableInsurance.push('House Insurance');
    }
  }

  return {
    coverageAmount: Math.round(totalCoverage),
    applicableInsurance,
    finalImpact: Math.round(eventImpact.amount + totalCoverage),
  };
}

// Calculate all investments for a year and return total profit
export function calculateAllInvestmentReturns(
  investments,
  investmentOptions,
  marketModifier
) {
  let totalReturns = 0;
  const investmentBreakdown = [];

  investments.forEach((inv) => {
    const option = investmentOptions.find((opt) => opt.name === inv.name);
    if (!option) return;

    const [minReturn, maxReturn] = option.baseReturnRange;
    const range = maxReturn - minReturn;
    const baseReturn = minReturn + Math.random() * range;
    const adjustedReturn = baseReturn + marketModifier;
    const gain = (inv.amount * adjustedReturn) / 100;

    totalReturns += gain;
    investmentBreakdown.push({
      name: inv.name,
      amount: inv.amount,
      returnPercentage: adjustedReturn,
      gain: Math.round(gain),
    });
  });

  return {
    totalReturns: Math.round(totalReturns),
    breakdown: investmentBreakdown,
  };
}

// Calculate net wealth after all deductions
export function calculateNetWealth(grossWealth, loans) {
  let totalDebt = 0;

  loans.forEach((loan) => {
    totalDebt += loan.amount;
  });

  return {
    grossWealth: Math.round(grossWealth),
    totalDebt: Math.round(totalDebt),
    netWealth: Math.round(grossWealth - totalDebt),
  };
}

// Calculate debt-to-wealth ratio
export function calculateDebtRatio(netWealth, totalDebt) {
  if (netWealth <= 0) return 100;
  return Math.min(100, (totalDebt / netWealth) * 100);
}

// Calculate portfolio diversification score (0-100)
export function calculateDiversificationScore(investments) {
  if (investments.length === 0) return 0;

  const totalAmount = investments.reduce((sum, inv) => sum + inv.amount, 0);
  if (totalAmount === 0) return 0;

  // Calculate concentration - lower is better (more diversified)
  let concentrationSum = 0;
  investments.forEach((inv) => {
    const percentage = inv.amount / totalAmount;
    concentrationSum += percentage * percentage;
  });

  // Convert to diversification score (0-100)
  // More diverse portfolios have lower concentration sum
  const diversificationScore = (1 - concentrationSum) * 100;
  return Math.round(diversificationScore);
}

// Analyze investment performance for decision analysis
export function analyzeInvestmentPerformance(yearlyData, investmentOptions) {
  const analysis = {
    bestPerformer: null,
    worstPerformer: null,
    totalInvested: 0,
    totalGain: 0,
    roi: 0,
  };

  // Aggregate all investments across years
  const investmentTotals = {};

  yearlyData.forEach((year) => {
    if (year.investments) {
      year.investments.forEach((inv) => {
        if (!investmentTotals[inv.name]) {
          investmentTotals[inv.name] = { invested: 0, current: 0 };
        }
        investmentTotals[inv.name].invested += inv.amount;
      });
    }
  });

  // Calculate gains (simplified - would need more detailed tracking in actual implementation)
  const results = [];
  for (const [name, totals] of Object.entries(investmentTotals)) {
    const invested = totals.invested;
    analysis.totalInvested += invested;
    
    const result = {
      name,
      invested,
      gain: 0, // Would be calculated from yearlyReturns
    };
    results.push(result);
  }

  if (results.length > 0) {
    analysis.bestPerformer = results.reduce((max, curr) =>
      (curr.gain / curr.invested) > (max.gain / max.invested) ? curr : max
    );
    analysis.worstPerformer = results.reduce((min, curr) =>
      (curr.gain / curr.invested) < (min.gain / min.invested) ? curr : min
    );
  }

  if (analysis.totalInvested > 0) {
    analysis.roi = ((analysis.totalGain / analysis.totalInvested) * 100).toFixed(2);
  }

  return analysis;
}
