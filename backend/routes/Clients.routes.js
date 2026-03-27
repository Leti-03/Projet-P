import { Router } from 'express';
import { getClients, getClientById, updateClient, deleteClient, getOffresClient } from '../controllers/clients.controller.js';
import {
  registerClient,
  verifyOTP,
  loginClient,
  updateClientSegment,
  resendOTP   // on va l'ajouter
} from '../controllers/authclients.controller.js';

const router = Router();


// Inscription (Register)
router.post('/register', registerClient);

// Renvoi du code OTP
router.post('/resend-otp', resendOTP);

// Vérification du code OTP
router.post('/verify-otp', verifyOTP);

// Connexion (Login)
router.post('/login', loginClient);

// Mise à jour du profil de segmentation (après vérification)
router.put('/:id/segment', updateClientSegment);



router.get('/',           getClients);
router.get('/:id',        getClientById);
router.put('/:id',        updateClient);
router.delete('/:id',     deleteClient);
router.get('/:id/offres', getOffresClient);

export default router;