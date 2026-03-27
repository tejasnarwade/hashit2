import React, { useState } from 'react';
import './InvestmentSimulator.css';

function InvestmentSimulator({ onBack, onSignOut, loading }) {
  // Wallet State
  const [balance, setBalance] = useState(10000);

  // Step Management
  const [step, setStep] = useState(0); // 0 = initial, 1 = choose type, 2 = choose asset, 3 = enter amount, 4 = see news, 5 = show result, 6 = show advice

  // Investment Data
  const [investmentType, setInvestmentType] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [amount, setAmount] = useState('');
  const [news, setNews] = useState('');
  const [profit, setProfit] = useState(0);
  const [newBalance, setNewBalance] = useState(balance);
  const [advice, setAdvice] = useState('');

  // Investment Types and Assets
  const investmentTypes = [
    { name: 'Stock Market', emoji: '📈' },
    { name: 'Crypto', emoji: '₿' },
    { name: 'Gold', emoji: '🏆' },
    { name: 'Bank FD', emoji: '🏦' },
    { name: 'Startup', emoji: '🚀' },
  ];

  const assetsByType = {
    'Stock Market': ['TCS', 'Infosys', 'Tesla', 'Reliance', 'Adani', 'AI Startup'],
    'Crypto': ['Bitcoin', 'Ethereum', 'Dogecoin', 'NewCoin'],
    'Gold': ['Gold ETF', 'Digital Gold', 'Gold Coin'],
    'Bank FD': ['Bank FD', 'Post Office', 'Gov Bond'],
    'Startup': ['AI Startup', 'Food Startup', 'Game Startup'],
  };

  const newsList = [
    'Market going up 📈',
    'Market crash 📉',
    'Tech boom 🚀',
    'Crypto crash 💥',
    'Gold price rising 🏆',
    'Startup failed ❌',
    'Market stable 😐',
  ];

  // Step 1: Choose Investment Type
  const handleTypeSelect = (type) => {
    setInvestmentType(type);
    setStep(2);
  };

  // Step 2: Choose Asset
  const handleAssetSelect = (asset) => {
    setSelectedAsset(asset);
    setStep(3);
  };

  // Step 3: Enter Amount and Validate
  const handleAmountSubmit = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > balance) {
      alert(`Insufficient balance! You only have ₹${balance}`);
      return;
    }

    // Pick random news
    const randomNews = newsList[Math.floor(Math.random() * newsList.length)];
    setNews(randomNews);
    setStep(4);

    // Simulate market news delay
    setTimeout(() => {
      calculateProfitLoss(randomNews);
    }, 1500);
  };

  // Step 4: Calculate Profit/Loss based on news
  const calculateProfitLoss = (marketNews) => {
    const investmentAmount = parseFloat(amount);
    let profitPercent = 0;

    if (
      marketNews.includes('going up') ||
      marketNews.includes('Tech boom') ||
      marketNews.includes('rising')
    ) {
      // Good news
      profitPercent = 10 + Math.random() * 20; // 10% to 30%
    } else if (
      marketNews.includes('crash') ||
      marketNews.includes('failed')
    ) {
      // Bad news
      profitPercent = -(10 + Math.random() * 30); // -10% to -40%
    } else {
      // Stable news
      profitPercent = -5 + Math.random() * 10; // -5% to 5%
    }

    const calculatedProfit = (investmentAmount * profitPercent) / 100;
    const calculatedNewBalance = balance - investmentAmount + investmentAmount + calculatedProfit;

    setProfit(calculatedProfit);
    setNewBalance(calculatedNewBalance);

    // Generate AI Advice
    generateAdvice(profitPercent >= 0 ? 'profit' : 'loss', calculatedProfit, calculatedNewBalance);

    setStep(5);
  };

  // Step 5: Generate AI Advice
  const generateAdvice = (resultType, calcProfit, newBal) => {
    let adviceText = '';

    if (resultType === 'loss') {
      adviceText = '⚠️ High risk investment. Try safer options like Bank FD or Gold ETF next time.';
    } else {
      adviceText = '✅ Excellent investment decision! You have a knack for picking winners.';
    }

    if (newBal < 2000) {
      adviceText += ' 💰 You should save more money before investing again.';
    }

    setAdvice(adviceText);
    setStep(6);
  };

  // Reset for new investment
  const handleInvestAgain = () => {
    setBalance(newBalance);
    setStep(1);
    setInvestmentType(null);
    setSelectedAsset(null);
    setAmount('');
    setNews('');
    setProfit(0);
    setNewBalance(newBalance);
    setAdvice('');
  };

  // STEP 1: Welcome Screen
  if (step === 0) {
    return (
      <div className="home-container">
        <nav className="navbar">
          <div className="navbar-brand">
            <h2>Vectra</h2>
          </div>
          <div className="navbar-menu">
            <button className="nav-button" onClick={onBack}>Dashboard</button>
            <button className="nav-button signout" onClick={onSignOut} disabled={loading}>
              {loading ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </nav>

        <main className="investment-main">
          <div className="investment-container">
            <div className="investment-card welcome-card">
              <div className="card-header-large">
                <h1>Investment Simulator 💰</h1>
                <p>Learn to invest with virtual money!</p>
              </div>

              <div className="welcome-content">
                <div className="balance-display">
                  <span className="balance-label">Your Wallet Balance</span>
                  <span className="balance-amount">₹{balance.toFixed(2)}</span>
                </div>

                <div className="welcome-features">
                  <div className="feature">
                    <span className="feature-icon">🎯</span>
                    <span className="feature-text">Choose from 5 investment types</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">📊</span>
                    <span className="feature-text">Pick your preferred assets</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">🎲</span>
                    <span className="feature-text">Experience random market events</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">📈</span>
                    <span className="feature-text">See instant profit or loss</span>
                  </div>
                </div>

                <button className="btn-primary-large" onClick={() => setStep(1)}>
                  Start Investing Now →
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // STEP 2: Choose Investment Type
  if (step === 1) {
    return (
      <div className="home-container">
        <nav className="navbar">
          <div className="navbar-brand">
            <h2>Vectra</h2>
          </div>
          <div className="navbar-menu">
            <button className="nav-button" onClick={onBack}>Dashboard</button>
            <button className="nav-button signout" onClick={onSignOut} disabled={loading}>
              {loading ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </nav>

        <main className="investment-main">
          <div className="investment-container">
            <div className="investment-card">
              <div className="card-header-large">
                <h1>Step 1: Choose Investment Type</h1>
                <p>What would you like to invest in?</p>
              </div>

              <div className="investment-type-grid">
                {investmentTypes.map((type) => (
                  <button
                    key={type.name}
                    className="investment-type-card"
                    onClick={() => handleTypeSelect(type.name)}
                  >
                    <span className="type-emoji">{type.emoji}</span>
                    <span className="type-name">{type.name}</span>
                  </button>
                ))}
              </div>

              <div className="wallet-info">
                <span>Balance: ₹{balance.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // STEP 3: Choose Asset
  if (step === 2) {
    const assets = assetsByType[investmentType] || [];

    return (
      <div className="home-container">
        <nav className="navbar">
          <div className="navbar-brand">
            <h2>Vectra</h2>
          </div>
          <div className="navbar-menu">
            <button className="nav-button" onClick={onBack}>Dashboard</button>
            <button className="nav-button signout" onClick={onSignOut} disabled={loading}>
              {loading ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </nav>

        <main className="investment-main">
          <div className="investment-container">
            <div className="investment-card">
              <div className="card-header-large">
                <h1>Step 2: Choose {investmentType}</h1>
                <p>Select which asset you want to invest in</p>
              </div>

              <div className="asset-grid">
                {assets.map((asset) => (
                  <button
                    key={asset}
                    className="asset-card"
                    onClick={() => handleAssetSelect(asset)}
                  >
                    <span className="asset-name">{asset}</span>
                  </button>
                ))}
              </div>

              <button className="btn-secondary" onClick={() => setStep(1)}>
                ← Back
              </button>

              <div className="wallet-info">
                <span>Balance: ₹{balance.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // STEP 4: Enter Amount
  if (step === 3) {
    return (
      <div className="home-container">
        <nav className="navbar">
          <div className="navbar-brand">
            <h2>Vectra</h2>
          </div>
          <div className="navbar-menu">
            <button className="nav-button" onClick={onBack}>Dashboard</button>
            <button className="nav-button signout" onClick={onSignOut} disabled={loading}>
              {loading ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </nav>

        <main className="investment-main">
          <div className="investment-container">
            <div className="investment-card">
              <div className="card-header-large">
                <h1>Step 3: Enter Investment Amount</h1>
                <p>
                  Investing in {investmentType}: <strong>{selectedAsset}</strong>
                </p>
              </div>

              <div className="amount-input-section">
                <label>How much do you want to invest?</label>
                <div className="amount-input-wrapper">
                  <span className="currency">₹</span>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    max={balance}
                  />
                </div>
                <span className="max-info">Max available: ₹{balance.toFixed(2)}</span>
              </div>

              <button className="btn-primary-large" onClick={handleAmountSubmit}>
                Submit & See Market News →
              </button>

              <button className="btn-secondary" onClick={() => setStep(2)}>
                ← Back
              </button>

              <div className="wallet-info">
                <span>Balance: ₹{balance.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // STEP 5: Show News (Loading)
  if (step === 4) {
    return (
      <div className="home-container">
        <nav className="navbar">
          <div className="navbar-brand">
            <h2>Vectra</h2>
          </div>
          <div className="navbar-menu">
            <button className="nav-button" onClick={onBack}>Dashboard</button>
            <button className="nav-button signout" onClick={onSignOut} disabled={loading}>
              {loading ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </nav>

        <main className="investment-main">
          <div className="investment-container">
            <div className="investment-card news-card">
              <div className="card-header-large">
                <h1>Market News 📰</h1>
                <p>Calculating your investment returns...</p>
              </div>

              <div className="news-display">
                <div className="news-item">
                  <span className="news-text">{news}</span>
                </div>
                <div className="loading-spinner"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // STEP 6: Show Result
  if (step === 5) {
    const isProfit = profit >= 0;
    const profitColor = isProfit ? 'green' : 'red';

    return (
      <div className="home-container">
        <nav className="navbar">
          <div className="navbar-brand">
            <h2>Vectra</h2>
          </div>
          <div className="navbar-menu">
            <button className="nav-button" onClick={onBack}>Dashboard</button>
            <button className="nav-button signout" onClick={onSignOut} disabled={loading}>
              {loading ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </nav>

        <main className="investment-main">
          <div className="investment-container">
            <div className={`investment-card result-card ${profitColor}`}>
              <div className="card-header-large">
                <h1>{isProfit ? '🎉 Profit!' : '😞 Loss!'}</h1>
                <p>Your Investment Result</p>
              </div>

              <div className="result-details">
                <div className="result-item">
                  <span className="result-label">Asset</span>
                  <span className="result-value">{selectedAsset}</span>
                </div>

                <div className="result-item">
                  <span className="result-label">Amount Invested</span>
                  <span className="result-value">₹{parseFloat(amount).toFixed(2)}</span>
                </div>

                <div className="result-item">
                  <span className="result-label">Market News</span>
                  <span className="result-value news-highlight">{news}</span>
                </div>

                <div className="result-item highlight">
                  <span className="result-label">{isProfit ? 'Profit' : 'Loss'}</span>
                  <span className={`result-value ${profitColor}`}>
                    {isProfit ? '+' : ''}₹{profit.toFixed(2)}
                  </span>
                </div>

                <div className="result-item new-balance">
                  <span className="result-label">New Balance</span>
                  <span className="result-value">₹{newBalance.toFixed(2)}</span>
                </div>
              </div>

              <button className="btn-primary-large" onClick={handleInvestAgain}>
                Invest Again →
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // STEP 7: Show Advice
  if (step === 6) {
    return (
      <div className="home-container">
        <nav className="navbar">
          <div className="navbar-brand">
            <h2>Vectra</h2>
          </div>
          <div className="navbar-menu">
            <button className="nav-button" onClick={onBack}>Dashboard</button>
            <button className="nav-button signout" onClick={onSignOut} disabled={loading}>
              {loading ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </nav>

        <main className="investment-main">
          <div className="investment-container">
            <div className="investment-card advice-card">
              <div className="card-header-large">
                <h1>AI Advisor Tip 🤖</h1>
                <p>Based on your investment result</p>
              </div>

              <div className="advice-display">
                <p className="advice-text">{advice}</p>
              </div>

              <button className="btn-primary-large" onClick={handleInvestAgain}>
                Invest Again →
              </button>

              <div className="wallet-info">
                <span>Current Balance: ₹{newBalance.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>Vectra</h2>
        </div>
        <div className="navbar-menu">
          <button className="nav-button" onClick={onBack}>Dashboard</button>
          <button className="nav-button signout" onClick={onSignOut} disabled={loading}>
            {loading ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </nav>

      <main className="investment-main">
        <div className="investment-container">
          <div className="investment-card">
            <div className="card-header-large">
              <h1>Error</h1>
              <p>Something went wrong. Please try again.</p>
            </div>
            <button className="btn-primary-large" onClick={() => setStep(0)}>
              Restart
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default InvestmentSimulator;