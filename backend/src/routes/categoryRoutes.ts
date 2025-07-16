import { Router } from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
} from '../controllers/categoryController';
import { authenticate } from '../middleware/auth.middleware';

const router: Router = Router();

// Rotas públicas
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Rotas privadas (requerem autenticação)
router.post('/', authenticate, createCategory);
router.put('/:id', authenticate, updateCategory);
router.delete('/:id', authenticate, deleteCategory);
router.get('/:id/stats', authenticate, getCategoryStats);

export default router;
