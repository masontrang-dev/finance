import prisma from '../config/database.js';

/**
 * Get all credit cards for the authenticated user
 */
export const getCreditCards = async (req, res) => {
  try {
    const creditCards = await prisma.creditCard.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });

    // Calculate future due for each card
    const cardsWithFutureDue = creditCards.map((card) => ({
      ...card,
      futureDue: card.totalBalance - card.currentBalance,
    }));

    res.json({
      success: true,
      data: cardsWithFutureDue,
    });
  } catch (error) {
    console.error('Error fetching credit cards:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch credit cards',
    });
  }
};

/**
 * Get a single credit card by ID
 */
export const getCreditCard = async (req, res) => {
  try {
    const { id } = req.params;

    const creditCard = await prisma.creditCard.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!creditCard) {
      return res.status(404).json({
        success: false,
        message: 'Credit card not found',
      });
    }

    // Calculate future due
    const cardWithFutureDue = {
      ...creditCard,
      futureDue: creditCard.totalBalance - creditCard.currentBalance,
    };

    res.json({
      success: true,
      data: cardWithFutureDue,
    });
  } catch (error) {
    console.error('Error fetching credit card:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch credit card',
    });
  }
};

/**
 * Create a new credit card
 */
export const createCreditCard = async (req, res) => {
  try {
    const { name, currentBalance, totalBalance, dueDate } = req.validatedData;

    const creditCard = await prisma.creditCard.create({
      data: {
        name,
        currentBalance,
        totalBalance,
        dueDate: new Date(dueDate),
        userId: req.user.userId,
      },
    });

    // Calculate future due
    const cardWithFutureDue = {
      ...creditCard,
      futureDue: creditCard.totalBalance - creditCard.currentBalance,
    };

    res.status(201).json({
      success: true,
      message: 'Credit card created successfully',
      data: cardWithFutureDue,
    });
  } catch (error) {
    console.error('Error creating credit card:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create credit card',
    });
  }
};

/**
 * Update a credit card
 */
export const updateCreditCard = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.validatedData;

    // Check if credit card exists and belongs to user
    const existingCard = await prisma.creditCard.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!existingCard) {
      return res.status(404).json({
        success: false,
        message: 'Credit card not found',
      });
    }

    // Convert dueDate to Date if provided
    if (updateData.dueDate) {
      updateData.dueDate = new Date(updateData.dueDate);
    }

    const creditCard = await prisma.creditCard.update({
      where: { id },
      data: updateData,
    });

    // Calculate future due
    const cardWithFutureDue = {
      ...creditCard,
      futureDue: creditCard.totalBalance - creditCard.currentBalance,
    };

    res.json({
      success: true,
      message: 'Credit card updated successfully',
      data: cardWithFutureDue,
    });
  } catch (error) {
    console.error('Error updating credit card:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update credit card',
    });
  }
};

/**
 * Delete a credit card
 */
export const deleteCreditCard = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if credit card exists and belongs to user
    const existingCard = await prisma.creditCard.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!existingCard) {
      return res.status(404).json({
        success: false,
        message: 'Credit card not found',
      });
    }

    await prisma.creditCard.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Credit card deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting credit card:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete credit card',
    });
  }
};
