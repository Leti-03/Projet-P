import { Router } from 'express';
import { authCRM } from '../../middleware/authCRM.middleware.js';
import {
  getKpis,
  getEvolutionMensuelle,
  getRepartitionReclamations,
  getDernieresActivites,
  getAlertes,
  getPerformancesAgents,
} from '../../controllers/crm/stats.controller.js';

const router = Router();

router.use(authCRM);

router.get('/kpis',                  getKpis);
router.get('/evolution',             getEvolutionMensuelle);
router.get('/reclamations/repartition', getRepartitionReclamations);
router.get('/activites',             getDernieresActivites);
router.get('/alertes',               getAlertes);
router.get('/performances/agents',   getPerformancesAgents);

export default router;