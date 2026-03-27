import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import HomePage from './HomePage';
import { supabase } from './supabaseClient';

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

      <main className="home-main">
        <div className="welcome-section">
          <h1>Welcome back, {username}!</h1>
          <p className="welcome-subtitle">Choose your action to continue with financial simulation:</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Financial Game</h3>
              <p>Start your financial simulation journey.</p>
            </div>
            <button className="primary-button" onClick={() => onNavigate('home')}>
              Enter Game Room
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>Financial Quiz</h3>
              <p>Test your financial knowledge and skills.</p>
            </div>
            <button className="primary-button" onClick={() => onNavigate('quiz')}>
              Take Quiz
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>Learn More</h3>
              <p>Discover how Vectra works and game mechanics.</p>
            </div>
            <button className="primary-button" onClick={() => onNavigate('about')}>
              About Game
            </button>
          </div>
        </div>
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
    joinName: '',
  });

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
      setError('Supabase is not configured. Add your env keys first.');
      return;
    }

    setLoading(true);

    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (googleError) {
        throw googleError;
      }
    } catch (googleError) {
      setError(
        googleError.message ||
          'Google sign-in could not start. Check your Supabase Google provider settings.'
      );
      setLoading(false);
    }
  };

  const handleRoomChange = (event) => {
    const { name, value } = event.target;
    setRoomForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCreateRoom = (event) => {
    event.preventDefault();
    resetFeedback();
    
    if (!roomForm.createName.trim()) {
      setError('Please enter a room name');
      return;
    }
    
    setMessage(`Game room "${roomForm.createName}" created! (Backend integration pending)`);
    setRoomForm({ ...roomForm, createName: '' });
  };

  const handleJoinRoom = (event) => {
    event.preventDefault();
    resetFeedback();
    
    if (!roomForm.joinName.trim()) {
      setError('Please enter a room code');
      return;
    }
    
    setMessage(`Joining room "${roomForm.joinName}"... (Backend integration pending)`);
    setRoomForm({ ...roomForm, joinName: '' });
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

  if (currentUser && route === 'home') {
    return (
      <HomePage
        currentUser={currentUser}
        error={error}
        message={message}
        loading={loading}
        onRoomChange={handleRoomChange}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        onSignOut={handleSignOut}
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
