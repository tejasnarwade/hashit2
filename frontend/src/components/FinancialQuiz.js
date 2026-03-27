import React, { useState, useMemo } from 'react';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    category: 'Emotional + Real-Life',
    emoji: '😓',
    question: "It's the end of the month. You have ₹1500 left. Your friend invites you to a party costing ₹1200. What do you do?",
    options: [
      { letter: 'A', text: 'Go and enjoy, life is short', emoji: '🎉', isCorrect: false, impact: -30 },
      { letter: 'B', text: 'Go but spend less', emoji: '🤔', isCorrect: false, impact: -10 },
      { letter: 'C', text: 'Skip and save money', emoji: '✅', isCorrect: true, impact: 50 },
      { letter: 'D', text: 'Use credit card', emoji: '💳', isCorrect: false, impact: -50 },
    ],
    feedback: {
      A: 'Fun today, stress tomorrow 😬',
      B: 'Okay choice, but still risky 🤨',
      C: 'Smart choice! Future you says thanks 💪',
      D: 'Debt trap incoming 🚨',
    },
  },
  {
    id: 2,
    category: 'Peer Pressure',
    emoji: '📱',
    question: 'All your friends bought a new iPhone. You feel left out. What do you do?',
    options: [
      { letter: 'A', text: 'Buy on EMI without thinking', emoji: '😍', isCorrect: false, impact: -50 },
      { letter: 'B', text: 'Buy cheaper alternative', emoji: '✅', isCorrect: true, impact: 50 },
      { letter: 'C', text: 'Ignore finances and buy', emoji: '🤪', isCorrect: false, impact: -40 },
      { letter: 'D', text: 'Take loan', emoji: '💸', isCorrect: false, impact: -60 },
    ],
    feedback: {
      A: 'EMI trap started 😅',
      B: 'Smart + practical decision 👏',
      C: 'Living beyond means ⚠️',
      D: 'Debt before assets 🔴',
    },
  },
  {
    id: 3,
    category: 'Consequence-Based',
    emoji: '📊',
    question: "You don't track your expenses for 1 month. What will MOST likely happen?",
    options: [
      { letter: 'A', text: 'You become rich', emoji: '🤑', isCorrect: false, impact: -40 },
      { letter: 'B', text: 'You overspend unknowingly', emoji: '✅', isCorrect: true, impact: 50 },
      { letter: 'C', text: 'Nothing changes', emoji: '😴', isCorrect: false, impact: -20 },
      { letter: 'D', text: 'You save more', emoji: '🏦', isCorrect: false, impact: -35 },
    ],
    feedback: {
      A: 'Wishful thinking 😴',
      B: 'Small leaks sink big ships 🚢 — tracking matters!',
      C: 'Ignorance is not bliss 🙈',
      D: 'Without tracking? Unlikely 📉',
    },
  },
  {
    id: 4,
    category: 'Consequence-Based',
    emoji: '💳',
    question: 'You only pay minimum credit card bill every month. What happens?',
    options: [
      { letter: 'A', text: 'No problem', emoji: '😊', isCorrect: false, impact: -50 },
      { letter: 'B', text: 'Debt increases with interest', emoji: '✅', isCorrect: true, impact: 50 },
      { letter: 'C', text: 'You save money', emoji: '💰', isCorrect: false, impact: -45 },
      { letter: 'D', text: 'Bank rewards you', emoji: '🎁', isCorrect: false, impact: -40 },
    ],
    feedback: {
      A: 'Interest charges say otherwise 📈',
      B: "You're stuck in a debt loop 🔁",
      C: 'You pay interest instead 😭',
      D: 'Banks profit, not you 🏦',
    },
  },
  {
    id: 5,
    category: 'Choose Your Future',
    emoji: '💵',
    question: 'You have ₹10,000. Choose one:',
    options: [
      { letter: 'A', text: 'Spend all on shopping', emoji: '🛍️', isCorrect: false, impact: -50 },
      { letter: 'B', text: 'Save ₹2000, spend rest', emoji: '🤏', isCorrect: false, impact: -10 },
      { letter: 'C', text: 'Save/invest ₹5000', emoji: '✅', isCorrect: true, impact: 50 },
      { letter: 'D', text: 'Lend to friend', emoji: '👫', isCorrect: false, impact: -30 },
    ],
    feedback: {
      A: 'Short-term happiness, long-term regret 😬',
      B: 'Better than nothing, but risky 📉',
      C: 'Future wealth builder 💰',
      D: 'Good heart, bad finance 💔',
    },
  },
  {
    id: 6,
    category: 'Risk vs Reward',
    emoji: '📈',
    question: 'You can invest ₹50,000 in:',
    options: [
      { letter: 'A', text: 'Safe FD (5% return)', emoji: '🏦', isCorrect: true, impact: 30 },
      { letter: 'B', text: 'Risky stock (15% possible return)', emoji: '📊', isCorrect: false, impact: -20 },
      { letter: 'C', text: 'Crypto (high volatility)', emoji: '🎲', isCorrect: false, impact: -50 },
      { letter: 'D', text: 'Keep as cash', emoji: '💸', isCorrect: false, impact: 0 },
    ],
    feedback: {
      A: 'Safe but slow growth - good for beginners 🐢',
      B: 'Market crashed 📉 → loss (not guaranteed)',
      C: 'One day moon, next day crash 🚀🔴',
      D: 'Inflation eats your money 🔥',
    },
  },
  {
    id: 7,
    category: 'Spot the Mistake',
    emoji: '🤔',
    question: 'Rahul earns ₹25,000 but spends ₹26,000 monthly. What is the mistake?',
    options: [
      { letter: 'A', text: 'Saving too much', emoji: '💰', isCorrect: false, impact: -40 },
      { letter: 'B', text: 'Overspending', emoji: '✅', isCorrect: true, impact: 50 },
      { letter: 'C', text: 'Investing wrongly', emoji: '📊', isCorrect: false, impact: -20 },
      { letter: 'D', text: 'Not budgeting', emoji: '📋', isCorrect: false, impact: -15 },
    ],
    feedback: {
      A: 'Opposite problem! 🙃',
      B: "He's living on borrowed money 😬",
      C: 'Bigger problem - overspending 🚨',
      D: 'This is the root cause ⚠️',
    },
  },
  {
    id: 8,
    category: 'Instant Reaction',
    emoji: '🔥',
    question: 'Flash Sale! 50% OFF on shoes you don\'t need. What do you do?',
    options: [
      { letter: 'A', text: 'Buy immediately', emoji: '😍', isCorrect: false, impact: -40 },
      { letter: 'B', text: 'Think 1 day before buying', emoji: '✅', isCorrect: true, impact: 50 },
      { letter: 'C', text: 'Buy 2 pairs', emoji: '👟', isCorrect: false, impact: -50 },
      { letter: 'D', text: 'Use credit card', emoji: '💳', isCorrect: false, impact: -45 },
    ],
    feedback: {
      A: 'Discount ≠ saving money 🧠',
      B: 'Most probably won\'t buy - smart! 🎯',
      C: 'Double the regret 😅',
      D: 'Double the debt 🚨',
    },
  },
];

function FinancialQuiz({ onClose }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);

  const question = QUIZ_QUESTIONS[currentQuestion];

  const handleSelectOption = (option) => {
    if (!showFeedback) {
      setSelectedAnswer(option);
      setShowFeedback(true);

      const newScore = score + (option.isCorrect ? option.impact : option.impact);
      setScore(Math.max(0, newScore));
      setAnswers([...answers, { questionId: question.id, selectedOption: option }]);
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setQuizComplete(true);
    }
  };

  const getPersonalityTag = useMemo(() => {
    const correctAnswers = answers.filter((a) => a.selectedOption.isCorrect).length;
    const percentage = (correctAnswers / QUIZ_QUESTIONS.length) * 100;

    if (percentage >= 75) {
      return { tag: 'Smart Saver 💰', color: '#00ff9d', description: 'You make wise financial decisions!' };
    } else if (percentage >= 50) {
      return { tag: 'Balanced Spender 🎯', color: '#00d0ff', description: 'You have good financial sense with some risks.' };
    } else {
      return { tag: 'Risk Taker ⚡', color: '#ff6b6b', description: 'You need to be more careful with finances!' };
    }
  }, [answers]);

  if (quizComplete) {
    return (
      <div className="quiz-overlay">
        <div className="quiz-container quiz-complete">
          <div className="quiz-header">
            <h2>Quiz Complete! 🎉</h2>
          </div>

          <div className="final-score-card">
            <div className="final-score-circle">
              <div className="final-score-number">{answers.filter((a) => a.selectedOption.isCorrect).length}</div>
              <div className="final-score-total">/{QUIZ_QUESTIONS.length}</div>
            </div>

            <div className="personality-section">
              <h3 style={{ color: getPersonalityTag.color }}>You are a {getPersonalityTag.tag}</h3>
              <p>{getPersonalityTag.description}</p>
              <div className="coins-earned">
                <span className="coin-icon">🪙</span>
                <span className="coin-value">{Math.max(0, score)} Coins Earned!</span>
              </div>
            </div>
          </div>

          <div className="results-breakdown">
            <h4>Your Answers:</h4>
            <div className="results-list">
              {answers.map((answer, idx) => (
                <div key={idx} className={`result-item ${answer.selectedOption.isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="result-question">Q{answer.questionId}: {QUIZ_QUESTIONS[idx].question.substring(0, 50)}...</div>
                  <div className="result-answer">
                    {answer.selectedOption.letter}) {answer.selectedOption.text}
                  </div>
                  <div className="result-status">{answer.selectedOption.isCorrect ? '✅ Correct' : '❌ Incorrect'}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="quiz-actions">
            <button className="secondary-button" onClick={() => window.location.reload()}>
              Retake Quiz
            </button>
            <button className="primary-button" onClick={onClose}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-overlay">
      <div className="quiz-container">
        {/* Header */}
        <div className="quiz-header">
          <button className="quiz-close-btn" onClick={onClose}>✕</button>
          <div className="quiz-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}></div>
            </div>
            <span className="progress-text">
              Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
            </span>
          </div>
          <div className="quiz-score">
            <span className="coin-icon">🪙</span>
            <span>{Math.max(0, score)}</span>
          </div>
        </div>

        {/* Question */}
        <div className="quiz-content">
          <div className="question-category">
            <span className="category-tag">{question.category}</span>
          </div>

          <div className="question-text">
            <span className="question-emoji">{question.emoji}</span>
            <h2>{question.question}</h2>
          </div>

          {/* Options */}
          <div className="quiz-options">
            {question.options.map((option) => (
              <button
                key={option.letter}
                className={`quiz-option ${selectedAnswer?.letter === option.letter ? 'selected' : ''} ${
                  showFeedback && option.isCorrect ? 'correct' : ''
                } ${showFeedback && selectedAnswer?.letter === option.letter && !option.isCorrect ? 'incorrect' : ''}`}
                onClick={() => handleSelectOption(option)}
                disabled={showFeedback}
              >
                <div className="option-header">
                  <span className="option-letter">{option.letter}</span>
                  <span className="option-emoji">{option.emoji}</span>
                </div>
                <span className="option-text">{option.text}</span>
                {showFeedback && option.isCorrect && <span className="option-checkmark">✓</span>}
                {showFeedback && selectedAnswer?.letter === option.letter && !option.isCorrect && (
                  <span className="option-cross">✕</span>
                )}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`feedback-card ${selectedAnswer?.isCorrect ? 'positive' : 'negative'}`}>
              <div className="feedback-icon">{selectedAnswer?.isCorrect ? '💡' : '⚠️'}</div>
              <div className="feedback-text">
                <p className="feedback-message">{question.feedback[selectedAnswer?.letter]}</p>
                {selectedAnswer?.isCorrect ? (
                  <p className="feedback-coins">+{selectedAnswer?.impact} Coins</p>
                ) : (
                  <p className="feedback-coins negative">{selectedAnswer?.impact} Coins</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="quiz-footer">
          {showFeedback && (
            <button className="primary-button" onClick={handleNext}>
              {currentQuestion === QUIZ_QUESTIONS.length - 1 ? 'See Results' : 'Next Question'} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FinancialQuiz;
