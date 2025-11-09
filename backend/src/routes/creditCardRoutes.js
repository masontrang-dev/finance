import express from 'express';
import {
  getCreditCards,
  getCreditCard,
  createCreditCard,
  updateCreditCard,
  deleteCreditCard,
} from '../controllers/creditCardController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  validate,
  createCreditCardSchema,
  updateCreditCardSchema,
} from '../validators/creditCardValidator.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/credit-cards - Get all credit cards
router.get('/', getCreditCards);

// GET /api/credit-cards/:id - Get a single credit card
router.get('/:id', getCreditCard);

// POST /api/credit-cards - Create a new credit card
router.post('/', validate(createCreditCardSchema), createCreditCard);

// PUT /api/credit-cards/:id - Update a credit card
router.put('/:id', validate(updateCreditCardSchema), updateCreditCard);

// DELETE /api/credit-cards/:id - Delete a credit card
router.delete('/:id', deleteCreditCard);

export default router;
