const noteService = require('../services/noteService');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const logger = require('../config/pino');

async function getNotes(req, res, next) {
  try {
    const notes = await noteService.getNotes(req.user.id, req.query.search);
    return sendSuccess(res, 200, notes, 'Notes fetched successfully');
  } catch (error) {
    next(error);
  }
}

async function getNote(req, res, next) {
  try {
    const note = await noteService.getNoteById(req.user.id, req.params.id);
    return sendSuccess(res, 200, note, 'Note fetched successfully');
  } catch (error) {
    next(error);
  }
}

async function createNote(req, res, next) {
  try {
    const { title, content } = req.body;
    if (!title) return sendError(res, 400, 'Title is required');

    const note = await noteService.createNote(req.user.id, { title, content });
    logger.info({ userId: req.user.id, noteId: note.id }, 'Note created');

    return sendSuccess(res, 201, note, 'Note created successfully');
  } catch (error) {
    next(error);
  }
}

async function updateNote(req, res, next) {
  try {
    const { title, content } = req.body;
    if (!title) return sendError(res, 400, 'Title is required');

    const note = await noteService.updateNote(req.user.id, req.params.id, { title, content });
    logger.info({ userId: req.user.id, noteId: note.id }, 'Note updated');

    return sendSuccess(res, 200, note, 'Note updated successfully');
  } catch (error) {
    next(error);
  }
}

async function deleteNote(req, res, next) {
  try {
    await noteService.deleteNote(req.user.id, req.params.id);
    logger.info({ userId: req.user.id, noteId: req.params.id }, 'Note deleted');

    return sendSuccess(res, 200, null, 'Note deleted successfully');
  } catch (error) {
    next(error);
  }
}

module.exports = {getNotes, getNote, createNote, updateNote, deleteNote};