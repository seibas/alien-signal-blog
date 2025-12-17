'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'alien-signal-2025';

  useEffect(() => {
    // Check if already authenticated
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      router.push('/blog');
    }
  }, [router]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authenticated', 'true');
      router.push('/blog');
    } else {
      setError('Invalid password. Access denied.');
      setPassword('');
    }
  };

  return (
    <section className="container">
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-icon">🛸</div>
          <h2 className="auth-title">Admin Login</h2>
          <p className="auth-subtitle">Enter the signal password to access admin features</p>
          
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
              🔓 Login
            </button>
          </form>

          <div className="auth-hint">
            <small>Hint: alien-signal-2025</small>
          </div>
        </div>
      </div>
    </section>
  );
}
