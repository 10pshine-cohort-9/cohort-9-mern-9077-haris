const dotenvResult = require('dotenv').config({ path: '.env.test' });

if (dotenvResult.error || process.env.NODE_ENV !== 'test' || process.env.DB_NAME !== 'notes_app_test') {
  throw new Error('Refusing to run tests without the expected test database configuration');
}

const pool = require('../src/config/db');

exports.mochaHooks = {
  beforeAll: async function () {
    this.timeout(10000);
    await pool.query('SELECT 1'); 
  },

  afterEach: async function () {
    await pool.query('DELETE FROM notes');
    await pool.query('DELETE FROM users');
  },

  afterAll: async function () {
    await pool.end();
  },
};