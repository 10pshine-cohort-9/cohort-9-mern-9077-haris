const { expect } = require('chai');
const sinon = require('sinon');
const request = require('supertest');

const pool = require('../src/config/db');
const noteService = require('../src/services/noteService');
const app = require('../src/app');

describe('Note Service (unit)', () => {
  afterEach(() => sinon.restore());

  describe('getNoteById', () => {
    it('returns the note when it belongs to the user', async () => {
      sinon.stub(pool, 'execute').resolves([[{ id: 1, user_id: 5, title: 'Test', content: 'Body' }]]);
      const note = await noteService.getNoteById(5, 1);
      expect(note.title).to.equal('Test');
    });

    it('throws a 404 when the note does not exist or belongs to someone else', async () => {
      sinon.stub(pool, 'execute').resolves([[]]);
      try {
        await noteService.getNoteById(5, 999);
        expect.fail('expected getNoteById to throw');
      } catch (err) {
        expect(err.statusCode).to.equal(404);
      }
    });
  });

  describe('createNote', () => {
    it('inserts a note and returns it', async () => {
      sinon.stub(pool, 'execute')
        .onFirstCall().resolves([{ insertId: 10 }])
        .onSecondCall().resolves([[{ id: 10, user_id: 5, title: 'New Note', content: 'Hello' }]]);

      const note = await noteService.createNote(5, { title: 'New Note', content: 'Hello' });
      expect(note.id).to.equal(10);
    });
  });
});

describe('Notes API (integration)', () => {
  let token;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Notes Tester', email: `notes-${Date.now()}@example.com`, password: 'password123' });
    token = res.body.data.token;
  });

  it('rejects requests with no token', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.status).to.equal(401);
  });

  it('creates and lists a note for the authenticated user', async () => {
    const createRes = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'My note', content: 'Some content' });
    expect(createRes.status).to.equal(201);

    const listRes = await request(app).get('/api/notes').set('Authorization', `Bearer ${token}`);
    expect(listRes.status).to.equal(200);
    expect(listRes.body.data).to.have.lengthOf(1);
  });

  it('rejects a title longer than 200 characters', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'a'.repeat(201), content: 'x' });
    expect(res.status).to.equal(400);
  });

  it('updates a note it owns', async () => {
    const createRes = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Original', content: 'Body' });
    const noteId = createRes.body.data.id;

    const updateRes = await request(app)
      .put(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated', content: 'New body' });
    expect(updateRes.status).to.equal(200);
    expect(updateRes.body.data.title).to.equal('Updated');
  });

  it('deletes a note it owns', async () => {
    const createRes = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'To delete', content: 'Body' });
    const noteId = createRes.body.data.id;

    const deleteRes = await request(app).delete(`/api/notes/${noteId}`).set('Authorization', `Bearer ${token}`);
    expect(deleteRes.status).to.equal(200);
  });

  it("returns 404 when trying to access another user's note", async () => {
    const createRes = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Mine', content: 'Body' });
    const noteId = createRes.body.data.id;

    const otherRes = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Other User', email: `other-${Date.now()}@example.com`, password: 'password123' });
    const otherToken = otherRes.body.data.token;    

    const res = await request(app).get(`/api/notes/${noteId}`).set('Authorization', `Bearer ${otherToken}`);
    expect(res.status).to.equal(404);
  });
});