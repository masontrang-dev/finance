import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.js';

/**
 * Middleware to verify JWT token and authenticate requests
 */
export const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required. Please provide a valid token.' },
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, authConfig.jwtSecret);

    // Attach user info to request object
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid token. Please log in again.' },
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: { message: 'Token expired. Please log in again.' },
      });
    }

    return res.status(500).json({
      success: false,
      error: { message: 'Authentication failed' },
    });
  }
};

/**
 * Optional authentication middleware - doesn't fail if no token provided
 * Useful for endpoints that work differently for authenticated vs. non-authenticated users
 */
export const optionalAuthenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, authConfig.jwtSecret);
      req.user = decoded;
    }

    next();
  } catch (error) {
    // Silently fail - user is just not authenticated
    next();
  }
};
