import { Router } from 'express';
import {
  getFactures, getFactureById, createFacture,
  updateStatutFacture, downloadPDF, envoyerFacture, searchClients,
} from '../../controllers/crm/factures.controller.js';
import { authCRM } from '../../middleware/authCRM.middleware.js';
import { checkPermission } from '../../middleware/checkPermission.middleware.js';

const router = Router();

router.get('/search-clients',  authCRM, checkPermission('factures', 'read'),   searchClients);
router.get('/',                authCRM, checkPermission('factures', 'read'),   getFactures);
router.get('/:id',             authCRM, checkPermission('factures', 'read'),   getFactureById);
router.post('/',               authCRM, checkPermission('factures', 'create'), createFacture);
router.put('/:id/statut',      authCRM, checkPermission('factures', 'update'), updateStatutFacture);
router.get('/:id/pdf',         authCRM, checkPermission('factures', 'read'),   downloadPDF);
router.post('/:id/envoyer',    authCRM, checkPermission('factures', 'update'), envoyerFacture);

export default router;