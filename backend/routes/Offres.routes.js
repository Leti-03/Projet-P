import { Router } from 'express';
import { getOffres, createOffre, getOffresPourClient } from '../controllers/offres.controller.js';

const router = Router();

// Route pour l'affichage et la création
router.get('/', getOffres);
router.post('/', createOffre);
router.get('/client/:clientId', getOffresPourClient);

export default router;