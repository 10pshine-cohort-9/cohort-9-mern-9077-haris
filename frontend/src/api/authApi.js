import apiClient from './apiClient';

export function signup(data) {
  return apiClient.post('/auth/signup', data).then((res) => res.data.data);
}

export function login(data) {
  return apiClient.post('/auth/login', data).then((res) => res.data.data);
}