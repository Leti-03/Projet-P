import { Router } from 'express';
import { 
  getClients, getClientById, updateClient, deleteClient, 
  getOffresClient, addClient, updateSegmentation, getClientDetail 
} from '../../controllers/client/clients.controller.js';
import {
  registerClient, verifyOTP, loginClient,
  updateClientSegment, resendOTP, upload, uploadDocument
} from '../../controllers/client/authclients.controller.js';

const router = Router();

// Auth
router.post('/register', registerClient);
router.post('/upload-document', upload.single('document'), uploadDocument);
router.post('/resend-otp', resendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginClient);

// ✅ Routes spécifiques EN PREMIER (avant /:id)
router.get('/:id/detail', getClientDetail);
router.get('/:id/offres', getOffresClient);
router.put('/:id/segment', updateClientSegment);

// Routes génériques APRÈS
router.get('/',        getClients);
router.get('/:id',     getClientById);
router.post('/',       addClient);
router.put('/:id',     updateClient);
router.delete('/:id',  deleteClient);

export default router;