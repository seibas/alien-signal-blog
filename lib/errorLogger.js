/**
 * Error Logging Utility
 * Provides consistent error logging across the application
 * Can be extended to integrate with services like Sentry, LogRocket, etc.
 */

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Log levels
 */
export const LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

/**
 * Log an error with context
 * @param {Error|string} error - The error object or message
 * @param {Object} context - Additional context (component, user action, etc.)
 * @param {string} level - Log level (error, warn, info, debug)
 */
export function logError(error, context = {}, level = LogLevel.ERROR) {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : error;
  const stack = error instanceof Error ? error.stack : null;

  const logEntry = {
    timestamp,
    level,
    message: errorMessage,
    stack,
    context: {
      url: typeof window !== 'undefined' ? window.location.href : 'N/A',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
      ...context
    }
  };

  // In development, log to console with full details
  if (isDevelopment) {
    const consoleMethod = level === LogLevel.ERROR ? 'error' :
                         level === LogLevel.WARN ? 'warn' : 'log';
    console[consoleMethod]('🛸 Error Log:', logEntry);
    if (stack) console[consoleMethod]('Stack:', stack);
  }

  // In production, you would send to error tracking service
  // Example: Send to Sentry, LogRocket, or custom endpoint
  if (!isDevelopment) {
    // TODO: Integrate with error tracking service
    // Example: Sentry.captureException(error, { contexts: { custom: context } });
    // For now, just log to console (can be removed once service is integrated)
    console.error('[Production Error]', logEntry);
  }

  return logEntry;
}

/**
 * Log API errors specifically
 */
export function logApiError(endpoint, error, statusCode, context = {}) {
  return logError(error, {
    type: 'API_ERROR',
    endpoint,
    statusCode,
    ...context
  });
}

/**
 * Log component errors
 */
export function logComponentError(componentName, error, context = {}) {
  return logError(error, {
    type: 'COMPONENT_ERROR',
    component: componentName,
    ...context
  });
}

/**
 * Log user action errors
 */
export function logUserActionError(action, error, context = {}) {
  return logError(error, {
    type: 'USER_ACTION_ERROR',
    action,
    ...context
  });
}

/**
 * Helper to safely stringify objects (handles circular references)
 */
export function safeStringify(obj) {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value;
  });
}
