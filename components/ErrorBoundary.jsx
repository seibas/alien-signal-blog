'use client';

import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f35 100%)',
          color: '#00ff41'
        }}>
          <div style={{
            maxWidth: '600px',
            textAlign: 'center',
            border: '2px solid #00ff41',
            borderRadius: '16px',
            padding: '2rem',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛸💥</div>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Alien Transmission Error!
            </h1>
            <p style={{ marginBottom: '1.5rem', color: '#aaa' }}>
              The cosmic translator has encountered an anomaly. Our alien engineers have been notified.
            </p>
            <details style={{ 
              textAlign: 'left', 
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: '#ff6b35'
            }}>
              <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                Technical Details
              </summary>
              <code style={{ display: 'block', whiteSpace: 'pre-wrap' }}>
                {this.state.error?.toString()}
              </code>
            </details>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '2rem',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                backgroundColor: '#00ff41',
                color: '#0a0e1a',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🔄 Restart Transmission
            </button>
            <a
              href="/"
              style={{
                display: 'block',
                marginTop: '1rem',
                color: '#00ff41',
                textDecoration: 'none'
              }}
            >
              ← Return to Home Base
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
