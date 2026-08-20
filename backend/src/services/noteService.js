const pool = require('../config/db');
const withDbErrorHandling = require('../utils/withDbErrorHandling');

async function getNoteById(userId, noteId) {
  return withDbErrorHandling('fetching note', async () => {
    const [notes] = await pool.execute(
      'SELECT * FROM notes WHERE id = ? AND user_id = ?',
      [noteId, userId]
    );

    if (notes.length === 0) {
      const error = new Error('Note not found or unauthorized');
      error.statusCode = 404;
      throw error;
    }

    return notes[0];
  });
}

async function getNotes(userId, search = '') {
  return withDbErrorHandling('fetching notes', async () => {
    let query = 'SELECT * FROM notes WHERE user_id = ?';
    const params = [userId];

    if (search) {
      query += ' AND (title LIKE ? OR content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY updated_at DESC';

    const [notes] = await pool.execute(query, params);
    return notes;
  });
}

async function createNote(userId, { title, content }) {
  return withDbErrorHandling('creating note', async () => {
    const [result] = await pool.execute(
      'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)',
      [userId, title, content || '']
    );

    return getNoteById(userId, result.insertId);
  });
}

async function updateNote(userId, noteId, { title, content }) {
  return withDbErrorHandling('updating note', async () => {
    await getNoteById(userId, noteId); // 404 if missing

    await pool.execute(
      'UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?',
      [title, content || '', noteId, userId]
    );

    return getNoteById(userId, noteId);
  });
}

async function deleteNote(userId, noteId) {
  return withDbErrorHandling('deleting note', async () => {
    const [result] = await pool.execute(
      'DELETE FROM notes WHERE id = ? AND user_id = ?',
      [noteId, userId]
    );

    if (result.affectedRows === 0) {
      const error = new Error('Note not found or unauthorized');
      error.statusCode = 404;
      throw error;
    }
  });
}

module.exports = {getNotes, getNoteById, createNote, updateNote, deleteNote};