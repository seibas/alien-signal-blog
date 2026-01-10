/**
 * Utility functions for showing toast notifications
 * Uses DOM manipulation to create and display toast messages
 */

/**
 * Shows a toast notification
 * @param {string} message - The message to display
 * @param {string} type - Type of toast: 'success' | 'error' | 'info'
 * @param {number} duration - Duration in ms before auto-dismiss (default: 3000)
 */
export function showToast(message, type = 'info', duration = 3000) {
  // Create container if it doesn't exist
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  // Get type-specific styles
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          background: 'linear-gradient(135deg, rgba(0,255,140,0.15) 0%, rgba(0,150,100,0.2) 100%)',
          border: '1px solid rgba(0,255,140,0.4)',
          color: '#00ff8c',
          icon: '🛸',
        };
      case 'error':
        return {
          background: 'linear-gradient(135deg, rgba(255,107,53,0.15) 0%, rgba(200,50,50,0.2) 100%)',
          border: '1px solid rgba(255,107,53,0.4)',
          color: '#ff6b35',
          icon: '⚠️',
        };
      default:
        return {
          background: 'linear-gradient(135deg, rgba(234,255,247,0.1) 0%, rgba(150,180,170,0.15) 100%)',
          border: '1px solid rgba(234,255,247,0.3)',
          color: '#eafff7',
          icon: '📡',
        };
    }
  };

  const styles = getTypeStyles();

  // Create toast element
  const toast = document.createElement('div');
  toast.style.cssText = `
    min-width: 320px;
    max-width: 500px;
    padding: 16px 20px;
    border-radius: 12px;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2);
    background: ${styles.background};
    border: ${styles.border};
    color: ${styles.color};
    font-family: 'Share Tech Mono', monospace;
    font-size: 14px;
    letter-spacing: 0.03em;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: toastSlideIn 0.3s ease-out;
    pointer-events: auto;
  `;

  toast.innerHTML = `
    <span style="font-size: 20px;">${styles.icon}</span>
    <span style="flex: 1;">${message}</span>
    <button style="
      background: none;
      border: none;
      color: inherit;
      font-size: 18px;
      cursor: pointer;
      padding: 4px;
      opacity: 0.7;
      transition: opacity 0.2s;
    ">✕</button>
  `;

  // Add close button handler
  const closeBtn = toast.querySelector('button');
  closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
  closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.7');
  closeBtn.addEventListener('click', () => removeToast(toast));

  // Add animation styles if not already added
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
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
      @keyframes toastSlideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Add to container
  container.appendChild(toast);

  // Auto-remove after duration
  if (duration > 0) {
    setTimeout(() => removeToast(toast), duration);
  }
}

/**
 * Removes a toast with animation
 */
function removeToast(toast) {
  toast.style.animation = 'toastSlideOut 0.3s ease-in';
  setTimeout(() => {
    toast.remove();
    // Clean up container if empty
    const container = document.getElementById('toast-container');
    if (container && container.children.length === 0) {
      container.remove();
    }
  }, 300);
}

// Convenience functions
export const toast = {
  success: (message, duration) => showToast(message, 'success', duration),
  error: (message, duration) => showToast(message, 'error', duration),
  info: (message, duration) => showToast(message, 'info', duration),
};
