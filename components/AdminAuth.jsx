'use client';

import { useState, useEffect } from 'react';

export default function AdminAuth({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if already authenticated with valid token
    const token = sessionStorage.getItem('admin_token');
    if (token) {
      // Verify token is still valid
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call server-side authentication API
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store token securely in sessionStorage
        sessionStorage.setItem('admin_token', data.token);
        sessionStorage.setItem('admin_authenticated', 'true');
        setIsAuthenticated(true);
        setError('');
      } else {
        setError(data.error || 'Invalid password. Access denied.');
        setPassword('');
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_token');
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
