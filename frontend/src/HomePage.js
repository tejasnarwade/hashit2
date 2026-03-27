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
  onHome,
  onAbout,
}) {
  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>HashIt</h2>
        </div>
        <div className="navbar-menu">
          <button className="nav-button" onClick={onHome}>
            Home
          </button>
          <button className="nav-button" onClick={onAbout}>
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
          <p className="welcome-subtitle">Ready to connect? Create or join a room to start chatting.</p>
        </div>

        <div className="room-grid">
          <form className="room-card" onSubmit={onCreateRoom}>
            <h3>Create Room</h3>
            <label className="input-group">
              <span>Your name</span>
              <input
                type="text"
                name="createName"
                placeholder="Enter your name"
                value={roomForm.createName}
                onChange={onRoomChange}
              />
            </label>
            <button type="submit" className="primary-button">
              Create Room
            </button>
          </form>

          <form className="room-card" onSubmit={onJoinRoom}>
            <h3>Join Room</h3>
            <label className="input-group">
              <span>Your name</span>
              <input
                type="text"
                name="joinName"
                placeholder="Enter your name"
                value={roomForm.joinName}
                onChange={onRoomChange}
              />
            </label>
            <button type="submit" className="primary-button">
              Join Room
            </button>
          </form>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}
      </main>
    </div>
  );
}

export default HomePage;
