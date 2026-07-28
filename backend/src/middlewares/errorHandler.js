const logger = require('../config/pino');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  logger.error({ err, path: req.path, method: req.method }, err.message);

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Something went wrong' : err.message,
  });
}

module.exports = errorHandler;