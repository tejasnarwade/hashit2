import React from 'react';
//0
function HomePage({
  currentUser,
  username,
  roomForm,
  error,
  message,
  loading,
  onRoomChange,
  onCreateRoom,
  onJoinRoom,
  onSignOut,
  onNavigate,
  onBackToDashboard,
}) {
  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-brand"><h2>Vectra</h2></div>
        <div className="navbar-menu">
          <button className="nav-button" onClick={onBackToDashboard || (() => onNavigate && onNavigate('dashboard'))}>
            Dashboard
          </button>
          <button className="nav-button active">Game Room</button>
          <button className="nav-button" onClick={() => onNavigate && onNavigate('markets')}>Markets</button>
          <button className="nav-button" onClick={() => onNavigate && onNavigate('about')}>About</button>
          <button className="nav-button signout" onClick={onSignOut} disabled={loading}>
            {loading ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </nav>
      
      <main className="home-main">
        <div className="welcome-section">
          <h1>Welcome, {username}! 🎮</h1>
          <p className="welcome-subtitle">Ready to compete? Create or join a game room to start your financial journey.</p>
        </div>

        {/* Display feedback messages */}
        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-header">
              <h3>✨ Create New Game</h3>
              <p>Start a new financial simulation match</p>
            </div>
            <form className="room-form" onSubmit={onCreateRoom}>
              <div className="input-group">
                <label>Player Name</label>
                <input
                  type="text"
                  name="createPlayerName"
                  placeholder="Enter your name (e.g., 'Alex')"
                  value={roomForm.createPlayerName || ''}
                  onChange={onRoomChange}
                  disabled={loading}
                  required
                />
              </div>
              <div className="input-group">
                <label>Room Name</label>
                <input
                  type="text"
                  name="createName"
                  placeholder="Enter room name (e.g., 'Finance Masters')"
                  value={roomForm.createName}
                  onChange={onRoomChange}
                  disabled={loading}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="primary-button"
                disabled={loading}
              >
                {loading ? 'Creating Room...' : 'Create Game Room'}
              </button>
            </form>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>🎯 Join Existing Game</h3>
              <p>Enter an active game room and compete</p>
            </div>
            <form className="room-form" onSubmit={onJoinRoom}>
              <div className="input-group">
                <label>Player Name</label>
                <input
                  type="text"
                  name="joinPlayerName"
                  placeholder="Enter your name (e.g., 'Jordan')"
                  value={roomForm.joinPlayerName || ''}
                  onChange={onRoomChange}
                  disabled={loading}
                  required
                />
              </div>
              <div className="input-group">
                <label>Room Code</label>
                <input
                  type="text"
                  name="joinName"
                  placeholder="Enter room code (e.g., 'ABC123')"
                  value={roomForm.joinName}
                  onChange={onRoomChange}
                  disabled={loading}
                  maxLength="6"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="primary-button"
                disabled={loading}
              >
                {loading ? 'Joining Room...' : 'Join Game'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
