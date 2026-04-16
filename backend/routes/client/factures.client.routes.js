import { Router } from 'express';
import { getFacturesClient } from '../../controllers/crm/factures.controller.js';

const router = Router();
router.get('/:client_id', getFacturesClient);

export default router;