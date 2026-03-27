import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import HomePage from './HomePage';
import GameScreen from './components/GameScreen';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const initialForm = {
  username: '',
  email: '',
  password: '',
};

// Floating symbols component for creative background
const FloatingSymbols = () => {
  const symbols = ['₹', '$', '€', '¥', '£', '₿'];
  
  return (
    <div className="floating-symbols">
      {symbols.map((symbol, index) => (
        <span
          key={index}
          className="float-symbol"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
          }}
        >
          {symbol}
        </span>
      ))}
    </div>
  );
};

// New Dashboard and About pages from upstream
function DashboardPage({ username, onNavigate, onSignOut, loading }) {
  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>Vectra</h2>
        </div>
        <div className="navbar-menu">
          <button className="nav-button active" onClick={() => onNavigate('dashboard')}>
            Dashboard
          </button>
          <button className="nav-button" onClick={() => onNavigate('about')}>
            About
          </button>
          <button className="nav-button signout" onClick={onSignOut} disabled={loading}>
            {loading ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        {/* Enhanced Hero Section */}
        <section className="dashboard-hero">
          <div className="dashboard-content">
            <div className="user-greeting">
              <h1>Welcome back, <span className="username-highlight">{username}</span></h1>
              <p className="dashboard-subtitle">
                Ready to master financial decisions? Choose your path to building wealth and managing risk.
              </p>
            </div>
            <div className="progress-indicator">
              <div className="progress-item">
                <div className="progress-icon level-icon"></div>
                <div className="progress-text">
                  <span className="progress-label">Player Level</span>
                  <span className="progress-value">Beginner</span>
                </div>
              </div>
              <div className="progress-item">
                <div className="progress-icon goal-icon"></div>
                <div className="progress-text">
                  <span className="progress-label">Next Goal</span>
                  <span className="progress-value">First Game</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Action Cards */}
        <section className="actions-section">
          <h2 className="actions-title">Your Financial Journey</h2>
          <div className="actions-grid">
            <div className="action-card primary-card">
              <div className="card-decoration"></div>
              <div className="card-icon-wrapper">
                <div className="card-icon game-icon"></div>
              </div>
              <div className="card-content">
                <h3>Financial Simulation</h3>
                <p>Enter multiplayer rooms, make strategic investments, and compete with real players to maximize your wealth over multiple years.</p>
                <div className="card-features">
                  <span className="feature-tag">Multiplayer</span>
                  <span className="feature-tag">Real-time</span>
                  <span className="feature-tag">Strategic</span>
                </div>
              </div>
              <button className="card-action-button primary" onClick={() => onNavigate('home')}>
                Enter Game Room
                <span className="button-arrow">→</span>
              </button>
            </div>

            <div className="action-card">
              <div className="card-decoration"></div>
              <div className="card-icon-wrapper">
                <div className="card-icon quiz-icon"></div>
              </div>
              <div className="card-content">
                <h3>Knowledge Test</h3>
                <p>Assess your financial literacy with interactive quizzes covering investment strategies, risk management, and market dynamics.</p>
                <div className="card-features">
                  <span className="feature-tag">Educational</span>
                  <span className="feature-tag">Interactive</span>
                </div>
              </div>
              <button className="card-action-button" onClick={() => onNavigate('quiz')}>
                Take Quiz
                <span className="button-arrow">→</span>
              </button>
            </div>

            <div className="action-card">
              <div className="card-decoration"></div>
              <div className="card-icon-wrapper">
                <div className="card-icon learn-icon"></div>
              </div>
              <div className="card-content">
                <h3>Game Guide</h3>
                <p>Discover investment options, understand game mechanics, and learn about the team behind Vectra's financial education platform.</p>
                <div className="card-features">
                  <span className="feature-tag">Comprehensive</span>
                  <span className="feature-tag">Detailed</span>
                </div>
              </div>
              <button className="card-action-button" onClick={() => onNavigate('about')}>
                Learn More
                <span className="button-arrow">→</span>
              </button>
            </div>

            <div className="action-card">
              <div className="card-decoration"></div>
              <div className="card-icon-wrapper">
                <div className="card-icon chart-icon"></div>
              </div>
              <div className="card-content">
                <h3>Financial Markets</h3>
                <p>Learn how the Indian stock market works — Nifty, Sensex, bull/bear cycles — and view live charts for NSE & BSE indices.</p>
                <div className="card-features">
                  <span className="feature-tag">NSE / BSE</span>
                  <span className="feature-tag">Live Charts</span>
                  <span className="feature-tag">Learn</span>
                </div>
              </div>
              <button className="card-action-button" onClick={() => onNavigate('markets')}>
                Explore Markets
                <span className="button-arrow">→</span>
              </button>
            </div>
          </div>
        </section>

        {/* Quick Stats Section */}
        <section className="quick-stats">
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-icon trophy-icon"></div>
              <div className="stat-info">
                <span className="stat-number">0</span>
                <span className="stat-label">Games Played</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon chart-icon"></div>
              <div className="stat-info">
                <span className="stat-number">$0</span>
                <span className="stat-label">Best Score</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon star-icon"></div>
              <div className="stat-info">
                <span className="stat-number">0</span>
                <span className="stat-label">Achievements</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const MARKET_TOPICS = [
  {
    title: 'Introduction to Stock Markets',
    tag: 'Module 1',
    img: 'https://zerodha.com/varsity/wp-content/uploads/2014/07/M1-Ch1-title.jpg',
    body: 'Why invest? If you earn ₹50,000/month and save ₹20,000 as idle cash, after 20 years you accumulate only ₹1.7 Cr — barely 8 years of post-retirement expenses. Invest that surplus at 12% p.a. and it grows to ₹4.26 Cr. The stock market is an electronic marketplace where buyers and sellers transact in shares via NSE and BSE, regulated by SEBI.',
    points: [
      'Fight inflation, create wealth, meet financial aspirations — 3 reasons to invest',
      'Fixed Income (FDs, Bonds): 8–11% returns, low risk, capital protected',
      'Equity: 14–15% CAGR historically — best long-term wealth creator',
      'Real Estate: rental + appreciation, but illiquid and high capital needed',
      'Gold & Silver: ~8% CAGR, relatively safe hedge',
      'Asset Allocation: 70% equity, 20% gold, 10% fixed income for young investors',
      'NSE & BSE are India\'s two main exchanges; SEBI is the regulator',
      'Settlement happens in T+2 days; market hours 9:15 AM – 3:30 PM IST',
    ],
    chapters: [
      { title: 'Ch 1 — Why Invest?', content: 'Without investing, ₹50,000/month salary yields only ₹1.7 Cr in 20 years — barely 8 years of post-retirement life. Investing at 12% p.a. yields ₹4.26 Cr. Reasons: fight inflation, create wealth, meet aspirations.' },
      { title: 'Ch 2 — Asset Classes', content: 'Fixed Income: 8–11%, low risk. Equity: 14–15% CAGR, higher risk. Real Estate: illiquid, high capital. Bullion: ~8% CAGR. Diversify across all based on risk appetite.' },
      { title: 'Ch 3 — What is a Stock Market?', content: 'An electronic marketplace where buyers and sellers transact in shares. NSE and BSE are India\'s two primary exchanges. Access via SEBI-registered stockbroker only.' },
      { title: 'Ch 4 — Regulators & SEBI', content: 'SEBI regulates all market participants — brokers, depositories, listed companies. Protects investors and ensures fair, transparent markets.' },
      { title: 'Ch 5 — IPO Markets', content: 'IPO = company offering shares to public for first time to raise capital. Merchant bankers manage the process. After listing, shares trade freely on the exchange.' },
      { title: 'Ch 6 — How Stocks Trade', content: 'Prices move on demand/supply driven by company performance and sentiment. Place buy/sell orders via trading terminal. Returns = (Sell - Buy) / Buy × 100.' },
      { title: 'Ch 7 — Market Index (Nifty & Sensex)', content: 'Nifty 50 tracks top 50 NSE companies; Sensex tracks top 30 BSE companies. Free-float market-cap weighted. Sector indices: Nifty Bank, Nifty IT, Nifty Pharma.' },
      { title: 'Ch 8 — Key Jargons', content: 'Bull Market: rising prices. Bear Market: falling prices. Intraday: buy & sell same day. Delivery: hold overnight. Circuit breaker: halts trading at ±10%. Dividend: profit shared with shareholders.' },
    ],
  },
  {
    title: 'Technical Analysis',
    tag: 'Module 2',
    img: 'https://zerodha.com/varsity/wp-content/uploads/2014/10/M2-Ch3-Chart1.jpg',
    body: 'Technical Analysis (TA) studies historical price and volume data to forecast future price movements. Unlike fundamental analysis, TA can be applied to any asset class — equities, commodities, forex, fixed income — as long as historical time series data exists. Once you learn TA, you can apply it everywhere.',
    points: [
      'TA works on any asset class with historical price/volume data',
      'Candlestick: Open, High, Low, Close — green = bullish, red = bearish',
      'Support = price floor where buyers step in; Resistance = price ceiling',
      '50-day MA = medium-term trend; 200-day MA = long-term trend',
      'Golden Cross (50 MA > 200 MA) = bullish signal; Death Cross = bearish',
      'RSI > 70 = overbought; RSI < 30 = oversold',
      'Volume confirms price moves — high volume = strong trend',
      'Patterns: Head & Shoulders, Double Top, Flags signal reversals/continuations',
    ],
    chapters: [
      { title: 'Ch 1 — Introduction to TA', content: 'TA forecasts future price based on historical data. Assumption: all known information is already priced in. Works on equities, commodities, forex, bonds.' },
      { title: 'Ch 2 — Candlestick Charts', content: 'Each candle shows Open, High, Low, Close. Green candle = close > open (bullish). Red candle = close < open (bearish). Wicks show extremes.' },
      { title: 'Ch 3 — Support & Resistance', content: 'Support: price level where buying prevents further decline. Resistance: where selling caps upward movement. Broken resistance becomes new support.' },
      { title: 'Ch 4 — Moving Averages', content: '50-day MA tracks medium-term trend. 200-day MA tracks long-term trend. Golden Cross = 50 MA crosses above 200 MA (bullish). Death Cross = opposite.' },
      { title: 'Ch 5 — RSI & Momentum', content: 'RSI (Relative Strength Index) measures speed of price change. RSI > 70 = overbought (potential sell). RSI < 30 = oversold (potential buy).' },
      { title: 'Ch 6 — Volume Analysis', content: 'Volume confirms price moves. Rising price + rising volume = strong uptrend. Rising price + falling volume = weak move, possible reversal.' },
    ],
  },
  {
    title: 'Fundamental Analysis',
    tag: 'Module 3',
    img: 'https://zerodha.com/varsity/wp-content/uploads/2014/11/M3-Ch1-title.jpg',
    body: 'Fundamental Analysis (FA) is a holistic approach to study a business for long-term investing (3–5 years). Companies like Infosys, TCS, Page Industries, Eicher Motors have delivered 20%+ CAGR over 10 years. FA helps separate daily noise from underlying business performance to identify wealth-creating investments.',
    points: [
      'FA evaluates intrinsic value via financials — revenue, profit, debt, growth',
      'P/E Ratio: price paid per ₹1 of earnings — lower = cheaper stock',
      'ROE > 15% = efficient use of shareholder capital',
      'Debt/Equity < 1 = financially safe company',
      'EPS growth over 3–5 years = strong business momentum',
      'Read Annual Report: P&L, Balance Sheet, Cash Flow Statement',
      'Moat = competitive advantage that protects business from rivals',
      'At 20% CAGR, money doubles every 3.5 years',
    ],
    chapters: [
      { title: 'Ch 1 — Introduction to FA', content: 'FA studies business health for long-term investing. Infosys, TCS, Page Industries delivered 20%+ CAGR over 10 years. Focus on business, not daily price noise.' },
      { title: 'Ch 2 — P&L Statement', content: 'Revenue - Expenses = Net Profit. Track revenue growth, operating margins, and net profit margins over 5 years. Consistent growth = strong business.' },
      { title: 'Ch 3 — Balance Sheet', content: 'Assets = Liabilities + Equity. Check debt levels, current ratio (>1.5 is good), and book value. Low debt + high equity = financially strong.' },
      { title: 'Ch 4 — Cash Flow Statement', content: 'Operating cash flow > net profit = quality earnings. Free cash flow = operating CF - capex. Companies with strong FCF can fund growth without debt.' },
      { title: 'Ch 5 — Key Ratios', content: 'P/E: price/earnings. P/B: price/book value. ROE: net profit/equity. ROCE: operating profit/capital employed. Compare ratios with industry peers.' },
      { title: 'Ch 6 — Equity Research', content: 'Read annual reports, management commentary, and concall transcripts. Understand the business model, competitive moat, and growth runway before investing.' },
    ],
  },
  {
    title: 'Futures Trading',
    tag: 'Module 4',
    img: 'https://zerodha.com/varsity/wp-content/uploads/2015/01/M4-Ch1-title.jpg',
    body: 'Futures are derivative contracts to buy/sell an asset at a predetermined price on a future date. They originated from forward contracts in commodity markets. Futures offer leverage — you control a large position with a small margin. But leverage is a double-edged sword: amplifies both profits and losses.',
    points: [
      'Futures = agreement to buy/sell asset at fixed price on future date',
      'Leverage: control ₹5L position with just ₹50K margin (10x leverage)',
      'Mark to Market (M2M): daily profit/loss settled to your account',
      'Margin call: broker asks for more funds if losses erode margin',
      'Lot size: minimum quantity per futures contract (e.g., Nifty = 50 units)',
      'Expiry: futures expire on last Thursday of every month',
      'Rollover: carry position to next month before expiry',
      'Hedging: use futures to protect existing stock portfolio from downside',
    ],
    chapters: [
      { title: 'Ch 1 — Forward Contracts', content: 'Forwards are OTC agreements to buy/sell at a future date. Problem: counterparty risk. Futures solve this by trading on exchanges with clearing house guarantee.' },
      { title: 'Ch 2 — Futures Contract', content: 'Standardized forward contract traded on exchange. Key terms: lot size, expiry, margin, settlement price. Nifty futures lot = 50 units.' },
      { title: 'Ch 3 — Leverage & Payoff', content: 'Futures require only margin (5–15% of contract value). 10x leverage means 10% move in underlying = 100% gain/loss on margin. Use carefully.' },
      { title: 'Ch 4 — Mark to Market', content: 'Daily M2M: if your position loses ₹5,000 today, it is debited from your account. If it gains, it is credited. Keeps the system risk-free.' },
      { title: 'Ch 5 — Margin Calculator', content: 'SPAN margin + Exposure margin = Total margin required. Use broker\'s margin calculator before placing futures trades to know exact requirement.' },
    ],
  },
  {
    title: 'Options Theory',
    tag: 'Module 5',
    img: 'https://zerodha.com/varsity/wp-content/uploads/2015/05/M5-Ch1-title.jpg',
    body: 'Options are derivative contracts giving the buyer the RIGHT (not obligation) to buy/sell an asset at a fixed price before expiry. In India, ~80% of derivatives traded are options. A Call option gives right to BUY; a Put option gives right to SELL. The buyer pays a premium; the seller collects it.',
    points: [
      'Call Option: right to BUY underlying at strike price before expiry',
      'Put Option: right to SELL underlying at strike price before expiry',
      'Premium = price paid by buyer to seller for the option contract',
      'ITM (In The Money): option has intrinsic value — profitable to exercise',
      'OTM (Out of The Money): option has no intrinsic value',
      'ATM (At The Money): strike price = current market price',
      'Option Greeks: Delta, Gamma, Theta, Vega measure option sensitivity',
      'Theta decay: options lose value every day as expiry approaches',
    ],
    chapters: [
      { title: 'Ch 1 — Call Option Basics', content: 'Call option gives buyer right to buy at strike price. If stock rises above strike, call gains value. Max loss for buyer = premium paid. Max profit = unlimited.' },
      { title: 'Ch 2 — Put Option Basics', content: 'Put option gives buyer right to sell at strike price. If stock falls below strike, put gains value. Used for hedging or bearish bets.' },
      { title: 'Ch 3 — Option Greeks', content: 'Delta: change in option price per ₹1 move in underlying. Theta: time decay per day. Vega: sensitivity to volatility. Gamma: rate of change of delta.' },
      { title: 'Ch 4 — Moneyness', content: 'ITM Call: strike < market price. OTM Call: strike > market price. ATM: strike ≈ market price. ITM options have intrinsic value; OTM have only time value.' },
      { title: 'Ch 5 — Option Payoff', content: 'Long Call: profit when price rises above strike + premium. Long Put: profit when price falls below strike - premium. Sellers profit when options expire worthless.' },
    ],
  },
  {
    title: 'Option Strategies',
    tag: 'Module 6',
    img: 'https://zerodha.com/varsity/wp-content/uploads/2015/09/M6-Ch1-title.jpg',
    body: 'Option strategies combine multiple option positions to create specific risk-reward profiles. Strategies range from simple (Covered Call, Protective Put) to complex (Iron Condor, Butterfly). The key is matching the strategy to your market view — bullish, bearish, neutral, or volatile.',
    points: [
      'Bull Call Spread: buy lower strike call, sell higher strike call — limited risk/reward',
      'Bear Put Spread: buy higher strike put, sell lower strike put — bearish view',
      'Straddle: buy call + put at same strike — profit from big move either way',
      'Strangle: buy OTM call + OTM put — cheaper than straddle, needs bigger move',
      'Iron Condor: sell OTM call + put, buy further OTM call + put — profit in range',
      'Covered Call: own stock + sell call — generate income on existing holdings',
      'Protective Put: own stock + buy put — insurance against downside',
      'Calendar Spread: same strike, different expiry — profit from time decay difference',
    ],
    chapters: [
      { title: 'Ch 1 — Bull Call Spread', content: 'Buy ATM call + sell OTM call. Max profit = difference in strikes - net premium. Max loss = net premium paid. Best for moderately bullish view.' },
      { title: 'Ch 2 — Bear Put Spread', content: 'Buy ATM put + sell OTM put. Reduces cost of buying put. Max profit = difference in strikes - net premium. Best for moderately bearish view.' },
      { title: 'Ch 3 — Straddle & Strangle', content: 'Straddle: buy call + put at same strike. Profit if big move in either direction. Strangle: buy OTM call + put — cheaper but needs larger move.' },
      { title: 'Ch 4 — Iron Condor', content: 'Sell OTM call + put, buy further OTM call + put. Profit if underlying stays in a range. Max profit = net premium collected. Popular in low-volatility markets.' },
      { title: 'Ch 5 — Covered Call', content: 'Own 100 shares + sell 1 call option. Collect premium as income. If stock stays below strike, keep premium. If stock rises above strike, shares get called away.' },
    ],
  },
  {
    title: 'Markets & Taxation',
    tag: 'Module 7',
    img: 'https://zerodha.com/varsity/wp-content/uploads/2016/09/M7-Ch1-title.jpg',
    body: 'Understanding taxation is critical for every market participant. In India, market income is classified as Capital Gains (investor) or Business Income (trader). The classification determines your tax rate, audit requirements, and ability to carry forward losses. Wrong classification can lead to penalties.',
    points: [
      'LTCG (Long Term Capital Gain): equity held > 1 year — taxed at 10% above ₹1L',
      'STCG (Short Term Capital Gain): equity held < 1 year — taxed at 15%',
      'Intraday trading = speculative business income — taxed at slab rate',
      'F&O trading = non-speculative business income — taxed at slab rate',
      'Business losses can be carried forward for 8 years to offset future profits',
      'Tax Loss Harvesting: book losses before year-end to reduce tax liability',
      'Turnover > ₹1 Cr requires tax audit under Section 44AB',
      'STT (Securities Transaction Tax) is charged on every trade automatically',
    ],
    chapters: [
      { title: 'Ch 1 — Income Tax Basics', content: 'Income tax in India is levied on total income at slab rates. Market income can be capital gains or business income depending on your activity.' },
      { title: 'Ch 2 — Investor vs Trader', content: 'Investor: holds stocks > 1 year, pays LTCG/STCG. Trader: frequent buying/selling, income treated as business. F&O always = business income.' },
      { title: 'Ch 3 — Capital Gains Tax', content: 'LTCG on equity: 10% above ₹1L exemption. STCG on equity: 15%. Debt funds: taxed at slab rate. Index funds held > 3 years = LTCG.' },
      { title: 'Ch 4 — Business Income Tax', content: 'Intraday = speculative. F&O = non-speculative. Both taxed at income slab rate. Expenses like brokerage, internet, advisory fees are deductible.' },
      { title: 'Ch 5 — Tax Loss Harvesting', content: 'Book unrealized losses before March 31 to offset gains. Reduces tax liability. Can carry forward business losses for 8 years to offset future profits.' },
    ],
  },
  {
    title: 'Currency & Commodity Futures',
    tag: 'Module 8',
    img: 'https://zerodha.com/varsity/wp-content/uploads/2016/10/M8-Ch1-title.jpg',
    body: 'Beyond equities, traders can participate in Currency and Commodity futures markets. Currency pairs like USD-INR, EUR-INR, GBP-INR trade on NSE. Commodities like Gold, Silver, Crude Oil, Natural Gas trade on MCX. These markets offer diversification and hedging opportunities for businesses and traders.',
    points: [
      'Currency futures: USD-INR, EUR-INR, GBP-INR, JPY-INR on NSE/BSE',
      'RBI monetary policy and inflation are key drivers of currency rates',
      'Gold & Silver futures trade on MCX — hedge against inflation',
      'Crude Oil futures track global supply/demand and OPEC decisions',
      'Currency lot size: USD-INR = $1,000 per lot',
      'Commodity markets open 9 AM – 11:30 PM IST (extended hours)',
      'Interest Rate Futures: hedge against interest rate risk',
      'Currency hedging: importers/exporters use futures to lock exchange rates',
    ],
    chapters: [
      { title: 'Ch 1 — Currency Basics', content: 'Exchange rate = price of one currency in terms of another. USD-INR is most liquid pair in India. RBI intervenes to manage extreme volatility.' },
      { title: 'Ch 2 — Currency Futures', content: 'Trade USD-INR, EUR-INR, GBP-INR on NSE. Lot size = $1,000. Settlement in INR. Used by importers/exporters to hedge currency risk.' },
      { title: 'Ch 3 — Commodity Futures', content: 'MCX trades Gold, Silver, Crude Oil, Natural Gas, Copper. Prices driven by global supply/demand, USD strength, and geopolitical events.' },
      { title: 'Ch 4 — Gold & Silver', content: 'Gold = safe haven asset. Rises during uncertainty, inflation, weak USD. Silver = industrial + precious metal. Both trade on MCX with high liquidity.' },
      { title: 'Ch 5 — Interest Rate Futures', content: 'IRF allow hedging against interest rate changes. Bond prices move inversely to interest rates. Used by banks and large institutions to manage rate risk.' },
    ],
  },
  {
    title: 'Risk Management & Trading Psychology',
    tag: 'Module 9',
    img: 'https://zerodha.com/varsity/wp-content/uploads/2017/09/M9-C1-title.jpg',
    body: 'Risk management and trading psychology are the most underrated yet most important aspects of trading. Risk management goes beyond stop losses — it includes position sizing, portfolio risk, and drawdown management. Psychology covers why traders make irrational decisions and how to overcome cognitive biases.',
    points: [
      'Position sizing: never risk more than 1–2% of capital on a single trade',
      'Stop loss: predefined exit point to limit losses — always use it',
      'Risk:Reward ratio: minimum 1:2 — risk ₹1 to make ₹2',
      'Drawdown: peak-to-trough decline — manage to avoid account blowup',
      'Cognitive biases: confirmation bias, loss aversion, overconfidence',
      'Loss aversion: losses feel 2x more painful than equivalent gains',
      'Trading journal: record every trade with reason, entry, exit, outcome',
      'Process over outcome: focus on following your system, not individual P&L',
    ],
    chapters: [
      { title: 'Ch 1 — Risk Management Basics', content: 'Risk management = protecting capital. Never risk more than 1–2% per trade. Use stop losses. Diversify across sectors. Manage overall portfolio risk.' },
      { title: 'Ch 2 — Position Sizing', content: 'Position size = (Account risk %) / (Trade risk %). If account = ₹10L, risk 1% = ₹10,000. If stop loss = 5%, position size = ₹10,000/5% = ₹2L.' },
      { title: 'Ch 3 — Trading Psychology', content: 'Fear and greed drive markets. Fear of missing out (FOMO) leads to chasing trades. Fear of loss leads to holding losers too long. Awareness is the first step.' },
      { title: 'Ch 4 — Cognitive Biases', content: 'Confirmation bias: seeking info that confirms your view. Anchoring: fixating on entry price. Recency bias: overweighting recent events. Overcome with rules-based trading.' },
      { title: 'Ch 5 — Trading Journal', content: 'Record every trade: date, instrument, entry, exit, size, reason, outcome, emotion. Review weekly. Patterns in mistakes reveal areas for improvement.' },
    ],
  },
  {
    title: 'Trading Systems',
    tag: 'Module 10',
    img: 'https://zerodha.com/varsity/wp-content/uploads/2017/10/M10-Ch1-title.jpg',
    body: 'A trading system is a set of rules that define when to enter, exit, and size positions — removing emotion from trading. On Oct 25, 2017, Punjab National Bank\'s 160 Call option shot up 20,600% overnight after a government announcement. Trading systems help capture such opportunities systematically.',
    points: [
      'Trading system = rules-based approach to entering and exiting trades',
      'Removes emotion — trades are taken based on signals, not feelings',
      'Backtesting: test your system on historical data before going live',
      'Win rate × Avg win - Loss rate × Avg loss = Expectancy (must be positive)',
      'Trend following: buy breakouts, ride the trend, exit on reversal',
      'Mean reversion: buy oversold, sell overbought — works in ranging markets',
      'Algo trading: automate your system using code (Python, Amibroker)',
      'Paper trading: test system in real-time without real money first',
    ],
    chapters: [
      { title: 'Ch 1 — What is a Trading System?', content: 'A trading system defines entry rules, exit rules, and position sizing. Removes discretion and emotion. Can be manual or automated (algo trading).' },
      { title: 'Ch 2 — Backtesting', content: 'Test your system on historical data to see how it would have performed. Check win rate, average win/loss, max drawdown, and Sharpe ratio.' },
      { title: 'Ch 3 — Trend Following Systems', content: 'Buy when price breaks above resistance with volume. Hold as long as trend continues. Exit when price breaks below moving average or trailing stop.' },
      { title: 'Ch 4 — Mean Reversion Systems', content: 'Buy when RSI < 30 (oversold), sell when RSI > 70 (overbought). Works in sideways/ranging markets. Fails in strong trending markets.' },
      { title: 'Ch 5 — Algo Trading', content: 'Automate your trading system using Python + broker API. Removes execution errors and emotions. Requires coding skills and robust backtesting.' },
    ],
  },
  {
    title: 'Personal Finance & Mutual Funds',
    tag: 'Module 11',
    img: 'https://zerodha.com/varsity/wp-content/uploads/2017/09/M9-C3-title.jpg',
    body: 'Personal finance is about making your money work for you. Naval Ravikant says: "You will not get rich renting out your time. You must own equity — a piece of a business." Mutual funds are the simplest way to invest in equities — a professional manages a diversified portfolio on your behalf.',
    points: [
      'SIP (Systematic Investment Plan): invest fixed amount monthly — rupee cost averaging',
      'Equity mutual funds: higher risk, 12–15% long-term returns',
      'Debt funds: lower risk, 6–8% returns — better than FD post-tax',
      'Index funds: passively track Nifty/Sensex — expense ratio < 0.1%',
      'ELSS (Equity Linked Savings Scheme): tax saving + equity returns, 3-year lock-in',
      'Expense ratio: annual fee charged by fund — lower is better',
      'NAV (Net Asset Value): price per unit of mutual fund',
      'Diversify: large cap + mid cap + debt + gold for balanced portfolio',
    ],
    chapters: [
      { title: 'Ch 1 — Why Mutual Funds?', content: 'Mutual funds pool money from many investors into a diversified portfolio managed by a professional. Ideal for those who lack time or expertise to pick stocks.' },
      { title: 'Ch 2 — Types of Mutual Funds', content: 'Equity funds: stocks. Debt funds: bonds/FDs. Hybrid funds: mix of both. Index funds: track Nifty/Sensex passively. ELSS: tax-saving equity fund.' },
      { title: 'Ch 3 — SIP & Rupee Cost Averaging', content: 'SIP invests fixed amount monthly regardless of market level. Buy more units when market is low, fewer when high. Averages out cost over time.' },
      { title: 'Ch 4 — Index Funds vs Active Funds', content: 'Index funds track benchmark passively — expense ratio 0.05–0.1%. Active funds try to beat benchmark — expense ratio 1–2%. Most active funds underperform index over 10 years.' },
      { title: 'Ch 5 — Building a Portfolio', content: 'Young investor: 70% equity (index fund + mid cap), 20% gold ETF, 10% debt fund. Rebalance annually. Increase debt allocation as you approach retirement.' },
    ],
  },
];


const CHART_WIDGETS = [
  { label: 'Nifty 50', ticker: 'NIFTY', color: '#00ff9d', emoji: '📈', desc: 'Top 50 NSE stocks' },
  { label: 'Sensex', ticker: 'SENSEX', color: '#00d0ff', emoji: '🏦', desc: 'Top 30 BSE stocks' },
  { label: 'Bank Nifty', ticker: 'BANKNIFTY', color: '#a78bfa', emoji: '🏧', desc: 'Banking sector index' },
  { label: 'Nifty IT', ticker: 'NIFTYIT', color: '#fbbf24', emoji: '💻', desc: 'IT sector index' },
  { label: 'Nifty Pharma', ticker: 'CNXPHARMA', color: '#f472b6', emoji: '💊', desc: 'Pharma sector index' },
  { label: 'Nifty Midcap', ticker: 'NIFTY_MIDCAP_100', color: '#fb923c', emoji: '📊', desc: 'Midcap 100 index' },
];

const LEVEL_THRESHOLDS = [0, 100, 200, 300, 400];
const LEVEL_NAMES = ['Rookie', 'Learner', 'Analyst', 'Trader', 'Market Master'];
const BADGES = [
  { id: 'first', emoji: '', label: 'First Module', condition: (u) => u >= 1 },
  { id: 'half', emoji: '', label: 'Halfway There', condition: (u) => u >= 4 },
  { id: 'master', emoji: '', label: 'Market Master', condition: (u) => u >= 8 },
  { id: 'streak', emoji: '', label: 'On a Streak', condition: (_, xp) => xp >= 150 },
];

function TradingViewChart({ ticker, label, color, onClose }) {
  const chartRef = React.useRef(null);
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    if (!containerRef.current) return;

    // Generate realistic simulated price data for 1 year
    const basePrice = { NIFTY: 22000, SENSEX: 73000, BANKNIFTY: 48000, NIFTYIT: 35000, CNXPHARMA: 18000, NIFTY_MIDCAP_100: 50000 }[ticker] || 20000;
    const now = Math.floor(Date.now() / 1000);
    const oneDay = 86400;
    const data = [];
    let price = basePrice;
    for (let i = 365; i >= 0; i--) {
      const ts = now - i * oneDay;
      const d = new Date(ts * 1000);
      if (d.getDay() === 0 || d.getDay() === 6) continue;
      price = price * (1 + (Math.random() - 0.48) * 0.015);
      data.push({ time: ts, value: parseFloat(price.toFixed(2)) });
    }

    import('lightweight-charts').then((lc) => {
      const chart = lc.createChart(containerRef.current, {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
        layout: { background: { color: '#0a0e27' }, textColor: 'rgba(255,255,255,0.7)' },
        grid: { vertLines: { color: 'rgba(255,255,255,0.05)' }, horzLines: { color: 'rgba(255,255,255,0.05)' } },
        rightPriceScale: { borderColor: 'rgba(255,255,255,0.1)' },
        timeScale: { borderColor: 'rgba(255,255,255,0.1)', timeVisible: true },
      });
      chartRef.current = chart;
      const seriesColor = color || '#00ff9d';
      const series = chart.addSeries(lc.AreaSeries, {
        lineColor: seriesColor,
        topColor: seriesColor + '33',
        bottomColor: seriesColor + '00',
        lineWidth: 2,
      });
      series.setData(data);
      chart.timeScale().fitContent();

      const ro = new ResizeObserver(() => {
        if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth, height: containerRef.current.clientHeight });
      });
      ro.observe(containerRef.current);
      return () => { ro.disconnect(); chart.remove(); };
    });
  }, [ticker, color]);

  return (
    <div className="chart-modal-overlay" onClick={onClose}>
      <div className="chart-modal" onClick={e => e.stopPropagation()}>
        <button className="chart-modal-close" onClick={onClose}>×</button>
        <div style={{ padding: '8px 16px', background: 'rgba(0,255,157,0.08)', borderBottom: '1px solid rgba(0,255,157,0.2)', color: '#00ff9d', fontWeight: 700, fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{label} — Simulated 1Y Chart</span>
          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Indicative Data</span>
        </div>
        <div ref={containerRef} style={{ width: '100%', height: 'calc(100% - 40px)' }} />
      </div>
    </div>
  );
}

function MarketsPage({ onBack, onSignOut, loading }) {
  const [activeTab, setActiveTab] = React.useState('learn');
  const [activeChart, setActiveChart] = React.useState(null);
  const [unlockedModules, setUnlockedModules] = React.useState([0]);
  const [completedModules, setCompletedModules] = React.useState([]);
  const [xp, setXp] = React.useState(0);
  const [xpFlash, setXpFlash] = React.useState(false);
  const [streak, setStreak] = React.useState(0);

  const level = LEVEL_THRESHOLDS.filter(t => xp >= t).length - 1;
  const levelName = LEVEL_NAMES[level] || 'Market Master';
  const nextLevelXp = LEVEL_THRESHOLDS[level + 1] || 400;
  const prevLevelXp = LEVEL_THRESHOLDS[level] || 0;
  const levelProgress = ((xp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100;
  const earnedBadges = BADGES.filter(b => b.condition(unlockedModules.length, xp));

  const completeModule = (i) => {
    if (completedModules.includes(i)) return;
    setCompletedModules(prev => [...prev, i]);
    const next = i + 1;
    if (next < MARKET_TOPICS.length) setUnlockedModules(prev => [...prev, next]);
    setXp(prev => prev + 50);
    setStreak(prev => prev + 1);
    setXpFlash(true);
    setTimeout(() => setXpFlash(false), 800);
  };

  return (
    <div className="home-container">
      {activeChart && <TradingViewChart ticker={activeChart.ticker} label={activeChart.label} color={activeChart.color} onClose={() => setActiveChart(null)} />}
      <nav className="navbar">
        <div className="navbar-brand"><h2>Vectra</h2></div>
        <div className="navbar-menu">
          <button className="nav-button" onClick={onBack}>Dashboard</button>
          <button className="nav-button active">Markets</button>
          <div className={`xp-badge${xpFlash ? ' xp-flash' : ''}`}> {xp} XP</div>
          <div className="streak-badge"> {streak} Streak</div>
          <button className="nav-button signout" onClick={onSignOut} disabled={loading}>{loading ? 'Signing out...' : 'Sign Out'}</button>
        </div>
      </nav>

      <main className="about-main">
        <section className="markets-hero">
          <div className="markets-hero-left">
            <div className="about-badge">Market Training Arena</div>
            <h1 className="about-title">Level Up Your<span className="title-accent"> Market IQ</span></h1>
            <p className="about-subtitle">Complete modules, earn XP, unlock badges. Become a Market Master.</p>
            <div className="level-display">
              <div className="level-ring"><span className="level-num">{level + 1}</span></div>
              <div className="level-info">
                <span className="level-name">{levelName}</span>
                <div className="xp-bar-track">
                  <div className="xp-bar-fill" style={{ width: `${Math.min(levelProgress, 100)}%` }} />
                </div>
                <span className="xp-bar-label">{xp} / {nextLevelXp} XP to next level</span>
              </div>
            </div>
          </div>
          <div className="badges-panel">
            <div className="badges-title">Badges</div>
            <div className="badges-grid">
              {BADGES.map(b => (
                <div key={b.id} className={`badge-item${earnedBadges.find(e => e.id === b.id) ? ' earned' : ' locked-badge'}`}>
                  <span className="badge-emoji">{b.emoji}</span>
                  <span className="badge-label">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="markets-stats-row">
          <div className="mstat"><span className="mstat-val">{completedModules.length}</span><span className="mstat-label">Completed</span></div>
          <div className="mstat"><span className="mstat-val">{MARKET_TOPICS.length - completedModules.length}</span><span className="mstat-label">Remaining</span></div>
          <div className="mstat"><span className="mstat-val">{xp}</span><span className="mstat-label">Total XP</span></div>
          <div className="mstat"><span className="mstat-val">{streak}</span><span className="mstat-label"> Streak</span></div>
        </div>

        <div className="markets-tab-row">
          <button className={`markets-tab${activeTab === 'learn' ? ' active' : ''}`} onClick={() => setActiveTab('learn')}>Learn Modules</button>
          <button className={`markets-tab${activeTab === 'charts' ? ' active' : ''}`} onClick={() => setActiveTab('charts')}>Live Charts</button>
        </div>

        {activeTab === 'learn' && (
          <div className="modules-grid">
            {MARKET_TOPICS.map((topic, i) => {
              const locked = !unlockedModules.includes(i);
              const done = completedModules.includes(i);
              return (
                <div key={i} className={`module-card${locked ? ' locked' : ''}${done ? ' done' : ''}`}>
                  <div className="module-img-wrap">
                    <img src={topic.img} alt={topic.title} onError={e => { e.target.style.display = 'none'; }} />
                    {locked && <div className="module-lock-overlay"><span>Complete previous module</span></div>}
                    {done && <div className="module-done-overlay">✓<span>Completed!</span></div>}
                    <div className="module-tag">{topic.tag}</div>
                    <div className="module-xp-badge">+50 XP</div>
                    <div className="module-num">#{i + 1}</div>
                  </div>
                  <div className="module-body">
                    <h3>{topic.title}</h3>
                    <p>{topic.body}</p>
                    <ul className="module-points">
                      {topic.points.map((pt, j) => (
                        <li key={j}><span className="check">✓</span>{pt}</li>
                      ))}
                    </ul>
                    {topic.chapters && (
                      <div className="module-chapters">
                        <div className="chapters-title">Chapters</div>
                        {topic.chapters.map((ch, j) => (
                          <details key={j} className="chapter-item">
                            <summary className="chapter-summary">{ch.title}</summary>
                            <p className="chapter-content">{ch.content}</p>
                          </details>
                        ))}
                      </div>
                    )}
                    {!locked && (
                      <button
                        className={`module-complete-btn${done ? ' done-btn' : ''}`}
                        onClick={() => completeModule(i)}
                        disabled={done}
                      >
                        {done ? '+50 XP Earned' : 'Complete & Earn 50 XP'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'charts' && (
          <div className="charts-arena">
            <p className="charts-subtitle">Click any index to view its live chart in this panel</p>
            <div className="charts-grid">
              {CHART_WIDGETS.map((c, i) => (
                <button key={i} className="chart-card" style={{ '--chart-color': c.color }} onClick={() => setActiveChart(c)}>
                  <div className="chart-card-emoji">{c.emoji}</div>
                  <div className="chart-card-label">{c.label}</div>
                  <div className="chart-card-desc">{c.desc}</div>
                  <div className="chart-card-cta">Open Live Chart →</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function AboutPage({ username, onBack, onSignOut, loading }) {
  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>Vectra</h2>
        </div>
        <div className="navbar-menu">
          <button className="nav-button" onClick={onBack}>Dashboard</button>
          <button className="nav-button active">About</button>
          <button className="nav-button signout" onClick={onSignOut} disabled={loading}>
            {loading ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </nav>

      <main className="about-main">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-content">
            <div className="about-badge">Financial Education Platform</div>
            <h1 className="about-title">
              Vectra
              <span className="title-accent">Financial Simulation</span>
            </h1>
            <p className="about-subtitle">
              Master real-world financial decisions through competitive multiplayer gameplay.
              Build wealth, manage risk, and compete with strategic investment choices.
            </p>
          </div>
        </section>

        {/* Key Features */}
        <section className="features-section">
          <h2 className="section-title">Core Experience</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-number">01</div>
              <div className="feature-content">
                <h3>Strategic Investment</h3>
                <p>Allocate your portfolio across multiple asset classes with realistic risk-return profiles. Make decisions that impact your long-term wealth accumulation.</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-number">02</div>
              <div className="feature-content">
                <h3>Risk Management</h3>
                <p>Navigate market volatility and unexpected life events. Use insurance products and diversification strategies to protect your financial progress.</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-number">03</div>
              <div className="feature-content">
                <h3>Multiplayer Competition</h3>
                <p>Compete with real players in timed decision rounds. Compare strategies and learn from different approaches to wealth building.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Game Mechanics */}
        <section className="mechanics-section">
          <div className="mechanics-grid">
            <div className="mechanics-content">
              <h2 className="section-title">Game Mechanics</h2>
              <div className="mechanics-list">
                <div className="mechanic-item">
                  <strong>Year-Based Rounds</strong>
                  <span>Each turn represents one financial year with income, expenses, and investment decisions.</span>
                </div>
                <div className="mechanic-item">
                  <strong>Progressive Unlocks</strong>
                  <span>New investment options become available as you advance through years, mimicking real-life financial maturity.</span>
                </div>
                <div className="mechanic-item">
                  <strong>Dynamic Events</strong>
                  <span>Random market conditions and life events test your financial resilience and planning skills.</span>
                </div>
                <div className="mechanic-item">
                  <strong>Performance Tracking</strong>
                  <span>Detailed analytics show your wealth growth, risk exposure, and decision impact over time.</span>
                </div>
              </div>
            </div>
            
            <div className="investment-showcase">
              <h3>Investment Portfolio</h3>
              <div className="investment-options">
                <div className="investment-tier tier-safe">
                  <div className="tier-label">Conservative</div>
                  <div className="investment-option">
                    <span className="option-name">Savings Account</span>
                    <span className="option-return">4.0% Fixed</span>
                  </div>
                  <div className="investment-option">
                    <span className="option-name">Government Bonds</span>
                    <span className="option-return">3.5-5.0%</span>
                  </div>
                </div>
                
                <div className="investment-tier tier-moderate">
                  <div className="tier-label">Moderate</div>
                  <div className="investment-option">
                    <span className="option-name">Mutual Funds</span>
                    <span className="option-return">8-12%</span>
                  </div>
                  <div className="investment-option">
                    <span className="option-name">Index Funds</span>
                    <span className="option-return">7-11%</span>
                  </div>
                </div>
                
                <div className="investment-tier tier-aggressive">
                  <div className="tier-label">Aggressive</div>
                  <div className="investment-option">
                    <span className="option-name">Individual Stocks</span>
                    <span className="option-return">±20%</span>
                  </div>
                  <div className="investment-option">
                    <span className="option-name">Cryptocurrency</span>
                    <span className="option-return">±40%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <div className="team-card">
            <h2>Built by Team Vectra</h2>
            <p>
              Developed for hackathon competition, Vectra combines rigorous financial education 
              principles with engaging game mechanics. Our goal is to make financial literacy 
              accessible and practical through hands-on experience.
            </p>
            <div className="team-stats">
              <div className="stat">
                <span className="stat-number">6</span>
                <span className="stat-label">Asset Classes</span>
              </div>
              <div className="stat">
                <span className="stat-number">10+</span>
                <span className="stat-label">Event Types</span>
              </div>
              <div className="stat">
                <span className="stat-number">∞</span>
                <span className="stat-label">Learning Potential</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function App() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [route, setRoute] = useState('auth'); // Add routing state
  const [roomForm, setRoomForm] = useState({
    createName: '',
    createPlayerName: '',
    joinName: '',
    joinPlayerName: '',
  });
  const [roomCode, setRoomCode] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [integerUserId, setIntegerUserId] = useState(null);


  
  const isConfigured = useMemo(() => Boolean(supabase), []);

  const navigate = (path) => {
    setRoute(path);
    resetFeedback();
  };

  useEffect(() => {
    if (!supabase) {
      return undefined;
    }

    let isMounted = true;

    const loadSession = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (isMounted) {
        setSession(currentSession);
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (isMounted) {
        setSession(currentSession);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetFeedback = () => {
    setError('');
    setMessage('');
  };

  const isValidGmail = (email) => /^[^\s@]+@gmail\.com$/i.test(email.trim());

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetFeedback();

    if (!supabase) {
      setError('Supabase is not configured. Add your env keys first.');
      return;
    }

    const email = form.email.trim().toLowerCase();
    const password = form.password.trim();
    const username = form.username.trim();

    if (!isValidGmail(email)) {
      setError('Please enter a valid Gmail address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'register' && username.length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'register') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
            },
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        setMessage(
          'Registration successful. Check your Gmail inbox for a confirmation link if email confirmation is enabled.'
        );
        setForm(initialForm);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw signInError;
        }

        setMessage('Login successful.');
      }
    } catch (authError) {
      setError(authError.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    resetFeedback();

    if (!supabase) {
      return;
    }

    setLoading(true);

    try {
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        throw signOutError;
      }

      setMessage('You have been signed out.');
    } catch (signOutError) {
      setError(signOutError.message || 'Unable to sign out right now.');
    } finally {
      setLoading(false);
    }
  };
const handleGoogleAuth = async () => {
    resetFeedback();
    if (!supabase) {
      setError('Supabase is not configured.');
      return;
    }

    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (googleError) throw googleError;
    } catch (err) {
      setError(err.message);
    }
  };
  const handleRoomChange = (event) => {
    const { name, value } = event.target;
    setRoomForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCreateRoom = async (event) => {
    event.preventDefault();
    resetFeedback();
    setLoading(true);
    
    try {
      if (!roomForm.createName.trim()) {
        setError('Please enter a room name');
        setLoading(false);
        return;
      }
      
      if (!roomForm.createPlayerName.trim()) {
        setError('Please enter your player name');
        setLoading(false);
        return;
      }
      
      // Generate a random room code as integer (6-digit number: 100000-999999)
      const generatedRoomCode = Math.floor(100000 + Math.random() * 900000);
      
      // Create room in Supabase
      if (supabase) {
        // First, create or get user in the users table
        const { data: existingUsers, error: userCheckError } = await supabase
          .from('users')
          .select('user_id')
          .eq('auth_id', currentUser?.id);

        let userId;
        
        if (!existingUsers || existingUsers.length === 0) {
          // User doesn't exist, create new user record
          const { data: newUser, error: userCreateError } = await supabase
            .from('users')
            .insert({
              name: roomForm.createPlayerName,
              auth_id: currentUser?.id,
            })
            .select('user_id')
            .single();

          if (userCreateError) {
            console.error('User creation error:', userCreateError);
            setError(`Failed to create user: ${userCreateError.message}`);
            setLoading(false);
            return;
          }
          userId = newUser.user_id;
        } else {
          userId = existingUsers[0].user_id;
        }

        // Create room
        const { data: room, error: roomError } = await supabase
          .from('rooms')
          .insert({
            room_code: generatedRoomCode,
            current_year: 1,
            total_years: 6,
            status: 'waiting',
          })
          .select()
          .single();

        if (roomError) {
          console.error('Room creation error:', roomError);
          setError(`Failed to create room: ${roomError.message}`);
          setLoading(false);
          return;
        }

        // Get the actual room_id from the response
        const roomId = room.room_id;

        // Add player to room
        const { error: playerError } = await supabase
          .from('room_players')
          .insert({
            room_id: roomId,
            user_id: userId,
            starting_wealth: 50000,
            current_wealth: 50000,
            salary: 300000,
            current_year: 1,
          });

        if (playerError) {
          console.error('Player add error:', playerError);
          setError(`Failed to add player: ${playerError.message}`);
          setLoading(false);
          return;
        }

        setRoomCode(generatedRoomCode);
        setSelectedRoomId(roomId);
        setIntegerUserId(userId);
        setMessage(`Game room "${roomForm.createName}" created! Code: ${generatedRoomCode}`);
        setRoomForm({ ...roomForm, createName: '', createPlayerName: '' });
        
        // Navigate to game after a short delay
        setTimeout(() => {
          setLoading(false);
          navigate('game');
        }, 500);
      } else {
        // Supabase not configured - use local game
        setRoomCode(generatedRoomCode);
        setSelectedRoomId(generatedRoomCode);
        setMessage(`Game room created locally! Code: ${generatedRoomCode}`);
        setRoomForm({ ...roomForm, createName: '', createPlayerName: '' });
        
        setTimeout(() => {
          setLoading(false);
          navigate('game');
        }, 500);
      }
    } catch (err) {
      console.error('Error creating room:', err);
      setError(err.message || 'Failed to create room');
      setLoading(false);
    }
  };

  const handleJoinRoom = async (event) => {
    event.preventDefault();
    resetFeedback();
    setLoading(true);
    
    try {
      if (!roomForm.joinName.trim()) {
        setError('Please enter a room code');
        setLoading(false);
        return;
      }
      
      if (!roomForm.joinPlayerName.trim()) {
        setError('Please enter your player name');
        setLoading(false);
        return;
      }

      const roomCodeToJoin = roomForm.joinName;

      // Verify room exists in Supabase
      if (supabase) {
        const { data: room, error: roomError } = await supabase
          .from('rooms')
          .select('room_id, total_years')
          .eq('room_code', roomCodeToJoin)
          .single();

        if (roomError || !room) {
          setError(`Room code "${roomCodeToJoin}" not found`);
          setLoading(false);
          return;
        }

        // First, create or get user in the users table
        const { data: existingUsers, error: userCheckError } = await supabase
          .from('users')
          .select('user_id')
          .eq('auth_id', currentUser?.id);

        let userId;
        
        if (!existingUsers || existingUsers.length === 0) {
          // User doesn't exist, create new user record
          const { data: newUser, error: userCreateError } = await supabase
            .from('users')
            .insert({
              name: roomForm.joinPlayerName,
              auth_id: currentUser?.id,
            })
            .select('user_id')
            .single();

          if (userCreateError) {
            console.error('User creation error:', userCreateError);
            setError(`Failed to create user: ${userCreateError.message}`);
            setLoading(false);
            return;
          }
          userId = newUser.user_id;
        } else {
          userId = existingUsers[0].user_id;
        }

        const roomId = room.room_id;

        // Add player to room
        const { error: playerError } = await supabase
          .from('room_players')
          .insert({
            room_id: roomId,
            user_id: userId,
            starting_wealth: 50000,
            current_wealth: 50000,
            salary: 300000,
            current_year: 1,
          });

        if (playerError) {
          console.error('Player add error:', playerError);
          setError(`Failed to join room: ${playerError.message}`);
          setLoading(false);
          return;
        }

        setRoomCode(roomCodeToJoin);
        setSelectedRoomId(roomId);
        setIntegerUserId(userId);
        setMessage(`Successfully joined room "${roomCodeToJoin}"!`);
      } else {
        // Supabase not configured - allow local join
        setRoomCode(roomCodeToJoin);
        setSelectedRoomId(roomCodeToJoin);
        setMessage(`Joining room "${roomCodeToJoin}"...`);
      }
      
      setRoomForm({ 
        ...roomForm, 
        joinName: '',
        joinPlayerName: '',
      });
      
      // Navigate to game after a short delay
      setTimeout(() => {
        setLoading(false);
        navigate('game');
      }, 500);
    } catch (err) {
      console.error('Join room error:', err);
      setError('An error occurred while joining the room');
      setLoading(false);
    }
  };

  const fetchLeaderboard = async (roomId) => {
    try {
      if (!supabase) return;

      const { data: players, error } = await supabase
        .from('room_players')
        .select('player_name, current_wealth, users(email)')
        .eq('room_id', roomId)
        .order('current_wealth', { ascending: false });

      if (error) {
        console.error('Leaderboard fetch error:', error);
        return;
      }

      setLeaderboard(players || []);
    } catch (err) {
      console.error('Leaderboard error:', err);
    }
  };

  const currentUser = session?.user;
  const username =
    currentUser?.user_metadata?.username ||
    currentUser?.user_metadata?.full_name ||
    currentUser?.email?.split('@')[0] ||
    'User';

  // Add routing logic based on authentication and route state
  useEffect(() => {
    if (currentUser) {
      if (route === 'auth') {
        navigate('dashboard');
      }
    } else {
      if (route !== 'auth') {
        navigate('auth');
      }
    }
  }, [currentUser]);

  // Handle different routes for authenticated users
  if (currentUser && route === 'dashboard') {
    return (
      <DashboardPage
        username={username}
        onNavigate={(path) => {
          if (path === 'quiz') {
            setMessage('Quiz feature coming soon!');
            return;
          }
          navigate(path);
        }}
        onSignOut={handleSignOut}
        loading={loading}
      />
    );
  }

  if (currentUser && route === 'markets') {
    return (
      <MarketsPage
        onBack={() => navigate('dashboard')}
        onSignOut={handleSignOut}
        loading={loading}
      />
    );
  }

  if (currentUser && route === 'about') {
    return (
      <AboutPage
        username={username}
        onBack={() => navigate('dashboard')}
        onSignOut={handleSignOut}
        loading={loading}
      />
    );
  }

  if (currentUser && route === 'game') {
    return (
      <GameScreen
        roomCode={roomCode}
        roomId={selectedRoomId}
        userId={currentUser?.id}
        integerUserId={integerUserId}
        onBackToMenu={() => navigate('home')}
      />
    );
  }

  if (currentUser && route === 'home') {
    return (
      <HomePage
        currentUser={currentUser}
        username={username}
        roomForm={roomForm}
        error={error}
        message={message}
        loading={loading}
        onRoomChange={handleRoomChange}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        onSignOut={handleSignOut}
        onBackToDashboard={() => navigate('dashboard')}
      />
    );
  }

  return (
    <>
      {!isConfigured ? (
        <main className="app-shell">
          <FloatingSymbols />
          <section className="hero-panel">
            <p className="eyebrow">Vectra Financial Game</p>
            <h1>Configuration Required</h1>
            <p className="hero-copy">
              Add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY to
              your .env file, then restart the application.
            </p>
          </section>
        </main>
      ) : currentUser ? (
        <HomePage
          currentUser={currentUser}
          username={username}
          roomForm={roomForm}
          error={error}
          message={message}
          loading={loading}
          onRoomChange={handleRoomChange}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          onSignOut={handleSignOut}
        />
      ) : (
        <main className="app-shell">
          {/* Subtle grid overlay for tech feel */}
          <div className="grid-overlay"></div>
          
          {/* Animated data streams */}
          <div className="data-streams">
            <div className="stream stream-1"></div>
            <div className="stream stream-2"></div>
            <div className="stream stream-3"></div>
          </div>

          <FloatingSymbols />
          
          <section className="hero-panel">
            <div className="hero-header">
              <p className="eyebrow">Vectra Financial Game</p>
              <h1>
                Master Your
                <span className="highlight-text"> Financial Future</span>
              </h1>
            </div>
            
            <p className="hero-copy">
              Compete in multiplayer financial simulation. Make strategic investment decisions, 
              manage risk, and build wealth over multiple years. Test your financial skills 
              against real players in dynamic market scenarios.
            </p>
            
            <div className="feature-list">
              <div className="feature-badge">
                <span>Investment Strategy</span>
              </div>
              <div className="feature-badge">
                <span>Risk Management</span>
              </div>
              <div className="feature-badge">
                <span>Multiplayer Rooms</span>
              </div>
              <div className="feature-badge">
                <span>Real-Time Competition</span>
              </div>
            </div>
          </section>

          <section className="auth-panel">
            <div className="auth-card">
              <div className="tab-row">
                <button
                  type="button"
                  className={mode === 'login' ? 'tab active' : 'tab'}
                  onClick={() => {
                    setMode('login');
                    resetFeedback();
                  }}
                >
                  Login
                </button>
                <button
                  type="button"
                  className={mode === 'register' ? 'tab active' : 'tab'}
                  onClick={() => {
                    setMode('register');
                    resetFeedback();
                  }}
                >
                  Register
                </button>
              </div>

              <h2>{mode === 'login' ? 'Player Login' : 'Join Vectra'}</h2>
              <p className="panel-copy">
                {mode === 'login'
                  ? 'Sign in to access your player profile and join game rooms.'
                  : 'Create a player account to compete in financial simulation matches.'}
              </p>

              <button
                type="button"
                className="google-button"
                onClick={handleGoogleAuth}
                disabled={loading}
              >
                {loading ? 'Connecting...' : 'Quick Start with Google'}
              </button>

              <div className="divider">
                <span>or continue with email</span>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                {mode === 'register' ? (
                  <label className="input-group">
                    <span>Player Name</span>
                    <input
                      type="text"
                      name="username"
                      placeholder="Enter your player name"
                      value={form.username}
                      onChange={handleChange}
                      autoComplete="username"
                    />
                  </label>
                ) : null}

                <label className="input-group">
                  <span>Email Address</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="user@example.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </label>

                <label className="input-group">
                  <span>Password</span>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete={
                      mode === 'login' ? 'current-password' : 'new-password'
                    }
                  />
                </label>

                {error ? <p className="feedback error">{error}</p> : null}
                {message ? <p className="feedback success">{message}</p> : null}

                <button type="submit" className="primary-button" disabled={loading}>
                  {loading
                    ? mode === 'login'
                      ? 'Logging In...'
                      : 'Creating Player...'
                    : mode === 'login'
                      ? 'Enter Game'
                      : 'Start Playing'}
                </button>
              </form>
            </div>
          </section>
        </main>
      )}
    </>
  );
}

export default App;
