import prisma from '../config/database.js';

// Get all deposits for the authenticated user
export const getDeposits = async (req, res) => {
  try {
    const deposits = await prisma.deposit.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: {
        depositDate: 'asc', // Sort by date (earliest first)
      },
    });

    res.json(deposits);
  } catch (error) {
    console.error('Error fetching deposits:', error);
    res.status(500).json({ error: 'Failed to fetch deposits' });
  }
};

// Get a single deposit by ID
export const getDeposit = async (req, res) => {
  try {
    const { id } = req.params;

    const deposit = await prisma.deposit.findUnique({
      where: { id },
    });

    if (!deposit) {
      return res.status(404).json({ error: 'Deposit not found' });
    }

    // Verify ownership
    if (deposit.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(deposit);
  } catch (error) {
    console.error('Error fetching deposit:', error);
    res.status(500).json({ error: 'Failed to fetch deposit' });
  }
};

// Create a new deposit
export const createDeposit = async (req, res) => {
  try {
    const { amount, depositDate, description } = req.body;

    const deposit = await prisma.deposit.create({
      data: {
        userId: req.user.userId,
        amount,
        depositDate: new Date(depositDate),
        description: description || null,
      },
    });

    res.status(201).json(deposit);
  } catch (error) {
    console.error('Error creating deposit:', error);
    res.status(500).json({ error: 'Failed to create deposit' });
  }
};

// Update a deposit
export const updateDeposit = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, depositDate, description } = req.body;

    // Check if deposit exists and user owns it
    const existingDeposit = await prisma.deposit.findUnique({
      where: { id },
    });

    if (!existingDeposit) {
      return res.status(404).json({ error: 'Deposit not found' });
    }

    if (existingDeposit.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update deposit
    const deposit = await prisma.deposit.update({
      where: { id },
      data: {
        ...(amount !== undefined && { amount }),
        ...(depositDate !== undefined && { depositDate: new Date(depositDate) }),
        ...(description !== undefined && { description: description || null }),
      },
    });

    res.json(deposit);
  } catch (error) {
    console.error('Error updating deposit:', error);
    res.status(500).json({ error: 'Failed to update deposit' });
  }
};

// Delete a deposit
export const deleteDeposit = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if deposit exists and user owns it
    const existingDeposit = await prisma.deposit.findUnique({
      where: { id },
    });

    if (!existingDeposit) {
      return res.status(404).json({ error: 'Deposit not found' });
    }

    if (existingDeposit.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete deposit
    await prisma.deposit.delete({
      where: { id },
    });

    res.json({ message: 'Deposit deleted successfully' });
  } catch (error) {
    console.error('Error deleting deposit:', error);
    res.status(500).json({ error: 'Failed to delete deposit' });
  }
};
