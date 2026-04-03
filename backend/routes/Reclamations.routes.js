import { Router } from 'express';
import { getReclamations, getReclamationById, createReclamation, updateReclamation, deleteReclamation } from '../controllers/client/reclamations.controller.js';

const router = Router();

router.get('/',       getReclamations);
router.get('/:id',    getReclamationById);
router.post('/',      createReclamation);
router.put('/:id',    updateReclamation);
router.delete('/:id', deleteReclamation);

export default router;