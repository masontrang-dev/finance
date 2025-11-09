import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import creditCardRoutes from './routes/creditCardRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import bankAccountRoutes from './routes/bankAccountRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Finance Tracker API is running' });
});

// API routes
app.get('/api', (req, res) => {
  res.json({ message: 'Finance Tracker API v1' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Credit card routes
app.use('/api/credit-cards', creditCardRoutes);

// Payment routes
app.use('/api', paymentRoutes);

// Bank account routes
app.use('/api/bank-accounts', bankAccountRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: { message: 'Route not found' } });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
});

export default app;
