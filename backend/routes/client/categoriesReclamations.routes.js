import { Router } from 'express';
import {
  getCategories,
  createCategorie,
  updateCategorie,
  deleteCategorie,
  createType,
  deleteType,
} from '../../controllers/client/categoriesReclamations.js';

const router = Router();

router.get('/',                        getCategories);
router.post('/',                       createCategorie);
router.put('/:id',                     updateCategorie);
router.delete('/:id',                  deleteCategorie);
router.post('/:id/types',              createType);
router.delete('/types/:typeId',        deleteType);

export default router;