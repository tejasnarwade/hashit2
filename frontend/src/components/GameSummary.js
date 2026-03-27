import React, { useState, useMemo } from 'react';

function formatCurrency(value) {
  return value.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });
}

function GameSummary({ 
  playerName, 
  totalYears, 
  startingWealth,
  finalWealth, 
  gameProgress,
  investmentAllocation,
  insuranceHistory,
  activeLoans,
  loanHistory,
  onBackToMenu 
}) {
  const [expandedDecision, setExpandedDecision] = useState(null);

  // Calculate statistics
  const wealthGain = finalWealth - startingWealth;
  const wealthGainPercent = ((wealthGain / startingWealth) * 100).toFixed(1);
  
  // Analyze investment decisions
  const investmentAnalysis = useMemo(() => {
    if (!gameProgress || gameProgress.length === 0) {
      return { avgReturn: 0, bestYear: null, worstYear: null, decisions: [] };
    }

    const previousWealths = [startingWealth, ...gameProgress.slice(0, -1).map(gp => gp.net_wealth)];
    const decisions = gameProgress.map((year, index) => {
      const prevWealth = previousWealths[index] || startingWealth;
      const currentWealthValue = year.net_wealth;
      const yearGain = currentWealthValue - prevWealth;
      const yearGainPercent = ((yearGain / prevWealth) * 100).toFixed(2);
      
      return {
        year: index + 1,
        prevWealth,
        currentWealth: currentWealthValue,
        gain: yearGain,
        gainPercent: yearGainPercent,
        quality: yearGain > 0 ? 'good' : 'bad',
      };
    });

    const bestYear = decisions.reduce((best, current) => 
      current.gain > best.gain ? current : best, decisions[0]
    );
    const worstYear = decisions.reduce((worst, current) => 
      current.gain < worst.gain ? current : worst, decisions[0]
    );

    const avgReturn = decisions.reduce((sum, d) => sum + parseFloat(d.gainPercent), 0) / decisions.length;

    return { avgReturn: avgReturn.toFixed(2), bestYear, worstYear, decisions };
  }, [gameProgress, startingWealth]);

  // Analyze insurance decisions
  const insuranceAnalysis = useMemo(() => {
    const totalInsuranceCost = insuranceHistory.length * 15000; // 5% of ₹300k salary
    const avgWealthWithoutInsurance = 50000 + (gameProgress.length * 180000 * 0.15); // estimate
    
    let potentialSavings = 0;
    if (insuranceHistory.includes('medical')) potentialSavings += 35000;
    if (insuranceHistory.includes('accident')) potentialSavings += 52500;
    if (insuranceHistory.includes('house')) potentialSavings += 70000;

    const insuranceEfficiency = insuranceHistory.length > 0 
      ? ((potentialSavings - totalInsuranceCost) / totalInsuranceCost * 100).toFixed(1)
      : 0;

    return {
      policiesBought: insuranceHistory.length,
      totalCost: totalInsuranceCost,
      potentialSavings,
      efficiency: insuranceEfficiency,
      verdict: insuranceHistory.length === 3 ? 'Excellent - Fully Protected' : 
               insuranceHistory.length >= 2 ? 'Good - Mostly Protected' :
               insuranceHistory.length === 1 ? 'Fair - Partially Protected' :
               'Poor - No Protection',
    };
  }, [insuranceHistory, gameProgress]);

  // Analyze debt decisions
  const debtAnalysis = useMemo(() => {
    const totalDebt = activeLoans.reduce((sum, loan) => sum + loan.amount, 0);
    const totalInterestCost = loanHistory.reduce((sum, loan) => sum + (loan.totalCost - loan.amount), 0);
    const debtRatio = finalWealth > 0 ? (totalDebt / finalWealth * 100).toFixed(1) : 0;

    let verdict = 'No Debt - Excellent!';
    if (totalDebt > finalWealth * 0.5) verdict = 'High Debt - Risky';
    else if (totalDebt > finalWealth * 0.3) verdict = 'Moderate Debt - Caution Needed';
    else if (totalDebt > 0) verdict = 'Low Debt - Manageable';

    return {
      totalDebt,
      loansTaken: loanHistory.length,
      interestCost: totalInterestCost,
      debtToWealthRatio: debtRatio,
      verdict,
    };
  }, [activeLoans, loanHistory, finalWealth]);

  // Calculate overall score
  const overallScore = useMemo(() => {
    let score = 0;
    
    // Wealth gain score (0-30)
    if (wealthGain > startingWealth * 5) score += 30;
    else if (wealthGain > startingWealth * 3) score += 25;
    else if (wealthGain > startingWealth) score += 20;
    else if (wealthGain > 0) score += 10;
    else score += 0;

    // Insurance score (0-25)
    score += insuranceAnalysis.policiesBought * 8; // 3 policies = 24 points

    // Debt score (0-25)
    if (debtAnalysis.totalDebt === 0) score += 25;
    else if (debtAnalysis.debtRatio < 20) score += 20;
    else if (debtAnalysis.debtRatio < 50) score += 10;
    else score += 0;

    // Consistency score (0-20)
    const positiveYears = investmentAnalysis.decisions.filter(d => d.gain > 0).length;
    score += (positiveYears / totalYears) * 20;

    return Math.round(Math.min(100, score));
  }, [wealthGain, startingWealth, insuranceAnalysis, debtAnalysis, investmentAnalysis, totalYears]);

  // Generate recommendations
  const recommendations = useMemo(() => {
    const recs = [];

    if (overallScore < 50) {
      recs.push({
        title: 'Diversify Your Investments',
        description: 'Consider spreading investments across multiple options (stocks, gold, etc.) to reduce risk',
        priority: 'high',
      });
    }

    if (insuranceAnalysis.policiesBought < 3) {
      recs.push({
        title: 'Buy Missing Insurance Policies',
        description: `You have ${insuranceAnalysis.policiesBought}/3 policies. Complete coverage protects against all emergencies.`,
        priority: 'high',
        savings: insuranceAnalysis.potentialSavings - insuranceAnalysis.totalCost,
      });
    }

    if (debtAnalysis.totalDebt > 0 && debtAnalysis.debtRatio > 30) {
      recs.push({
        title: 'Reduce Debt Burden',
        description: 'Your debt-to-wealth ratio is high. Focus on paying off loans faster by reducing investment risk.',
        priority: 'high',
      });
    }

    if (investmentAnalysis.avgReturn < 5) {
      recs.push({
        title: 'Improve Investment Strategy',
        description: 'Your average return is low. Try a more aggressive mix of commodities or crypto.',
        priority: 'medium',
      });
    }

    if (investmentAnalysis.decisions.some(d => parseFloat(d.gainPercent) < -30)) {
      recs.push({
        title: 'Avoid Extreme Volatility',
        description: 'You had some years with large losses. Consider safer options like gold or silver.',
        priority: 'medium',
      });
    }

    if (wealthGain > startingWealth * 3) {
      recs.push({
        title: 'Excellent Financial Management!',
        description: 'You have demonstrated strong financial decision-making. Keep up this strategy!',
        priority: 'low',
        type: 'positive',
      });
    }

    return recs;
  }, [overallScore, insuranceAnalysis, debtAnalysis, investmentAnalysis, wealthGain, startingWealth]);

  // Grade assignment
  const getGrade = (score) => {
    if (score >= 90) return { grade: 'A', color: '#22c55e', label: 'Excellent' };
    if (score >= 80) return { grade: 'B', color: '#3b82f6', label: 'Very Good' };
    if (score >= 70) return { grade: 'C', color: '#f59e0b', label: 'Good' };
    if (score >= 60) return { grade: 'D', color: '#ef4444', label: 'Fair' };
    return { grade: 'F', color: '#dc2626', label: 'Needs Improvement' };
  };

  const gradeInfo = getGrade(overallScore);

  return (
    <div className="game-summary-container">
      <div className="summary-header">
        <h1>🎊 Game Summary Report</h1>
        <p className="player-name">{playerName}</p>
        <p className="summary-subtitle">Your {totalYears}-Year Financial Journey Analysis</p>
      </div>

      {/* OVERALL SCORE CARD */}
      <div className="overall-score-card">
        <div className="score-circle" style={{ borderColor: gradeInfo.color }}>
          <div className="score-number">{overallScore}</div>
          <div className="score-grade" style={{ color: gradeInfo.color }}>
            {gradeInfo.grade}
          </div>
          <div className="score-label">{gradeInfo.label}</div>
        </div>
        <div className="score-breakdown">
          <div className="breakdown-item">
            <span className="item-label">Final Wealth:</span>
            <span className="item-value">{formatCurrency(finalWealth)}</span>
          </div>
          <div className="breakdown-item">
            <span className="item-label">Wealth Gain:</span>
            <span className={`item-value ${wealthGain > 0 ? 'positive' : 'negative'}`}>
              {wealthGain > 0 ? '+' : ''}{formatCurrency(wealthGain)} ({wealthGainPercent}%)
            </span>
          </div>
          <div className="breakdown-item">
            <span className="item-label">Years Played:</span>
            <span className="item-value">{totalYears}</span>
          </div>
        </div>
      </div>

      {/* DECISION ANALYSIS */}
      <div className="decision-analysis-section">
        <h2>📊 Year-by-Year Decision Analysis</h2>
        <div className="decisions-grid">
          {investmentAnalysis.decisions.map((decision) => (
            <div
              key={decision.year}
              className="decision-card"
              onClick={() => setExpandedDecision(expandedDecision === decision.year ? null : decision.year)}
            >
              <div className={`decision-header ${decision.quality}`}>
                <span className="year-label">Year {decision.year}</span>
                <span className={`year-result ${decision.quality}`}>
                  {decision.gain > 0 ? '✓' : '✗'} {decision.gainPercent}%
                </span>
              </div>
              <div className="decision-values">
                <div className="value-row">
                  <span>Start: {formatCurrency(decision.prevWealth)}</span>
                </div>
                <div className="value-row">
                  <span>End: {formatCurrency(decision.currentWealth)}</span>
                </div>
                <div className={`value-row ${decision.quality}`}>
                  <span>Change: {decision.gain > 0 ? '+' : ''}{formatCurrency(decision.gain)}</span>
                </div>
              </div>
              
              {expandedDecision === decision.year && (
                <div className="decision-analysis">
                  <h4>Performance Analysis</h4>
                  <p>
                    {decision.gain > 0 
                      ? `✓ Great decision! You grew your wealth by ${decision.gainPercent}%. Your investment strategy worked well this year.`
                      : `✗ Room for improvement. Your wealth decreased by ${Math.abs(decision.gainPercent)}%. Consider adjusting your strategy.`
                    }
                  </p>
                  {decision.year === investmentAnalysis.bestYear?.year && (
                    <p className="best-year">🏆 Your best year! Keep this strategy in mind.</p>
                  )}
                  {decision.year === investmentAnalysis.worstYear?.year && (
                    <p className="worst-year">⚠️ Your toughest year. Learn from this experience.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {investmentAnalysis.decisions.length > 0 && (
          <div className="investment-summary">
            <div className="summary-stat">
              <span className="stat-label">Average Annual Return:</span>
              <span className={`stat-value ${investmentAnalysis.avgReturn > 0 ? 'positive' : 'negative'}`}>
                {investmentAnalysis.avgReturn > 0 ? '+' : ''}{investmentAnalysis.avgReturn}%
              </span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Best Year:</span>
              <span className="stat-value">
                Year {investmentAnalysis.bestYear?.year} (+{investmentAnalysis.bestYear?.gainPercent}%)
              </span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Worst Year:</span>
              <span className="stat-value">
                Year {investmentAnalysis.worstYear?.year} ({investmentAnalysis.worstYear?.gainPercent}%)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* INSURANCE ANALYSIS */}
      <div className="analysis-card insurance-card">
        <h2>🛡️ Insurance Strategy Analysis</h2>
        <div className="analysis-content">
          <div className="metric">
            <span className="metric-label">Policies Purchased:</span>
            <span className="metric-value">{insuranceAnalysis.policiesBought} / 3</span>
          </div>
          <div className="metric">
            <span className="metric-label">Total Premium Cost:</span>
            <span className="metric-value">{formatCurrency(insuranceAnalysis.totalCost)}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Potential Savings:</span>
            <span className="metric-value positive">{formatCurrency(insuranceAnalysis.potentialSavings)}</span>
          </div>
          <div className="metric">
            <span className="metric-label">ROI:</span>
            <span className="metric-value positive">{insuranceAnalysis.efficiency}%</span>
          </div>
          <div className="metric full-width">
            <span className="metric-label">Verdict:</span>
            <span className={`metric-value verdict ${insuranceAnalysis.policiesBought === 3 ? 'excellent' : insuranceAnalysis.policiesBought >= 2 ? 'good' : 'poor'}`}>
              {insuranceAnalysis.verdict}
            </span>
          </div>
        </div>
      </div>

      {/* DEBT ANALYSIS */}
      <div className="analysis-card debt-card">
        <h2>💳 Debt & Loan Management</h2>
        <div className="analysis-content">
          <div className="metric">
            <span className="metric-label">Total Loans Taken:</span>
            <span className="metric-value">{debtAnalysis.loansTaken}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Outstanding Debt:</span>
            <span className="metric-value">{formatCurrency(debtAnalysis.totalDebt)}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Interest Paid:</span>
            <span className="metric-value negative">{formatCurrency(debtAnalysis.interestCost)}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Debt-to-Wealth Ratio:</span>
            <span className="metric-value">{debtAnalysis.debtToWealthRatio}%</span>
          </div>
          <div className="metric full-width">
            <span className="metric-label">Status:</span>
            <span className={`metric-value verdict ${debtAnalysis.debtToWealthRatio === '0' ? 'excellent' : debtAnalysis.debtToWealthRatio < 30 ? 'good' : 'poor'}`}>
              {debtAnalysis.verdict}
            </span>
          </div>
        </div>
      </div>

      {/* RECOMMENDATIONS */}
      <div className="recommendations-section">
        <h2>💡 Areas for Improvement</h2>
        <div className="recommendations-list">
          {recommendations.length > 0 ? (
            recommendations.map((rec, index) => (
              <div
                key={index}
                className={`recommendation-card priority-${rec.priority} ${rec.type === 'positive' ? 'positive' : ''}`}
              >
                <div className="rec-header">
                  <h3>{rec.title}</h3>
                  <span className={`priority-badge ${rec.priority}`}>{rec.priority.toUpperCase()}</span>
                </div>
                <p className="rec-description">{rec.description}</p>
                {rec.savings && (
                  <div className="rec-benefit">
                    Potential savings: {formatCurrency(rec.savings)}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="no-recommendations">Excellent work! No major improvements needed.</p>
          )}
        </div>
      </div>

      {/* KEY INSIGHTS */}
      <div className="insights-section">
        <h2>🔍 Key Insights</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>Risk Management</h4>
            <p>
              {insuranceAnalysis.policiesBought === 3
                ? '✓ Excellent - You protected yourself against all emergencies'
                : '⚠️ Consider buying more insurance to protect against unforeseen events'}
            </p>
          </div>
          <div className="insight-card">
            <h4>Investment Performance</h4>
            <p>
              {investmentAnalysis.avgReturn > 10
                ? '✓ Strong returns - Your investment mix is performing well'
                : '⚠️ Consider diversifying your portfolio for better returns'}
            </p>
          </div>
          <div className="insight-card">
            <h4>Financial Health</h4>
            <p>
              {wealthGain > startingWealth * 2
                ? '✓ Excellent - Your wealth grew significantly'
                : '⚠️ Focus on building your wealth through consistent investments'}
            </p>
          </div>
          <div className="insight-card">
            <h4>Debt Situation</h4>
            <p>
              {debtAnalysis.totalDebt === 0
                ? '✓ Perfect - You stayed debt-free throughout the game'
                : `⚠️ You have ${formatCurrency(debtAnalysis.totalDebt)} in debt - focus on paying it off`}
            </p>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="summary-actions">
        <button className="primary-button" onClick={onBackToMenu}>
          Back to Menu
        </button>
      </div>
    </div>
  );
}

export default GameSummary;
