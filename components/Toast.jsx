'use client';

import { useEffect } from 'react';

/**
 * Toast notification component for displaying success/error messages
 * Displays a styled notification that auto-dismisses after a specified duration
 *
 * @param {string} message - The message to display
 * @param {string} type - Type of toast: 'success' | 'error' | 'info'
 * @param {number} duration - Duration in ms before auto-dismiss (default: 3000)
 * @param {function} onClose - Callback function when toast closes
 */
export default function Toast({ message, type = 'info', duration = 3000, onClose }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          background: 'linear-gradient(135deg, rgba(0,255,140,0.15) 0%, rgba(0,150,100,0.2) 100%)',
          border: '1px solid rgba(0,255,140,0.4)',
          color: '#00ff8c',
        };
      case 'error':
        return {
          background: 'linear-gradient(135deg, rgba(255,107,53,0.15) 0%, rgba(200,50,50,0.2) 100%)',
          border: '1px solid rgba(255,107,53,0.4)',
          color: '#ff6b35',
        };
      default:
        return {
          background: 'linear-gradient(135deg, rgba(234,255,247,0.1) 0%, rgba(150,180,170,0.15) 100%)',
          border: '1px solid rgba(234,255,247,0.3)',
          color: '#eafff7',
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 10000,
          minWidth: '320px',
          maxWidth: '500px',
          padding: '16px 20px',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)',
          ...typeStyles,
          animation: 'toastSlideIn 0.3s ease-out',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '14px',
          letterSpacing: '0.03em',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '20px' }}>
          {type === 'success' && '🛸'}
          {type === 'error' && '⚠️'}
          {type === 'info' && '📡'}
        </span>
        <span style={{ flex: 1 }}>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '4px',
              opacity: 0.7,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.opacity = '1'}
            onMouseLeave={(e) => e.target.style.opacity = '0.7'}
          >
            ✕
          </button>
        )}
      </div>
      <style jsx>{`
        @keyframes toastSlideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
