const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}\n`;
  
  // Console log
  console.log(logMessage);
  
  // File log
  const logFile = path.join(logsDir, `${new Date().toISOString().split('T')[0]}.log`);
  fs.appendFileSync(logFile, logMessage);
};

const logError = (error, context = '') => {
  const message = `${context} - ${error.message}`;
  log(message, 'error');
};

const logApi = (method, path, statusCode, userId = null) => {
  const user = userId ? ` (User: ${userId})` : '';
  log(`${method} ${path} - ${statusCode}${user}`, 'api');
};

module.exports = { log, logError, logApi };
