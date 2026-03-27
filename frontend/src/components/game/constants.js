// ============================================================
// GAME CONSTANTS - Configuration and Magic Numbers
// ============================================================

// Loan system parameters
export const LOAN_INTEREST_RATE = 0.08; // 8% annual interest
export const LOAN_TERM_YEARS = 5; // Default 5-year loan term
export const STARTING_WEALTH = 50000; // Starting player wealth in INR
export const DEFAULT_SALARY = 300000; // Starting annual salary in INR
export const STARTING_YEARS = 6; // Default game duration in years
export const EXPENSE_RATIO = 0.4; // 40% of salary goes to living expenses

// ============================================================
// INVESTMENT OPTIONS - 5 Different Investment Types
// ============================================================

export const investmentOptions = {
  stocks: {
    name: 'Stocks',
    emoji: '📈',
    description: 'Moderate risk, good returns',
    baseReturnRange: [-15, 25], // -15% to +25%
    volatility: 20, // Higher volatility
    icon: '📊',
    riskLevel: 'Medium',
  },
  gold: {
    name: 'Gold',
    emoji: '🏆',
    description: 'Low risk, stable returns',
    baseReturnRange: [-5, 10], // -5% to +10%
    volatility: 5, // Low volatility
    icon: '🪙',
    riskLevel: 'Low',
  },
  silver: {
    name: 'Silver',
    emoji: '⭐',
    description: 'Medium risk, moderate returns',
    baseReturnRange: [-8, 15], // -8% to +15%
    volatility: 10, // Medium volatility
    icon: '💎',
    riskLevel: 'Medium',
  },
  commodities: {
    name: 'Commodities',
    emoji: '🌾',
    description: 'High risk, high returns',
    baseReturnRange: [-20, 30], // -20% to +30%
    volatility: 25, // High volatility
    icon: '🌾',
    riskLevel: 'High',
  },
  crypto: {
    name: 'Crypto',
    emoji: '🚀',
    description: 'Very high risk, extreme returns',
    baseReturnRange: [-40, 50], // -40% to +50%
    volatility: 40, // Very high volatility
    icon: '🔗',
    riskLevel: 'Very High',
  },
};

// ============================================================
// SCRIPTED EVENTS - 6 Yearly Events for Game Progression
// ============================================================

export const scriptedEvents = {
  1: {
    title: 'First Job',
    description: 'You started your first job.',
    salaryChangePercent: 0,
    liabilityAmount: 0,
    marketModifier: 0,
    insuranceUnlocked: false,
    isEmergency: false,
    emergencyType: null,
  },
  2: {
    title: '🏥 Medical Emergency',
    description: 'Unexpected hospital expense. Insurance covers 70% if purchased.',
    salaryChangePercent: 0,
    liabilityAmount: 50000,
    marketModifier: 0,
    insuranceUnlocked: true,
    isEmergency: true,
    emergencyType: 'medical',
  },
  3: {
    title: 'Promotion',
    description: 'Salary increased by 20%.',
    salaryChangePercent: 20,
    liabilityAmount: 0,
    marketModifier: 0,
    insuranceUnlocked: false,
    isEmergency: false,
    emergencyType: null,
  },
  4: {
    title: 'Market Boom',
    description: 'Markets are performing well.',
    salaryChangePercent: 0,
    liabilityAmount: 0,
    marketModifier: 5,
    insuranceUnlocked: false,
    isEmergency: false,
    emergencyType: null,
  },
  5: {
    title: '🚗 Car Accident',
    description: 'Vehicle damage needs repair. Insurance covers 70% if purchased.',
    salaryChangePercent: 0,
    liabilityAmount: 75000,
    marketModifier: 0,
    insuranceUnlocked: true,
    isEmergency: true,
    emergencyType: 'accident',
  },
  6: {
    title: '⚠️ House Emergency',
    description: 'Urgent home repairs needed. Insurance covers 70% if purchased.',
    salaryChangePercent: 0,
    liabilityAmount: 100000,
    marketModifier: -8,
    insuranceUnlocked: true,
    isEmergency: true,
    emergencyType: 'house',
  },
};

// ============================================================
// INSURANCE OPTIONS - 3 Types of Insurance with 70% Coverage
// ============================================================

export const insuranceOptions = [
  {
    name: 'Medical Insurance',
    type: 'Medical',
    premium: 5000,
    coverage: 0.7, // 70% coverage
    description: 'Covers medical emergencies',
    icon: '🏥',
  },
  {
    name: 'Accident Insurance',
    type: 'Accident',
    premium: 4000,
    coverage: 0.7, // 70% coverage
    description: 'Covers accident-related damages',
    icon: '🚗',
  },
  {
    name: 'House Insurance',
    type: 'House',
    premium: 6000,
    coverage: 0.7, // 70% coverage
    description: 'Covers home and property damage',
    icon: '🏠',
  },
];
