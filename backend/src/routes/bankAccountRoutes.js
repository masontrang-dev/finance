import express from 'express';
import {
  getBankAccounts,
  getBankAccount,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
} from '../controllers/bankAccountController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  createBankAccountSchema,
  updateBankAccountSchema,
  validate,
} from '../validators/bankAccountValidator.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/bank-accounts - Get all bank accounts
router.get('/', getBankAccounts);

// GET /api/bank-accounts/:id - Get single bank account
router.get('/:id', getBankAccount);

// POST /api/bank-accounts - Create new bank account
router.post('/', validate(createBankAccountSchema), createBankAccount);

// PUT /api/bank-accounts/:id - Update bank account
router.put('/:id', validate(updateBankAccountSchema), updateBankAccount);

// DELETE /api/bank-accounts/:id - Delete bank account
router.delete('/:id', deleteBankAccount);

export default router;
