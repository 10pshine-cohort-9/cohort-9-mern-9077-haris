const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const logger = require('../config/pino');

async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return sendError(res, 400, 'Name, email, and password are required');
    }

    const data = await authService.registerUser(name, email, password);
    logger.info({ userId: data.user.id }, 'New user registered successfully');
    
    return sendSuccess(res, 201, data, 'User registered successfully');
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required');
    }

    const data = await authService.loginUser(email, password);
    logger.info({ userId: data.user.id }, 'User logged in successfully');
    
    return sendSuccess(res, 200, data, 'Login successful');
  } catch (error) {
    next(error);
  }
}

module.exports = { signup, login };