import apiClient from './apiClient';

export function getNotes(search = '') {
  return apiClient.get('/notes', { params: search ? { search } : {} }).then((res) => res.data.data);
}

export function getNote(id) {
  return apiClient.get(`/notes/${id}`).then((res) => res.data.data);
}

export function createNote(data) {
  return apiClient.post('/notes', data).then((res) => res.data.data);
}

export function updateNote(id, data) {
  return apiClient.put(`/notes/${id}`, data).then((res) => res.data.data);
}

export function deleteNote(id) {
  return apiClient.delete(`/notes/${id}`).then((res) => res.data.data);
}