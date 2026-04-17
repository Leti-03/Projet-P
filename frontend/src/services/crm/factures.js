import api from './api.js';

export const getOffres = async () => {
  const { data } = await api.get('/offres');
  return data;
};

export const getFactures = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
  const { data } = await api.get(`/factures?${params}`);
  return data;
};

export const getFactureById = async (id) => {
  const { data } = await api.get(`/factures/${id}`);
  return data;
};

export const searchClients = async (q) => {
  const { data } = await api.get(`/factures/search-clients?q=${encodeURIComponent(q)}`);
  return data;
};

export const createFacture = async (payload) => {
  const { data } = await api.post('/factures', payload);
  return data;
};

export const updateStatutFacture = async (id, statut) => {
  const { data } = await api.put(`/factures/${id}/statut`, { statut });
  return data;
};

export const envoyerFacture = async (id) => {
  const { data } = await api.post(`/factures/${id}/envoyer`);
  return data;
};

export const downloadPDF = async (id, numero) => {
  const token = localStorage.getItem('crm_token');
  const base = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api') + '/crm';
  const response = await fetch(`${base}/factures/${id}/pdf`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Erreur téléchargement PDF');
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `facture-${numero || id}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};