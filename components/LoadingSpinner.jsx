'use client';

export default function LoadingSpinner({ size = 'md', message = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className="loading-spinner-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      padding: '2rem'
    }}>
      <div className="loading-spinner" style={{
        width: size === 'sm' ? '16px' : size === 'md' ? '32px' : size === 'lg' ? '48px' : '64px',
        height: size === 'sm' ? '16px' : size === 'md' ? '32px' : size === 'lg' ? '48px' : '64px',
        border: '3px solid rgba(0, 255, 65, 0.1)',
        borderTop: '3px solid rgba(0, 255, 65, 0.8)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      {message && (
        <p style={{
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--text-sm)',
          margin: 0
        }}>
          {message}
        </p>
      )}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
