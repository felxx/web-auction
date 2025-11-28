const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR'
};

const ENABLED_LEVELS = process.env.NODE_ENV === 'production' 
  ? [LOG_LEVELS.WARN, LOG_LEVELS.ERROR]
  : [LOG_LEVELS.DEBUG, LOG_LEVELS.INFO, LOG_LEVELS.WARN, LOG_LEVELS.ERROR];

const formatMessage = (level, component, message, ...args) => {
  const timestamp = new Date().toISOString();
  const componentPrefix = component ? `[${component}]` : '';
  return [`[${timestamp}] [${level}] ${componentPrefix}`, message, ...args];
};

const isLevelEnabled = (level) => {
  return ENABLED_LEVELS.includes(level);
};

class Logger {
  constructor(component) {
    this.component = component;
  }

  debug(message, ...args) {
    if (isLevelEnabled(LOG_LEVELS.DEBUG)) {
      console.log(...formatMessage(LOG_LEVELS.DEBUG, this.component, message, ...args));
    }
  }

  info(message, ...args) {
    if (isLevelEnabled(LOG_LEVELS.INFO)) {
      console.info(...formatMessage(LOG_LEVELS.INFO, this.component, message, ...args));
    }
  }

  warn(message, ...args) {
    if (isLevelEnabled(LOG_LEVELS.WARN)) {
      console.warn(...formatMessage(LOG_LEVELS.WARN, this.component, message, ...args));
    }
  }

  error(message, error, ...args) {
    if (isLevelEnabled(LOG_LEVELS.ERROR)) {
      const errorDetails = error ? {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      } : null;
      console.error(...formatMessage(LOG_LEVELS.ERROR, this.component, message, errorDetails, ...args));
    }
  }

  logRequest(method, url, data) {
    this.debug(`API Request: ${method} ${url}`, data);
  }

  logResponse(method, url, response) {
    this.debug(`API Response: ${method} ${url}`, response);
  }

  logApiError(method, url, error) {
    const status = error.response?.status;
    const errorMessage = error.response?.data?.message || error.message;
    this.error(`API Error: ${method} ${url} - Status: ${status}`, error, errorMessage);
  }

  logUserAction(action, details) {
    this.info(`User Action: ${action}`, details);
  }

  logNavigation(from, to) {
    this.debug(`Navigation: ${from} -> ${to}`);
  }
}

export const createLogger = (component) => {
  return new Logger(component);
};

export const logger = new Logger();

export default logger;
