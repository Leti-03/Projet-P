import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // if (err.response?.status === 401) {
    //   localStorage.removeItem('token');
    //   localStorage.removeItem('user');
    //   window.location.href = '/login';
    // }
    return Promise.reject(err);
  }
);





export const clientsAPI = {
  getAll:    (params)   => api.get('/clients', { params }),
  getById:   (id)       => api.get(`/clients/${id}`),
  update:    (id, data) => api.put(`/clients/${id}`, data),
  delete:    (id)       => api.delete(`/clients/${id}`),
  
};



export const reclamationsAPI = {
  getAll:  (params)   => api.get('/reclamations', { params }),
  getById: (id)       => api.get(`/reclamations/${id}`),
  create:  (data)     => api.post('/reclamations', data),
  update:  (id, data) => api.put(`/reclamations/${id}`, data),
  delete:  (id)       => api.delete(`/reclamations/${id}`),
};



export const performancesAPI = {
  agents:     ()   => api.get('/performances/agents'),
  techniciens: ()  => api.get('/performances/techniciens'),
  technicien: (id) => api.get(`/performances/techniciens/${id}`),
};

// Intercepteur pour ajouter le token JWT à chaque requête automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;