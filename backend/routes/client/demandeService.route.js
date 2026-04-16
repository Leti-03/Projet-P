// backend/routes/demandeService.routes.js
import { Router } from 'express';
import {
  createDemande,
  getDemandes,
  getDemandeById,
  updateStatut
} from '../../controllers/client/demandeService.Controller.js';

const router = Router();

router.post('/',               createDemande);
router.get('/',                getDemandes);
router.get('/:id',             getDemandeById);
router.put('/:id/statut',      updateStatut);

export default router;

