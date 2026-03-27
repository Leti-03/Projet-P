import { Router } from 'express';
import {
  assignerAuto,
  assignerManuel,
  getSuggestions,
  getChargeTechniciens,
} from '../controllers/assignation.controller.js';

const router = Router();

// POST /api/assignation/auto
// Body: { reclamation_id }
// → Trouve le meilleur technicien automatiquement et assigne
router.post('/auto', assignerAuto);

// POST /api/assignation/manuel
// Body: { reclamation_id, technicien_id, priorite?, date_planifiee?, notes? }
// → Assignation manuelle avec le technicien choisi
router.post('/manuel', assignerManuel);

// GET /api/assignation/suggestions/:reclamation_id
// → Retourne les 5 meilleurs techniciens sans assigner (pour afficher les suggestions)
router.get('/suggestions/:reclamation_id', getSuggestions);

// GET /api/assignation/charge
// → Tableau de bord de charge de tous les techniciens
router.get('/charge', getChargeTechniciens);

export default router;