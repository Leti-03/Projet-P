// src/services/crm/users.js
import api from './api.js';

export const getUsers = async () => {
  const res = await api.get('/users');
  return res.data;
};

export const getUserById = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const createUser = async (data) => {
  const res = await api.post('/users', data);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await api.put(`/users/${id}`, data);
  return res.data;
};

export const toggleUserStatut = async (id, statut) => {
  const res = await api.put(`/users/${id}/statut`, { statut });
  return res.data;
};

// ← Fonction manquante qui causait le bug
export const assignRole = async (id, role_id) => {
  const res = await api.put(`/users/${id}/role`, { role_id });
  return res.data;
};

export const resetUserPassword = async (id) => {
  const res = await api.post(`/users/${id}/reset-password`);
  return res.data;
};