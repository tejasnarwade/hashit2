import React, { useEffect, useMemo, useState } from 'react';
import './QuizPage.css';

function QuizPage({ currentUser, username, loading, onSignOut }) {
  const QUIZ_TIMER_SECONDS = 20;
  const questions = useMemo(
    () => [
      {
        id: 1,
        title: 'Q1 · Emotional + Real-Life',
        scenario:
          "It’s the end of the month 😓 You have ₹1500 left. Your friend invites you to a party costing ₹1200. What do you do?",
        options: [
          { id: 'A', icon: '🎉', text: 'Go and enjoy, life is short', coins: -20, xp: 5 },
          { id: 'B', icon: '🧾', text: 'Go but spend less', coins: 20, xp: 25 },
          { id: 'C', icon: '💪', text: 'Skip and save money', coins: 50, xp: 40 },
          { id: 'D', icon: '💳', text: 'Use credit card', coins: -20, xp: 5 },
        ],
        correctId: 'C',
        feedbackByOption: {
          A: 'Fun today, stress tomorrow 😬',
          B: 'Better control, but still some pressure on your budget 🙂',
          C: 'Smart choice! Future you says thanks 💪',
          D: 'Debt for a party is risky—interest can bite later 😬',
        },
      },
      {
        id: 2,
        title: 'Q2 · Peer Pressure',
        scenario:
          'All your friends bought a new iPhone 📱 and you feel left out. What do you do?',
        options: [
          { id: 'A', icon: '⚠️', text: 'Buy on EMI without thinking', coins: -20, xp: 5 },
          { id: 'B', icon: '👏', text: 'Buy a cheaper alternative', coins: 50, xp: 40 },
          { id: 'C', icon: '😵', text: 'Ignore finances and buy', coins: -20, xp: 5 },
          { id: 'D', icon: '🏦', text: 'Take a loan', coins: -20, xp: 5 },
        ],
        correctId: 'B',
        feedbackByOption: {
          A: 'EMI trap started 😅',
          B: 'Smart + practical decision 👏',
          C: 'Lifestyle pressure can damage your money goals 😬',
          D: 'Borrowing for status often creates unnecessary stress 😓',
        },
      },
      {
        id: 3,
        title: 'Q3 · Consequence-Based',
        scenario:
          'You don’t track your expenses for 1 month. What will MOST likely happen?',
        options: [
          { id: 'A', icon: '🤑', text: 'You become rich', coins: -20, xp: 5 },
          { id: 'B', icon: '📉', text: 'You overspend unknowingly', coins: 50, xp: 40 },
          { id: 'C', icon: '😐', text: 'Nothing changes', coins: -20, xp: 5 },
          { id: 'D', icon: '💤', text: 'You save more', coins: -20, xp: 5 },
        ],
        correctId: 'B',
        feedbackByOption: {
          A: 'Not tracking never magically creates wealth 😅',
          B: 'Small leaks sink big ships 🚢 — tracking matters!',
          C: 'Usually something does change: your wallet gets lighter 😬',
          D: 'Savings need intention, not guesswork 🧠',
        },
      },
      {
        id: 4,
        title: 'Q4 · Credit Card Trap',
        scenario:
          'You only pay the minimum credit card bill every month. What happens?',
        options: [
          { id: 'A', icon: '🙂', text: 'No problem', coins: -20, xp: 5 },
          { id: 'B', icon: '🔁', text: 'Debt increases with interest', coins: 50, xp: 40 },
          { id: 'C', icon: '💸', text: 'You save money', coins: -20, xp: 5 },
          { id: 'D', icon: '🎁', text: 'Bank rewards you', coins: -20, xp: 5 },
        ],
        correctId: 'B',
        feedbackByOption: {
          A: 'It looks okay now, but interest keeps compounding 😬',
          B: 'You’re stuck in a debt loop 🔁',
          C: 'Minimum due can be the costliest way to pay 💸',
          D: 'Banks reward full repayment behavior, not revolving debt 🧠',
        },
      },
      {
        id: 5,
        title: 'Q5 · Choose Your Future',
        scenario: 'You have ₹10,000. Choose one:',
        options: [
          { id: 'A', icon: '🛍️', text: 'Spend all on shopping', coins: -20, xp: 5 },
          { id: 'B', icon: '🪙', text: 'Save ₹2000, spend the rest', coins: 20, xp: 25 },
          { id: 'C', icon: '💰', text: 'Save/invest ₹5000', coins: 50, xp: 40 },
          { id: 'D', icon: '🤝', text: 'Lend to a friend', coins: -20, xp: 5 },
        ],
        correctId: 'C',
        feedbackByOption: {
          A: 'Short-term happiness, long-term regret 😬',
          B: 'Good start. Consistency can make it even stronger 👏',
          C: 'Future wealth builder 💰',
          D: 'Helping is great, but protect your own financial base first 🧱',
        },
      },
      {
        id: 6,
        title: 'Q6 · Risk vs Reward',
        scenario: 'You can invest in one option. What do you choose?',
        options: [
          { id: 'A', icon: '🏦', text: 'Safe FD (5% return)', coins: 20, xp: 25 },
          { id: 'B', icon: '📈', text: 'Risky stock (15% possible return)', coins: -20, xp: 10 },
          { id: 'C', icon: '⚖️', text: 'Split: FD + stock', coins: 50, xp: 40 },
          { id: 'D', icon: '🎲', text: 'Tip-based crypto bet', coins: -20, xp: 5 },
        ],
        correctId: 'C',
        feedbackByOption: {
          A: 'Safe but slow growth 🌱',
          B: 'Market crashed 📉 → loss',
          C: 'Balanced strategy! Risk managed, growth possible ✅',
          D: 'High hype, high risk. That is closer to gambling 🎲',
        },
      },
      {
        id: 7,
        title: 'Q7 · Spot the Mistake',
        scenario: 'Rahul earns ₹25,000 but spends ₹26,000 monthly. What is the mistake?',
        options: [
          { id: 'A', icon: '😅', text: 'Saving too much', coins: -20, xp: 5 },
          { id: 'B', icon: '✅', text: 'Overspending', coins: 50, xp: 40 },
          { id: 'C', icon: '📊', text: 'Investing', coins: -20, xp: 5 },
          { id: 'D', icon: '🧾', text: 'Budgeting', coins: -20, xp: 5 },
        ],
        correctId: 'B',
        feedbackByOption: {
          A: 'If only that were the problem 😄',
          B: 'He’s living on borrowed money 😬',
          C: 'Investing is not the issue here; cash flow is 🚨',
          D: 'Budgeting is the fix, not the mistake 🧠',
        },
      },
      {
        id: 8,
        title: 'Q8 · Instant Reaction',
        scenario: 'Flash Sale 🔥 50% OFF on shoes you do not need. What do you do?',
        options: [
          { id: 'A', icon: '😍', text: 'Buy immediately', coins: -20, xp: 5 },
          { id: 'B', icon: '🧠', text: 'Think 1 day before buying', coins: 50, xp: 40 },
          { id: 'C', icon: '👟', text: 'Buy 2 pairs', coins: -20, xp: 5 },
          { id: 'D', icon: '💳', text: 'Use credit card', coins: -20, xp: 5 },
        ],
        correctId: 'B',
        feedbackByOption: {
          A: 'Impulse buying hits your goals hard 😬',
          B: 'Discount ≠ saving money 🧠',
          C: 'More discount can still mean more waste 😅',
          D: 'Credit should not fund non-essential impulse buys ⚠️',
        },
      },
    ],
    []
  );

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(100);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIMER_SECONDS);
  const [coinDelta, setCoinDelta] = useState(0);
  const [xpDelta, setXpDelta] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [confettiBurst, setConfettiBurst] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const currentQuestion = questions[questionIndex];
  const totalQuestions = questions.length;
  const isFinished = questionIndex >= totalQuestions;
  const progressPct = Math.round((answeredCount / totalQuestions) * 100);
  const mascotMood =
    !showFeedback ? '🤖' : selectedId === currentQuestion?.correctId ? '🥳' : '😬';

  useEffect(() => {
    if (isFinished || showFeedback) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return previousTime - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isFinished, showFeedback, questionIndex]);

  useEffect(() => {
    if (timeLeft !== 0 || showFeedback || isFinished) {
      return;
    }

    const timeoutOption = {
      id: 'timeout',
      coins: -20,
      xp: 5,
    };
    setSelectedId('timeout');
    setCoinDelta(timeoutOption.coins);
    setXpDelta(timeoutOption.xp);
    setCoins((current) => Math.max(0, current + timeoutOption.coins));
    setXp((current) => current + timeoutOption.xp);
    setStreak(0);
    setAnsweredCount((current) => current + 1);
    setShowFeedback(true);
  }, [isFinished, showFeedback, timeLeft]);

  const handleOptionSelect = (option) => {
    if (showFeedback || timeLeft === 0) {
      return;
    }

    const isCorrect = option.id === currentQuestion.correctId;
    setSelectedId(option.id);
    setCoinDelta(option.coins);
    setXpDelta(option.xp);
    setCoins((current) => Math.max(0, current + option.coins));
    setXp((current) => current + option.xp);
    setStreak((current) => (isCorrect ? current + 1 : 0));
    setAnsweredCount((current) => current + 1);
    if (isCorrect) {
      setCorrectCount((current) => current + 1);
      setConfettiBurst(true);
      window.setTimeout(() => setConfettiBurst(false), 850);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (!showFeedback) {
      return;
    }

    setIsTransitioning(true);
    window.setTimeout(() => {
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);
      setSelectedId(null);
      setShowFeedback(false);
      setTimeLeft(QUIZ_TIMER_SECONDS);
      setCoinDelta(0);
      setXpDelta(0);
      setIsTransitioning(false);
    }, 260);
  };

  const resetQuiz = () => {
    setQuestionIndex(0);
    setSelectedId(null);
    setShowFeedback(false);
    setCoins(100);
    setXp(0);
    setStreak(0);
    setTimeLeft(QUIZ_TIMER_SECONDS);
    setCoinDelta(0);
    setXpDelta(0);
    setCorrectCount(0);
    setAnsweredCount(0);
    setConfettiBurst(false);
    setIsTransitioning(false);
  };

  const personalityTag = (() => {
    const accuracy = totalQuestions ? correctCount / totalQuestions : 0;
    if (accuracy >= 0.75) {
      return 'You are a Smart Saver 💰';
    }
    if (accuracy >= 0.45) {
      return 'You are a Balanced Planner ⚖️';
    }
    return 'You are a Risk Taker 🎲';
  })();

  const getFeedbackText = () => {
    if (selectedId === 'timeout') {
      return 'Time up! Quick reactions matter. Build your decision muscle ⏱️';
    }
    return currentQuestion.feedbackByOption[selectedId] || '';
  };

  const isCorrectChoice = selectedId === currentQuestion?.correctId;

  if (isFinished) {
    return (
      <main className={darkMode ? 'quiz-shell dark' : 'quiz-shell'}>
        <section className="quiz-card quiz-result-card">
          <div className="top-strip">
            <p className="status-badge">Quiz Complete</p>
            <button
              type="button"
              className="mode-toggle"
              onClick={() => setDarkMode((current) => !current)}
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
          <h1>Great run, {username}! 🎉</h1>
          <p className="panel-copy">Your money decisions shape your future. Keep leveling up.</p>
          <div className="result-grid">
            <div className="result-pill">🪙 Coins: {coins}</div>
            <div className="result-pill">⭐ XP: {xp}</div>
            <div className="result-pill">✅ Correct: {correctCount}/{totalQuestions}</div>
            <div className="result-pill">🔥 Best Streak: {streak}</div>
          </div>
          <p className="personality-tag">{personalityTag}</p>
          <div className="result-actions">
            <button type="button" className="primary-button" onClick={resetQuiz}>
              Play Again
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={onSignOut}
              disabled={loading}
            >
              {loading ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={darkMode ? 'quiz-shell dark' : 'quiz-shell'}>
      <section className={`quiz-card ${isTransitioning ? 'card-leave' : 'card-enter'}`}>
        <header className="quiz-header">
          <div className="header-row">
            <p className="status-badge">Money Quest</p>
            <div className="timer-pill">⏱️ {timeLeft}s</div>
          </div>
          <div className="progress-track">
            <span className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="meta-row">
            <div className="meta-pill">🪙 {coins}</div>
            <div className="meta-pill">⭐ {xp} XP</div>
            <div className="meta-pill">🔥 Streak {streak}</div>
            <button
              type="button"
              className="mode-toggle"
              onClick={() => setDarkMode((current) => !current)}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        <div className="question-card">
          <p className="question-title">{currentQuestion.title}</p>
          <h2>{currentQuestion.scenario}</h2>
          <p className="panel-copy">
            Playing as <strong>{username}</strong> · {currentUser.email}
          </p>

        <div className="options-grid">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedId === option.id;
              const showCorrect = showFeedback && option.id === currentQuestion.correctId;
              const showWrong = showFeedback && isSelected && option.id !== currentQuestion.correctId;
              const buttonClass = [
                'option-button',
                isSelected ? 'selected' : '',
                showCorrect ? 'correct' : '',
                showWrong ? 'wrong' : '',
              ]
                .join(' ')
                .trim();

              return (
                <button
                  key={option.id}
                  type="button"
                  className={buttonClass}
                  onClick={() => handleOptionSelect(option)}
                  disabled={showFeedback || timeLeft === 0}
                >
                  <span className="option-icon">{option.icon}</span>
                  <span>{option.id}) {option.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {showFeedback ? (
          <div className={isCorrectChoice ? 'feedback success' : 'feedback error'}>
            <p className="feedback-title">
              {selectedId === 'timeout'
                ? 'Missed it! 😵'
                : isCorrectChoice
                  ? 'Smart move 💪'
                  : 'Bad decision 😬'}
            </p>
            <p>{getFeedbackText()}</p>
            <div className="impact-row">
              <span className={coinDelta >= 0 ? 'impact-good' : 'impact-bad'}>
                {coinDelta >= 0 ? '📈' : '📉'} Coins {coinDelta >= 0 ? '+' : ''}
                {coinDelta}
              </span>
              <span className={xpDelta >= 0 ? 'impact-good' : 'impact-bad'}>
                ⭐ XP {xpDelta >= 0 ? '+' : ''}
                {xpDelta}
              </span>
            </div>
          </div>
        ) : null}

        <footer className="quiz-footer">
          <div className="mascot">
            <span className="mascot-avatar">{mascotMood}</span>
            <p>
              {showFeedback
                ? isCorrectChoice
                  ? 'Savings power unlocked! Keep this streak alive.'
                  : 'No worries. Learn, adapt, and win the next one.'
                : 'Choose wisely. Every tap changes your financial future.'}
            </p>
          </div>
          <div className="footer-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onSignOut}
              disabled={loading}
            >
              {loading ? 'Signing out...' : 'Sign out'}
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={handleNext}
              disabled={!showFeedback}
            >
              Next ▶
            </button>
          </div>
        </footer>
        {confettiBurst ? (
          <div className="confetti-layer" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, index) => (
              <span key={index} className="confetti-piece" />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default QuizPage;
