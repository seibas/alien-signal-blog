'use client';

import { useState, useEffect } from 'react';

export default function AdminAuth({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Admin password from environment variable
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '0904';

  useEffect(() => {
    // Check if already authenticated in session
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setError('');
    } else {
      setError('Invalid password. Access denied.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    setPassword('');
  };

  if (isLoading) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-icon">🛸</div>
          <h2 className="auth-title">Admin Access Required</h2>
          <p className="auth-subtitle">Enter the signal password to edit content</p>
          
          <form onSubmit={handleLogin} className="auth-form">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="auth-input"
              autoFocus
            />
            {error && <div className="auth-error">{error}</div>}
            <button type="submit" className="btn btnPrimary auth-submit">
              🔓 Authenticate
            </button>
          </form>

          <div className="auth-hint">
            <small>Hint: Check the code or environment variables</small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="admin-bar">
        <span className="admin-badge">👤 Admin Mode</span>
        <button onClick={handleLogout} className="admin-logout">
          🚪 Logout
        </button>
      </div>
      {children}
    </>
  );
}
