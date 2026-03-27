import React, { useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import HomePage from './HomePage';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const initialForm = {
  username: '',
  email: '',
  password: '',
};

function DashboardPage({ username, onNavigate, onSignOut, loading }) {
  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>HashIt</h2>
        </div>
        <div className="navbar-menu">
          <button className="nav-button active" onClick={() => onNavigate('dashboard')}>
            Home
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
          <p className="welcome-subtitle">Choose your action to continue:</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Game</h3>
              <p>Open your existing game page.</p>
            </div>
            <button className="primary-button" onClick={() => onNavigate('home')}>
              Open Game
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>Quiz</h3>
              <p>Quiz feature for setting reminders and tracking progress.</p>
            </div>
            <button className="primary-button" onClick={() => onNavigate('quiz')}>
              Open Quiz
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>AI</h3>
              <p>AI-powered features coming soon.</p>
            </div>
            <button className="primary-button">
              Open AI
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
          <h2>HashIt</h2>
        </div>
        <div className="navbar-menu">
          <button className="nav-button" onClick={onBack}>Home</button>
          <button className="nav-button active">About</button>
          <button className="nav-button signout" onClick={onSignOut} disabled={loading}>
            {loading ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </nav>

      <main className="home-main">
        <div className="welcome-section">
          <h1>About HashIt</h1>
          <p className="welcome-subtitle">This app combines game and quiz features in a polished dashboard.</p>
        </div>
        <div className="dashboard-card" style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div className="card-header">
            <h3>App expectations</h3>
            <p>Use Home for the game flow, and future Quiz section will include reminder behavior.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  const [mode, setMode] = useState('login');
  const [route, setRoute] = useState(() => {
    const path = window.location.pathname;
    if (path === '/home') return 'home';
    if (path === '/dashboard') return 'dashboard';
    if (path === '/about') return 'about';
    return 'auth';
  });
  const [form, setForm] = useState(initialForm);
  const [session, setSession] = useState(null);
  const [roomForm, setRoomForm] = useState({
    createName: '',
    joinName: '',
    createYears: 5,
    joinRoomCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const isConfigured = useMemo(() => Boolean(supabase), []);

  const navigate = (nextRoute) => {
    let nextPath = '/';
    if (nextRoute === 'home') nextPath = '/home';
    if (nextRoute === 'dashboard') nextPath = '/dashboard';
    if (nextRoute === 'about') nextPath = '/about';

    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
    setRoute(nextRoute);
  };

  useEffect(() => {
    const handlePopState = () => {
      setRoute(window.location.pathname === '/home' ? 'home' : 'auth');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  // Ensure users table has a row mapping to the authenticated Supabase user (auth_id -> users.user_id)
  useEffect(() => {
    if (!supabase) return undefined;
    if (!session?.user) return undefined;

    let mounted = true;
    (async () => {
      try {
        const authUser = session.user;
        const authId = authUser.id;
        const defaultName = authUser.user_metadata?.username || authUser.email?.split('@')[0] || 'User';

        // Prefer select then insert/update to avoid using on_conflict with client REST requests
        const { data: found, error: findErr } = await supabase
          .from('users')
          .select('user_id, name')
          .eq('auth_id', authId)
          .limit(1);

        if (findErr) {
          console.warn('Could not find users for session auth_id:', findErr);
        }

        if (found && found.length > 0) {
          const existing = found[0];
          if (existing.name !== defaultName) {
            const { error: updErr } = await supabase
              .from('users')
              .update({ name: defaultName })
              .eq('auth_id', authId);
            if (updErr) console.warn('Failed to update users.name for session auth_id:', updErr);
          }
        } else {
          const { data: insertedUser, error: insertErr } = await supabase
            .from('users')
            .insert({ auth_id: authId, name: defaultName })
            .select()
            .single();
          if (insertErr) console.warn('Could not insert users for session auth_id:', insertErr);
        }
        if (!mounted) return;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Error ensuring users mapping for session:', e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [session]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleRoomChange = (event) => {
    const { name, value } = event.target;
    setRoomForm((current) => ({
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
        // Attempt to sign up and capture returned auth user id when available
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
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

        // If auth user id is available immediately, insert/upsert into users with auth_id.
        try {
          const authId = signUpData?.user?.id;
          if (authId) {
            // Prefer a select then insert/update flow to avoid using on_conflict in client requests
            const { data: found, error: findErr } = await supabase
              .from('users')
              .select('user_id, name')
              .eq('auth_id', authId)
              .limit(1);
            if (findErr) {
              console.warn('Failed to find users by auth_id after signup:', findErr);
            }

            if (found && found.length > 0) {
              // Optionally update the name if it differs
              const existing = found[0];
              if (existing.name !== username) {
                const { error: updErr } = await supabase
                  .from('users')
                  .update({ name: username })
                  .eq('auth_id', authId);
                if (updErr) console.warn('Failed to update users.name after signup:', updErr);
              }
            } else {
              const { data: insertedUser, error: insertUserError } = await supabase
                .from('users')
                .insert({ auth_id: authId, name: username })
                .select()
                .single();
              if (insertUserError) console.warn('Failed to insert into users table after signup:', insertUserError);
            }
          } else {
            // fallback: insert by name only (best-effort)
            const { data: insertedUser, error: insertUserError } = await supabase
              .from('users')
              .insert({ name: username })
              .select()
              .single();

            if (insertUserError) {
              console.warn('Failed to insert into users table after signup:', insertUserError);
            }
          }
        } catch (e) {
          console.warn('Error inserting/upserting user record after signup:', e);
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
      setSession(null);
      navigate('auth');
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

  const handleCreateRoom = (event) => {
    event.preventDefault();
    resetFeedback();

    const createName = roomForm.createName.trim();
    const totalYears = Number(roomForm.createYears) || 5;

    if (!createName) {
      setError('Please enter your name to create a room.');
      return;
    }

    if (!supabase) {
      setError('Supabase is not configured. Add your env keys first.');
      return;
    }

    // create room flow: insert user, create room, insert room_player
    (async () => {
      setLoading(true);
      try {
        // Insert user
        const { data: insertedUsers, error: userError } = await supabase
          .from('users')
          .insert({ name: createName })
          .select();

        if (userError) throw userError;
        const user = Array.isArray(insertedUsers) ? insertedUsers[0] : insertedUsers;
        const userId = user?.user_id ?? user?.id;

        // Generate unique room code
        const generateRoomCode = () => Math.floor(1000 + Math.random() * 9000).toString();
        let code = generateRoomCode();
        let attempts = 0;
        while (attempts < 5) {
          const { data: existing, error: checkError } = await supabase
            .from('rooms')
            .select('room_id')
            .eq('room_code', code)
            .limit(1);
          if (checkError) throw checkError;
          if (!existing || existing.length === 0) break;
          code = generateRoomCode();
          attempts += 1;
        }

        // Insert room
        const { data: insertedRooms, error: roomError } = await supabase
          .from('rooms')
          .insert({ room_code: code, total_years: totalYears })
          .select();

        if (roomError) throw roomError;
        const room = Array.isArray(insertedRooms) ? insertedRooms[0] : insertedRooms;
        const roomId = room?.room_id ?? room?.id;

        // Insert room_player
        const { error: rpError } = await supabase
          .from('room_players')
          .insert({ room_id: roomId, user_id: userId });

        if (rpError) throw rpError;

        setMessage(`Room created — code: ${code}`);
        setRoomForm((current) => ({ ...current, createName: '', createYears: 5 }));
      } catch (err) {
        setError(err?.message || JSON.stringify(err));
      } finally {
        setLoading(false);
      }
    })();
  };

  const handleJoinRoom = async (event) => {
    event.preventDefault();
    resetFeedback();

    const joinName = roomForm.joinName.trim();
    const joinCode = roomForm.joinRoomCode.trim();

    if (!joinName) {
      setError('Please enter your name to join a room.');
      return;
    }

    if (!joinCode) {
      setError('Please enter a room code to join.');
      return;
    }

    if (!supabase) {
      setError('Supabase is not configured. Add your env keys first.');
      return;
    }

    setLoading(true);

    try {
      // Find room by code
      const { data: rooms, error: roomFindError } = await supabase
        .from('rooms')
        .select('room_id')
        .eq('room_code', joinCode)
        .limit(1);

      if (roomFindError) throw roomFindError;
      if (!rooms || rooms.length === 0) {
        setError('Room not found for code: ' + joinCode);
        return;
      }

      const roomId = rooms[0].room_id ?? rooms[0].id;

      // Find or create user in users table. Prefer mapping via auth_id when session exists.
      let userId = null;
      const authId = session?.user?.id;

      if (authId) {
        const { data: authUsers, error: authFindErr } = await supabase
          .from('users')
          .select('user_id')
          .eq('auth_id', authId)
          .limit(1);
        if (authFindErr) throw authFindErr;
        if (authUsers && authUsers.length > 0) {
          userId = authUsers[0].user_id ?? authUsers[0].id;
        } else {
          const { data: insertedUsers, error: insertUserError } = await supabase
            .from('users')
            .insert({ auth_id: authId, name: joinName })
            .select()
            .single();

          if (insertUserError) throw insertUserError;
          userId = insertedUsers.user_id ?? insertedUsers.id;
        }
      } else {
        const { data: existingUsers, error: findUserError } = await supabase
          .from('users')
          .select('user_id')
          .ilike('name', joinName)
          .limit(1);

        if (findUserError) throw findUserError;

        if (existingUsers && existingUsers.length > 0) {
          userId = existingUsers[0].user_id ?? existingUsers[0].id;
        } else {
          const { data: insertedUsers, error: insertUserError } = await supabase
            .from('users')
            .insert({ name: joinName })
            .select()
            .single();

          if (insertUserError) throw insertUserError;
          userId = insertedUsers.user_id ?? insertedUsers.id;
        }
      }

      // Check if user already in room_players for this room
      const { data: existingRP, error: rpCheckError } = await supabase
        .from('room_players')
        .select('id')
        .eq('room_id', roomId)
        .eq('user_id', userId)
        .limit(1);

      if (rpCheckError) throw rpCheckError;

      if (existingRP && existingRP.length > 0) {
        setMessage(`${joinName} is already in the room.`);
        setRoomForm((current) => ({ ...current, joinName: '', joinRoomCode: '' }));
        return;
      }

      // Insert into room_players
      const { error: rpError } = await supabase.from('room_players').insert({ room_id: roomId, user_id: userId });
      if (rpError) throw rpError;

      setMessage(`${joinName} joined the room.`);
      setRoomForm((current) => ({ ...current, joinName: '', joinRoomCode: '' }));
    } catch (err) {
      setError(err?.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  const currentUser = session?.user;
  const username =
    currentUser?.user_metadata?.username ||
    currentUser?.user_metadata?.full_name ||
    currentUser?.email?.split('@')[0] ||
    'User';

  useEffect(() => {
    if (currentUser) {
      navigate('dashboard');
    } else {
      navigate('auth');
    }
  }, [currentUser]);

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
        username={username}
        roomForm={roomForm}
        error={error}
        message={message}
        loading={loading}
        onRoomChange={handleRoomChange}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        onSignOut={handleSignOut}
        onHome={() => navigate('dashboard')}
        onAbout={() => navigate('about')}
      />
    );
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">Supabase Auth</p>
        <h1>Login and registration for your React app</h1>
        <p className="hero-copy">
          A simple auth flow connected directly to Supabase with Gmail address,
          username, and password fields.
        </p>
        <div className="feature-list">
          <span>Direct Supabase connection</span>
          <span>Email/password auth</span>
          <span>Session-aware screen</span>
        </div>
      </section>

      <section className="auth-panel">
        {!isConfigured ? (
          <div className="auth-card">
            <h2>Supabase keys missing</h2>
            <p className="panel-copy">
              Add `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` to
              your `.env` file, then restart the frontend.
            </p>
          </div>
        ) : (
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

            <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
            <p className="panel-copy">
              {mode === 'login'
                ? 'Sign in with your Gmail address and password.'
                : 'Create an account with a username, Gmail address, password, or use Google.'}
            </p>

            <button
              type="button"
              className="google-button"
              onClick={handleGoogleAuth}
              disabled={loading}
            >
              {loading ? 'Opening Google...' : 'Continue with Google'}
            </button>

            <div className="divider">
              <span>or continue with email</span>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {mode === 'register' ? (
                <label className="input-group">
                  <span>Username</span>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={form.username}
                    onChange={handleChange}
                    autoComplete="username"
                  />
                </label>
              ) : null}

              <label className="input-group">
                <span>Gmail address</span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@gmail.com"
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
                    ? 'Signing in...'
                    : 'Creating account...'
                  : mode === 'login'
                    ? 'Login'
                    : 'Register'}
              </button>
            </form>
          </div>
        )}
      </section>

      
    </main>
  );
}

export default App;
