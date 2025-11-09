# Finance Tracker - Backend API

Node.js/Express backend API for the Personal Finance Tracker application.

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT + bcrypt
- **Validation:** Joi

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and update the `DATABASE_URL` with your PostgreSQL credentials.

### 3. Set Up Database

See detailed instructions in [`prisma/README.md`](./prisma/README.md)

Quick setup:
```bash
# Generate Prisma Client
npm run db:generate

# Run migrations (creates tables)
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## Available Scripts

### Development
- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server

### Database
- `npm run db:migrate` - Create and apply migrations
- `npm run db:generate` - Generate Prisma Client
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio GUI
- `npm run db:reset` - Reset database (⚠️ deletes all data)

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

### Testing
- `npm test` - Run tests with coverage
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.js            # Seed data
│   └── README.md          # Database setup guide
├── src/
│   ├── config/
│   │   └── database.js    # Prisma client
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   └── server.js          # Entry point
├── .env.example           # Environment template
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Credit Cards
- `GET /api/credit-cards` - Get all credit cards
- `POST /api/credit-cards` - Create credit card
- `PUT /api/credit-cards/:id` - Update credit card
- `DELETE /api/credit-cards/:id` - Delete credit card

### Payments
- `GET /api/credit-cards/:id/payments` - Get payment history
- `POST /api/credit-cards/:id/payments` - Record payment

### Bank Accounts
- `GET /api/bank-accounts` - Get all bank accounts
- `POST /api/bank-accounts` - Create bank account
- `PUT /api/bank-accounts/:id` - Update bank account
- `DELETE /api/bank-accounts/:id` - Delete bank account

### Deposits
- `GET /api/deposits` - Get all deposits
- `POST /api/deposits` - Create deposit
- `DELETE /api/deposits/:id` - Delete deposit

### Portfolios
- `GET /api/portfolios` - Get all portfolios
- `POST /api/portfolios` - Create portfolio
- `PUT /api/portfolios/:id` - Update portfolio
- `DELETE /api/portfolios/:id` - Delete portfolio

### Portfolio Snapshots
- `GET /api/portfolios/:id/snapshots` - Get snapshots
- `POST /api/portfolios/:id/snapshots` - Create snapshot

### Cashflow
- `GET /api/cashflow/summary` - Get cashflow summary

### Net Worth
- `GET /api/net-worth/current` - Get current net worth
- `GET /api/net-worth/snapshots` - Get net worth history
- `POST /api/net-worth/snapshots` - Create snapshot

## Environment Variables

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/finance_tracker
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:5173
```

## Database Schema

See [`prisma/schema.prisma`](./prisma/schema.prisma) for the complete schema.

### Main Models
- **User** - User accounts
- **CreditCard** - Credit card information
- **Payment** - Payment history
- **BankAccount** - Bank accounts
- **Deposit** - Future deposits
- **Portfolio** - Investment portfolios
- **PortfolioSnapshot** - Daily balances
- **NetWorthSnapshot** - Net worth history

## Development

### Code Style
- ES Modules (import/export)
- ESLint + Prettier for formatting
- Async/await for asynchronous operations

### Error Handling
All routes should use try-catch blocks and return appropriate HTTP status codes.

### Authentication
Protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Testing

Tests will be added in Story 6.1 using Jest and Supertest.

## Deployment

See Story 6.3 for production deployment instructions.

## Learn More

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
