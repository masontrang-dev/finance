import express from 'express';
import { register, login, getProfile, logout } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateRequest, registerSchema, loginSchema } from '../validators/authValidator.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRequest(registerSchema), register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get JWT token
 * @access  Public
 */
router.post('/login', validateRequest(loginSchema), login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, getProfile);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout', authenticate, logout);

export default router;
