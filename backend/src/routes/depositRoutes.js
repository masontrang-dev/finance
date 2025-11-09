import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  getDeposits,
  getDeposit,
  createDeposit,
  updateDeposit,
  deleteDeposit,
} from '../controllers/depositController.js';
import {
  validateCreateDeposit,
  validateUpdateDeposit,
} from '../validators/depositValidator.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/deposits - Get all deposits
router.get('/', getDeposits);

// GET /api/deposits/:id - Get single deposit
router.get('/:id', getDeposit);

// POST /api/deposits - Create new deposit
router.post('/', validateCreateDeposit, createDeposit);

// PUT /api/deposits/:id - Update deposit
router.put('/:id', validateUpdateDeposit, updateDeposit);

// DELETE /api/deposits/:id - Delete deposit
router.delete('/:id', deleteDeposit);

export default router;
