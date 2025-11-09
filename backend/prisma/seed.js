import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
    },
  });

  console.log('✅ Created test user:', user.email);

  // Create sample credit cards
  const creditCard1 = await prisma.creditCard.create({
    data: {
      userId: user.id,
      name: 'Chase Sapphire',
      currentBalance: 1200.50,
      totalBalance: 2500.00,
      dueDate: new Date('2024-12-15'),
    },
  });

  const creditCard2 = await prisma.creditCard.create({
    data: {
      userId: user.id,
      name: 'American Express Gold',
      currentBalance: 850.00,
      totalBalance: 1500.00,
      dueDate: new Date('2024-12-20'),
    },
  });

  console.log('✅ Created credit cards');

  // Create sample payments
  await prisma.payment.create({
    data: {
      creditCardId: creditCard1.id,
      amount: 500.00,
      paymentDate: new Date('2024-11-01'),
      notes: 'Monthly payment',
    },
  });

  console.log('✅ Created sample payments');

  // Create sample bank accounts
  await prisma.bankAccount.createMany({
    data: [
      {
        userId: user.id,
        name: 'Chase Checking',
        currentBalance: 5000.00,
      },
      {
        userId: user.id,
        name: 'Ally Savings',
        currentBalance: 15000.00,
      },
    ],
  });

  console.log('✅ Created bank accounts');

  // Create sample deposits
  await prisma.deposit.createMany({
    data: [
      {
        userId: user.id,
        amount: 3000.00,
        depositDate: new Date('2024-12-01'),
        description: 'Salary',
      },
      {
        userId: user.id,
        amount: 500.00,
        depositDate: new Date('2024-12-15'),
        description: 'Bonus',
      },
    ],
  });

  console.log('✅ Created deposits');

  // Create sample portfolios
  const portfolio1 = await prisma.portfolio.create({
    data: {
      userId: user.id,
      name: 'Fidelity 401k',
    },
  });

  const portfolio2 = await prisma.portfolio.create({
    data: {
      userId: user.id,
      name: 'Robinhood',
    },
  });

  console.log('✅ Created portfolios');

  // Create sample portfolio snapshots
  const today = new Date();
  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    return date;
  }).filter(date => {
    // Only include weekdays
    const day = date.getDay();
    return day !== 0 && day !== 6;
  });

  for (const date of dates) {
    await prisma.portfolioSnapshot.create({
      data: {
        portfolioId: portfolio1.id,
        balance: 50000 + Math.random() * 5000,
        snapshotDate: date,
      },
    });

    await prisma.portfolioSnapshot.create({
      data: {
        portfolioId: portfolio2.id,
        balance: 10000 + Math.random() * 1000,
        snapshotDate: date,
      },
    });
  }

  console.log('✅ Created portfolio snapshots');

  // Create sample net worth snapshots
  await prisma.netWorthSnapshot.createMany({
    data: [
      {
        userId: user.id,
        totalAssets: 70000.00,
        totalDebts: 4000.00,
        netWorth: 66000.00,
        snapshotDate: new Date('2024-01-01'),
      },
      {
        userId: user.id,
        totalAssets: 72000.00,
        totalDebts: 3500.00,
        netWorth: 68500.00,
        snapshotDate: new Date('2024-06-01'),
      },
      {
        userId: user.id,
        totalAssets: 75000.00,
        totalDebts: 4000.00,
        netWorth: 71000.00,
        snapshotDate: new Date('2024-11-01'),
      },
    ],
  });

  console.log('✅ Created net worth snapshots');

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
