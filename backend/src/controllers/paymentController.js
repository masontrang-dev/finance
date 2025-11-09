import prisma from '../config/database.js';

/**
 * Get all payments for a specific credit card
 * GET /api/credit-cards/:creditCardId/payments
 */
export const getPayments = async (req, res) => {
  try {
    const { creditCardId } = req.params;
    const userId = req.user.id;

    // Verify credit card belongs to user
    const creditCard = await prisma.creditCard.findFirst({
      where: {
        id: creditCardId,
        userId,
      },
    });

    if (!creditCard) {
      return res.status(404).json({
        success: false,
        message: 'Credit card not found',
      });
    }

    // Get all payments for this credit card, sorted by date (newest first)
    const payments = await prisma.payment.findMany({
      where: {
        creditCardId,
      },
      orderBy: {
        paymentDate: 'desc',
      },
    });

    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
    });
  }
};

/**
 * Create a new payment for a credit card
 * POST /api/credit-cards/:creditCardId/payments
 */
export const createPayment = async (req, res) => {
  try {
    const { creditCardId } = req.params;
    const userId = req.user.id;
    const { amount, paymentDate, notes } = req.body;

    // Verify credit card belongs to user
    const creditCard = await prisma.creditCard.findFirst({
      where: {
        id: creditCardId,
        userId,
      },
    });

    if (!creditCard) {
      return res.status(404).json({
        success: false,
        message: 'Credit card not found',
      });
    }

    // Validate payment amount doesn't exceed current balance
    if (amount > creditCard.currentBalance) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount cannot exceed current balance',
      });
    }

    // Create payment and update credit card balance in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the payment
      const payment = await tx.payment.create({
        data: {
          amount,
          paymentDate: new Date(paymentDate),
          notes: notes || '',
          creditCardId,
        },
      });

      // Update credit card balance
      const updatedCreditCard = await tx.creditCard.update({
        where: { id: creditCardId },
        data: {
          currentBalance: creditCard.currentBalance - amount,
          totalBalance: creditCard.totalBalance - amount,
        },
      });

      return { payment, updatedCreditCard };
    });

    res.status(201).json({
      success: true,
      data: {
        payment: result.payment,
        creditCard: {
          ...result.updatedCreditCard,
          futureDue:
            result.updatedCreditCard.totalBalance -
            result.updatedCreditCard.currentBalance,
        },
      },
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment',
    });
  }
};

/**
 * Delete a payment
 * DELETE /api/payments/:id
 */
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the payment and verify it belongs to user's credit card
    const payment = await prisma.payment.findFirst({
      where: { id },
      include: {
        creditCard: true,
      },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    if (payment.creditCard.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Delete payment and restore credit card balance in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete the payment
      await tx.payment.delete({
        where: { id },
      });

      // Restore credit card balance
      await tx.creditCard.update({
        where: { id: payment.creditCardId },
        data: {
          currentBalance: payment.creditCard.currentBalance + payment.amount,
          totalBalance: payment.creditCard.totalBalance + payment.amount,
        },
      });
    });

    res.json({
      success: true,
      message: 'Payment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete payment',
    });
  }
};
