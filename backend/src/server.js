require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');
const logger = require('./config/pino');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    const connection = await pool.getConnection();
    logger.info('Connected to MySQL');
    connection.release();

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (err) {
    logger.error(err, 'Failed to start server');
    process.exit(1);
  }
}

start();