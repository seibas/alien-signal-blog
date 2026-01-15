/**
 * Production-safe logger
 * Only logs in development mode, prevents console pollution in production
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Log informational messages (development only)
   */
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Log error messages (always logged, but could be sent to error tracking service)
   */
  error: (message, error = null) => {
    if (isDevelopment) {
      console.error(message, error);
    } else {
      // In production, send to error tracking service (Sentry, LogRocket, etc.)
      // For now, we'll use console.error but you can replace this with your service
      console.error(message);
    }
  },

  /**
   * Log warning messages (development only)
   */
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Log debug information (development only)
   */
  debug: (...args) => {
    if (isDevelopment) {
      console.debug('[DEBUG]', ...args);
    }
  },

  /**
   * Log API requests (development only)
   */
  api: (method, url, data = null) => {
    if (isDevelopment) {
      console.log(`[API] ${method} ${url}`, data || '');
    }
  },
};

export default logger;
