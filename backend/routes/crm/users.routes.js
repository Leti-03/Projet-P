import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  toggleStatut,
  assignRole,
  resetPassword,
} from '../../controllers/crm/users.controller.js';
import { authCRM } from '../../middleware/authCRM.middleware.js';
import { checkPermission } from '../../middleware/checkPermission.middleware.js';

const router = express.Router();

router.get('/', authCRM, checkPermission('utilisateurs', 'read'), getAllUsers);

// ✅ Route unique pour /:id avec condition
router.get('/:id', authCRM, (req, res, next) => {
  // Si c'est son propre profil, on passe sans checkPermission
  if (String(req.user.id) === String(req.params.id)) {
    return next();
  }
  // Sinon, on vérifie la permission
  return checkPermission('utilisateurs', 'read')(req, res, next);
}, getUserById);

router.post('/', authCRM, checkPermission('utilisateurs', 'create'), createUser);
router.put('/:id', authCRM, checkPermission('utilisateurs', 'update'), updateUser);
router.put('/:id/statut', authCRM, checkPermission('utilisateurs', 'update'), toggleStatut);
router.put('/:id/role', authCRM, checkPermission('utilisateurs', 'update'), assignRole);
router.post('/:id/reset-password', authCRM, checkPermission('utilisateurs', 'update'), resetPassword);

export default router;