import express from 'express';
import {
  getPayments,
  createPayment,
  deletePayment,
} from '../controllers/paymentController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateCreatePayment } from '../validators/paymentValidator.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Payment routes for a specific credit card
router.get('/credit-cards/:creditCardId/payments', getPayments);
router.post(
  '/credit-cards/:creditCardId/payments',
  validateCreatePayment,
  createPayment
);

// Delete payment
router.delete('/payments/:id', deletePayment);

export default router;
