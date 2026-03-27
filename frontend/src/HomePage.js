import React from 'react';

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
}) {
  return (  
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>Vectra</h2>
        </div>
        <div className="navbar-menu">
          <button className="nav-button active">Dashboard</button>
          <button className="nav-button signout" onClick={onSignOut} disabled={loading}>
            {loading ? 'Logging Out...' : 'Exit Game'}
          </button>
        </div>
      </nav>

      <main className="home-main">
        <div className="welcome-section">
          <h1>Welcome, {username}</h1>
          <p className="welcome-subtitle">Ready to compete? Create or join a game room to start your financial journey.</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Create New Game</h3>
              <p>Start a new financial simulation match</p>
            </div>
            <form className="room-form" onSubmit={onCreateRoom}>
              <div className="input-group">
                <label>Room Name</label>
                <input
                  type="text"
                  name="createName"
                  placeholder="Enter room name"
                  value={roomForm.createName}
                  onChange={onRoomChange}
                  required
                />
              </div>
              <button type="submit" className="primary-button">
                Create Game Room
              </button>
            </form>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>Join Existing Game</h3>
              <p>Enter an active game room and compete</p>
            </div>
            <form className="room-form" onSubmit={onJoinRoom}>
              <div className="input-group">
                <label>Room Code</label>
                <input
                  type="text"
                  name="joinName"
                  placeholder="Enter room code"
                  value={roomForm.joinName}
                  onChange={onRoomChange}
                  required
                />
              </div>
              <button type="submit" className="primary-button">
                Join Game
              </button>
            </form>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}
      </main>
    </div>
  );
}

export default HomePage;
