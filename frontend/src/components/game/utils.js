// Currency formatter for Indian Rupees
export function formatCurrency(value) {
  return value.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });
}

// Calculate investment return based on option and market modifier
export function calculateInvestmentReturn(amount, investmentOption, marketModifier) {
  if (amount === 0) return 0;
  
  const [minReturn, maxReturn] = investmentOption.baseReturnRange;
  const range = maxReturn - minReturn;
  const baseReturn = minReturn + Math.random() * range;
  const adjustedReturn = baseReturn + marketModifier;
  
  return (amount * adjustedReturn) / 100;
}

// Calculate monthly payment for a loan
export function calculateMonthlyPayment(principal, annualRate, yearsRemaining) {
  const monthlyRate = annualRate / 100 / 12;
  const months = yearsRemaining * 12;
  
  if (monthlyRate === 0) return principal / months;
  
  return (
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );
}

// Process loan repayment
export function processLoanRepayment(loans) {
  let totalRepayment = 0;
  const updatedLoans = [];

  loans.forEach((loan) => {
    const monthlyPayment = calculateMonthlyPayment(
      loan.amount,
      loan.interestRate,
      loan.yearsRemaining
    );
    const yearlyPayment = monthlyPayment * 12;
    
    totalRepayment += yearlyPayment;
    
    updatedLoans.push({
      ...loan,
      yearsRemaining: loan.yearsRemaining - 1,
      monthlyPayment,
    });
  });

  return { totalRepayment: Math.round(totalRepayment), updatedLoans };
}

// Generate a unique loan ID
export function generateLoanId() {
  return `LOAN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Calculate score for game summary
export function calculateGameScore(wealthGain, startingWealth, insuranceCount, debtRatio, positiveYears, totalYears) {
  let score = 0;
  
  // Wealth gain score (0-30)
  if (wealthGain > startingWealth * 5) score += 30;
  else if (wealthGain > startingWealth * 3) score += 25;
  else if (wealthGain > startingWealth) score += 20;
  else if (wealthGain > 0) score += 10;
  else score += 0;

  // Insurance score (0-25)
  score += insuranceCount * 8; // 3 policies = 24 points

  // Debt score (0-25)
  if (debtRatio === 0) score += 25;
  else if (debtRatio < 20) score += 20;
  else if (debtRatio < 50) score += 10;
  else score += 0;

  // Consistency score (0-20)
  score += (positiveYears / totalYears) * 20;

  return Math.round(Math.min(100, score));
}

// Get grade based on score
export function getGrade(score) {
  if (score >= 90) return { grade: 'A', color: '#22c55e', label: 'Excellent' };
  if (score >= 80) return { grade: 'B', color: '#3b82f6', label: 'Very Good' };
  if (score >= 70) return { grade: 'C', color: '#f59e0b', label: 'Good' };
  if (score >= 60) return { grade: 'D', color: '#ef4444', label: 'Fair' };
  return { grade: 'F', color: '#dc2626', label: 'Needs Improvement' };
}
