const pinoHttp = require('pino-http');
const logger = require('../config/pino');

module.exports = pinoHttp({ logger });