const { expect } = require('chai');
const sinon = require('sinon');
const request = require('supertest');
const bcrypt = require('bcryptjs');

const pool = require('../src/config/db');
const authService = require('../src/services/authService');
const app = require('../src/app');

describe('Auth Service (unit)', () => {
  afterEach(() => sinon.restore());

  describe('registerUser', () => {
    it('creates a new user and returns a token', async () => {
      sinon.stub(pool, 'execute')
        .onFirstCall().resolves([[]])
        .onSecondCall().resolves([{ insertId: 1 }]);

      const result = await authService.registerUser('Test User', 'new@example.com', 'password123');

      expect(result).to.have.property('token');
      expect(result.user).to.include({ id: 1, name: 'Test User', email: 'new@example.com' });
    });

    it('throws a 409 if the email is already registered', async () => {
      sinon.stub(pool, 'execute').resolves([[{ id: 1 }]]);

      try {
        await authService.registerUser('Test User', 'existing@example.com', 'password123');
        expect.fail('expected registerUser to throw');
      } catch (err) {
        expect(err.statusCode).to.equal(409);
      }
    });
  });

  describe('loginUser', () => {
    it('returns a token for correct credentials', async () => {
      const passwordHash = await bcrypt.hash('password123', 10);
      sinon.stub(pool, 'execute').resolves([[{ id: 1, name: 'Test User', email: 'test@example.com', password_hash: passwordHash }]]);

      const result = await authService.loginUser('test@example.com', 'password123');
      expect(result).to.have.property('token');
    });

    it('throws a 401 for a non-existent email', async () => {
      sinon.stub(pool, 'execute').resolves([[]]);
      try {
        await authService.loginUser('nobody@example.com', 'password123');
        expect.fail('expected loginUser to throw');
      } catch (err) {
        expect(err.statusCode).to.equal(401);
      }
    });

    it('throws a 401 for a wrong password', async () => {
      const passwordHash = await bcrypt.hash('correct-password', 10);
      sinon.stub(pool, 'execute').resolves([[{ id: 1, email: 'test@example.com', password_hash: passwordHash }]]);

      try {
        await authService.loginUser('test@example.com', 'wrong-password');
        expect.fail('expected loginUser to throw');
      } catch (err) {
        expect(err.statusCode).to.equal(401);
      }
    });
  });
});

describe('Auth API (integration)', () => {
  it('POST /api/auth/signup creates a user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Integration Test', email: 'integration@example.com', password: 'password123' });

    expect(res.status).to.equal(201);
    expect(res.body.data).to.have.property('token');
  });

  it('POST /api/auth/signup returns 400 if fields are missing', async () => {
    const res = await request(app).post('/api/auth/signup').send({ email: 'incomplete@example.com' });
    expect(res.status).to.equal(400);
  });

  it('POST /api/auth/signup returns 409 for a duplicate email', async () => {
    await request(app).post('/api/auth/signup').send({ name: 'First', email: 'dupe@example.com', password: 'password123' });
    const res = await request(app).post('/api/auth/signup').send({ name: 'Second', email: 'dupe@example.com', password: 'password123' });
    expect(res.status).to.equal(409);
  });

  it('POST /api/auth/login returns a token for correct credentials', async () => {
    await request(app).post('/api/auth/signup').send({ name: 'Login Test', email: 'login@example.com', password: 'password123' });
    const res = await request(app).post('/api/auth/login').send({ email: 'login@example.com', password: 'password123' });
    expect(res.status).to.equal(200);
    expect(res.body.data).to.have.property('token');
  });

  it('POST /api/auth/login returns 401 for a wrong password', async () => {
    await request(app).post('/api/auth/signup').send({ name: 'Login Test 2', email: 'login2@example.com', password: 'password123' });
    const res = await request(app).post('/api/auth/login').send({ email: 'login2@example.com', password: 'wrong-password' });
    expect(res.status).to.equal(401);
  });
});