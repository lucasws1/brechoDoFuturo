import { Router } from 'express';
import {
  createProductReview,
  getProductReviews,
  getReviewById,
  updateProductReview,
  deleteProductReview,
  getUserReviews,
  getProductReviewStats,
  getAllReviews,
} from '../controllers/productReviewController';
import { authenticate } from '../middleware/auth.middleware';

const router: Router = Router();

// Rotas públicas
router.get('/reviews/:id', getReviewById);
router.get('/products/:productId/reviews', getProductReviews);
router.get('/products/:productId/reviews/stats', getProductReviewStats);

// Rotas privadas (requerem autenticação)
router.post('/products/:productId/reviews', authenticate, createProductReview);
router.put('/reviews/:id', authenticate, updateProductReview);
router.delete('/reviews/:id', authenticate, deleteProductReview);
router.get('/users/:userId/reviews', authenticate, getUserReviews);
router.get('/reviews', authenticate, getAllReviews);

export default router;
