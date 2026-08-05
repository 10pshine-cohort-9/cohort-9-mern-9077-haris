const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

async function registerUser(name, email, password) {
  const [existingUsers] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
  if (existingUsers.length > 0) {
    const error = new Error('Email is already in use');
    error.statusCode = 409;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  );

  const token = jwt.sign(
    { id: result.insertId, email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return { token, user: { id: result.insertId, name, email } };
}

async function loginUser(email, password) {
  const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  if (users.length === 0) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const user = users[0];

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email }
  };
}

module.exports = { registerUser, loginUser };