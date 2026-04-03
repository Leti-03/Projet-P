import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const reclamationService = {
  // Récupérer les réclamations ouvertes
  getOpenTickets: (page = 1) => 
    axios.get(`${API_URL}/reclamations?statut=ouvert&page=${page}`),

  // Obtenir les suggestions de techniciens pour un ticket spécifique
  getTechSuggestions: (id) => 
    axios.get(`${API_URL}/assignation/suggestions/${id}`),

  // Assigner manuellement
  assignTechnician: (data) => 
    axios.post(`${API_URL}/assignation/manuel`, data),

  // Assigner automatiquement (via ton algo de score)
  autoAssign: (reclamation_id) => 
    axios.post(`${API_URL}/assignation/auto`, { reclamation_id })
};