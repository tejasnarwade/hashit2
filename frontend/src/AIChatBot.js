import React, { useState } from 'react';
import './AIChatBot.css';

function AIChatBot({ onBack, onSignOut, loading }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI Financial Advisor 🤖. I can help you with investment advice, market analysis, and financial planning. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Predefined responses for common questions
  const responses = {
    'investment': [
      'Investing is about growing your money over time. Consider your risk tolerance, time horizon, and financial goals.',
      'Start with a diversified portfolio: 50% stocks, 30% bonds, 20% cash/alternatives.',
      'Remember: Past performance doesn\'t guarantee future results. Always do your research.'
    ],
    'stocks': [
      'Stocks represent ownership in companies. Blue-chip stocks are generally safer than small-cap stocks.',
      'Consider companies with strong fundamentals: growing revenue, manageable debt, and competitive advantages.',
      'Use dollar-cost averaging to reduce timing risk when investing in stocks.'
    ],
    'crypto': [
      'Cryptocurrency is highly volatile and speculative. Only invest what you can afford to lose.',
      'Popular cryptocurrencies include Bitcoin (store of value) and Ethereum (smart contracts platform).',
      'Consider regulatory developments and technological advancements in the crypto space.'
    ],
    'saving': [
      'Emergency fund should cover 3-6 months of expenses. Keep it in liquid, low-risk accounts.',
      'High-yield savings accounts currently offer 4-5% interest - much better than traditional savings.',
      'Automate your savings to make it a habit, not an afterthought.'
    ],
    'retirement': [
      'Start saving early - compound interest is your best friend. Even small amounts add up over time.',
      'Maximize employer 401(k) matches - it\'s free money. Consider Roth IRA for tax advantages.',
      'Aim to save 15-20% of your income for retirement. Adjust based on your lifestyle goals.'
    ],
    'default': [
      'That\'s an interesting question! I\'m here to help with financial topics. Try asking about investments, savings, retirement, or market trends.',
      'I specialize in financial education and investment advice. What specific financial topic interests you?',
      'Feel free to ask me about stocks, bonds, crypto, retirement planning, or general money management strategies.'
    ]
  };

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    if (message.includes('invest') || message.includes('portfolio')) {
      return responses.investment[Math.floor(Math.random() * responses.investment.length)];
    } else if (message.includes('stock') || message.includes('share')) {
      return responses.stocks[Math.floor(Math.random() * responses.stocks.length)];
    } else if (message.includes('crypto') || message.includes('bitcoin') || message.includes('ethereum')) {
      return responses.crypto[Math.floor(Math.random() * responses.crypto.length)];
    } else if (message.includes('save') || message.includes('saving') || message.includes('emergency')) {
      return responses.saving[Math.floor(Math.random() * responses.saving.length)];
    } else if (message.includes('retire') || message.includes('pension') || message.includes('401k')) {
      return responses.retirement[Math.floor(Math.random() * responses.retirement.length)];
    } else {
      return responses.default[Math.floor(Math.random() * responses.default.length)];
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // 1.5-2.5 second delay
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    'How should I start investing?',
    'What are blue-chip stocks?',
    'Is crypto a good investment?',
    'How much should I save?',
    'Retirement planning tips'
  ];

  return (
    <div className="chatbot-container">
      <nav className="chatbot-navbar">
        <div className="chatbot-navbar-brand">
          <h2>AI Financial Advisor</h2>
        </div>
        <div className="chatbot-navbar-menu">
          <button className="chatbot-nav-button" onClick={onBack}>
            ← Back to Dashboard
          </button>
          <button className="chatbot-nav-button signout" onClick={onSignOut} disabled={loading}>
            {loading ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </nav>

      <main className="chatbot-main">
        <div className="chatbot-chat-container">
          <div className="chatbot-header">
            <div className="chatbot-avatar">
              <span className="avatar-emoji">🤖</span>
            </div>
            <div className="chatbot-info">
              <h3>AI Financial Advisor</h3>
              <p>Online • Ready to help</p>
            </div>
            <div className="chatbot-status">
              <span className="status-dot"></span>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chatbot-message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-avatar">
                  {message.type === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-content">
                  <p>{message.content}</p>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chatbot-message bot-message">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="chatbot-quick-questions">
            <p>Quick questions:</p>
            <div className="quick-questions-grid">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  className="quick-question-btn"
                  onClick={() => setInputMessage(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div className="chatbot-input-container">
            <div className="chatbot-input-wrapper">
              <input
                type="text"
                placeholder="Ask me anything about finance and investing..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="chatbot-input"
              />
              <button
                className="chatbot-send-btn"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
              >
                <span className="send-icon">📤</span>
              </button>
            </div>
          </div>
        </div>

        <div className="chatbot-sidebar">
          <div className="sidebar-section">
            <h4>💡 Financial Tips</h4>
            <ul>
              <li>Diversify your investments</li>
              <li>Invest for the long term</li>
              <li>Never invest money you can't afford to lose</li>
              <li>Keep learning about markets</li>
              <li>Track your expenses</li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h4>📊 Market Overview</h4>
            <div className="market-indicators">
              <div className="indicator">
                <span className="indicator-label">Nifty 50</span>
                <span className="indicator-value positive">+1.2%</span>
              </div>
              <div className="indicator">
                <span className="indicator-label">Sensex</span>
                <span className="indicator-value positive">+0.8%</span>
              </div>
              <div className="indicator">
                <span className="indicator-label">Bitcoin</span>
                <span className="indicator-value negative">-2.1%</span>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h4>🎯 Goals</h4>
            <div className="goals-list">
              <div className="goal-item">
                <span className="goal-icon">🏠</span>
                <span className="goal-text">Emergency Fund</span>
              </div>
              <div className="goal-item">
                <span className="goal-icon">🏖️</span>
                <span className="goal-text">Vacation Fund</span>
              </div>
              <div className="goal-item">
                <span className="goal-icon">🏦</span>
                <span className="goal-text">Retirement</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AIChatBot;