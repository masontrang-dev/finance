import prisma from '../config/database.js';

/**
 * Get all bank accounts for the authenticated user
 */
export const getBankAccounts = async (req, res) => {
  try {
    const userId = req.user.userId;

    const bankAccounts = await prisma.bankAccount.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      data: bankAccounts,
    });
  } catch (error) {
    console.error('Error fetching bank accounts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bank accounts',
    });
  }
};

/**
 * Get a single bank account by ID
 */
export const getBankAccount = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const bankAccount = await prisma.bankAccount.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!bankAccount) {
      return res.status(404).json({
        success: false,
        message: 'Bank account not found',
      });
    }

    res.json({
      success: true,
      data: bankAccount,
    });
  } catch (error) {
    console.error('Error fetching bank account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bank account',
    });
  }
};

/**
 * Create a new bank account
 */
export const createBankAccount = async (req, res) => {
  try {
    console.log('req.user:', req.user);
    const userId = req.user.userId;
    console.log('userId:', userId);
    const { name, currentBalance } = req.body;

    const bankAccount = await prisma.bankAccount.create({
      data: {
        userId,
        name,
        currentBalance,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Bank account created successfully',
      data: bankAccount,
    });
  } catch (error) {
    console.error('Error creating bank account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create bank account',
    });
  }
};

/**
 * Update a bank account
 */
export const updateBankAccount = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { name, currentBalance } = req.body;

    // Check if bank account exists and belongs to user
    const existingBankAccount = await prisma.bankAccount.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingBankAccount) {
      return res.status(404).json({
        success: false,
        message: 'Bank account not found',
      });
    }

    // Update bank account
    const bankAccount = await prisma.bankAccount.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(currentBalance !== undefined && { currentBalance }),
      },
    });

    res.json({
      success: true,
      message: 'Bank account updated successfully',
      data: bankAccount,
    });
  } catch (error) {
    console.error('Error updating bank account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update bank account',
    });
  }
};

/**
 * Delete a bank account
 */
export const deleteBankAccount = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    // Check if bank account exists and belongs to user
    const existingBankAccount = await prisma.bankAccount.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingBankAccount) {
      return res.status(404).json({
        success: false,
        message: 'Bank account not found',
      });
    }

    // Delete bank account
    await prisma.bankAccount.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Bank account deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting bank account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete bank account',
    });
  }
};
