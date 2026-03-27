import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Chatbot.css';

const PROFILE_STORAGE_KEY = 'vectra_financial_chat_profile_v1';
const LEGACY_CHAT_STORAGE_KEY = 'vectra_financial_chat_history_v1';
const LEGACY_QA_STORAGE_KEY = 'vectra_financial_chat_qa_v1';
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function inferLearningModule(answer) {
  const text = answer.toLowerCase();
  if (text.includes('budget')) return 'budgeting';
  if (text.includes('save')) return 'saving';
  if (text.includes('credit') || text.includes('debt')) return 'credit';
  return 'investing';
}

function Chatbot({ username, onBack, onSignOut, loading }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        `Hi ${username || 'there'}! I am your AI financial coach. Ask me any money question and I will only ask for missing details when needed.`,
    },
  ]);
  const [profile, setProfile] = useState({});
  const [input, setInput] = useState('');
  const [pendingField, setPendingField] = useState(null);
  const [originalQuestion, setOriginalQuestion] = useState('');
  const [qaMemory, setQaMemory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastInsights, setLastInsights] = useState(null);
  const [lastLearningPath, setLastLearningPath] = useState([]);
  const endRef = useRef(null);

  useEffect(() => {
    // Always clear old communication artifacts and profile on fresh load.
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    localStorage.removeItem(LEGACY_CHAT_STORAGE_KEY);
    localStorage.removeItem(LEGACY_QA_STORAGE_KEY);
    setProfile({});
    setMessages([
      {
        role: 'assistant',
        content:
          `Hi ${username || 'there'}! I am your AI financial coach. Ask me any money question and I will only ask for missing details when needed.`,
      },
    ]);
    setPendingField(null);
    setOriginalQuestion('');
    setQaMemory([]);
    setLastInsights(null);
    setLastLearningPath([]);
    setInput('');
    setIsLoading(false);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const shortMemory = useMemo(() => messages.slice(-10), [messages]);

  const appendMessage = (role, content) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  const handleSend = async (event) => {
    event.preventDefault();
    const question = input.trim();
    if (!question || isLoading) return;

    appendMessage('user', question);
    setInput('');
    setIsLoading(true);

    try {
      const activeOriginalQuestion = pendingField ? originalQuestion : question;
      const response = await fetch(`${API_BASE_URL}/api/financial-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          profile,
          recentMessages: shortMemory,
          qaMemory,
          pendingField,
          originalQuestion: activeOriginalQuestion,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to get chatbot response.');
      }

      if (data.profile) setProfile(data.profile);

      if (data.type === 'follow_up') {
        setPendingField(data.pendingField || null);
        setOriginalQuestion(data.originalQuestion || activeOriginalQuestion);
        appendMessage('assistant', data.followUpQuestion || 'Could you share more details?');
      } else {
        setPendingField(null);
        setOriginalQuestion('');
        appendMessage('assistant', data.answer || 'I could not generate a response right now.');
        setQaMemory((prev) => [
          ...prev.slice(-4),
          {
            question: data.effectiveQuestion || activeOriginalQuestion || question,
            answer: data.answer || '',
          },
        ]);
        setLastInsights(data.insights || null);
        setLastLearningPath(Array.isArray(data.learningPath) ? data.learningPath : []);
      }
    } catch (error) {
      appendMessage('assistant', `Sorry, I hit an issue: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const moduleSuggestion = inferLearningModule(messages[messages.length - 1]?.content || '');

  return (
    <div className="chatbot-page">
      <nav className="navbar">
        <div className="navbar-brand"><h2>Vectra</h2></div>
        <div className="navbar-menu">
          <button className="nav-button" onClick={onBack}>Dashboard</button>
          <button className="nav-button active">AI Coach</button>
          <button className="nav-button signout" onClick={onSignOut} disabled={loading}>
            {loading ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </nav>

      <main className="chatbot-main">
        <section className="chatbot-sidebar">
          <h3>Base Profile</h3>
          <p>Used for personalization. Missing fields are collected only when required.</p>
          <pre className="chatbot-profile-json">{JSON.stringify(profile, null, 2)}</pre>
          {lastInsights ? (
            <div className="chatbot-insights">
              <h4>System Insights</h4>
              <p><strong>Priority:</strong> {lastInsights.priority}</p>
              <p><strong>Problem:</strong> {lastInsights.problem}</p>
            </div>
          ) : null}
          <div className="chatbot-learning">
            <h4>AI Learning Path</h4>
            {lastLearningPath.length > 0 ? (
              <ul>
                {lastLearningPath.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            ) : (
              <p>Ask your first question to generate your path.</p>
            )}
            <p className="chatbot-module-tip">
              Module focus now: <span>{moduleSuggestion}</span>
            </p>
          </div>
        </section>

        <section className="chatbot-chat">
          <div className="chatbot-thread">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`chatbot-message ${message.role === 'user' ? 'user' : 'assistant'}`}
              >
                <div className="chatbot-bubble">{message.content}</div>
              </div>
            ))}
            {isLoading ? (
              <div className="chatbot-message assistant">
                <div className="chatbot-bubble chatbot-loading">Thinking...</div>
              </div>
            ) : null}
            <div ref={endRef} />
          </div>

          <form className="chatbot-input-row" onSubmit={handleSend}>
            <input
              type="text"
              placeholder={
                pendingField
                  ? 'Answer the follow-up to continue...'
                  : 'Ask a financial question (e.g., How should I invest?)'
              }
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              Send
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Chatbot;
