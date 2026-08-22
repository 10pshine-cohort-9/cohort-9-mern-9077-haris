require('dotenv').config({ path: '.env.test' });
const pool = require('../src/config/db');

exports.mochaHooks = {
  async beforeAll() {
    this.timeout(10000);
    await pool.query('SELECT 1');
  },
  async afterEach() {
    await pool.query('DELETE FROM notes');
    await pool.query('DELETE FROM users');
  },
  async afterAll() {
    await pool.end();
  },
};