# Personal Finance Tracker - Architecture

## Overview
A comprehensive personal finance application for tracking credit card payments, bank account balances, investment portfolios, and net worth over time.

## Technology Stack

### Frontend
- **Framework**: Vue 3 (Composition API)
- **State Management**: Pinia
- **Routing**: Vue Router
- **UI Framework**: TailwindCSS + shadcn-vue (or similar)
- **Charts**: Chart.js or D3.js
- **HTTP Client**: Axios
- **Date Handling**: date-fns or Day.js

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (for relational data with time-series capabilities)
- **ORM**: Prisma or Sequelize
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi or Zod
- **API Documentation**: Swagger/OpenAPI

### DevOps & Tools
- **Package Manager**: npm or pnpm
- **Build Tool**: Vite
- **Linting**: ESLint
- **Formatting**: Prettier
- **Version Control**: Git

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Vue 3)                      │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Cashflow   │  │  Portfolio   │  │    Annual    │      │
│  │   Tracker    │  │   Tracker    │  │    Report    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Pinia Store (State)                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                    REST API (HTTPS)
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Node.js/Express)                 │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     Auth     │  │   Cashflow   │  │  Portfolio   │      │
│  │  Controller  │  │  Controller  │  │  Controller  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Business Logic Layer                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Data Access Layer (ORM)                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Database (PostgreSQL)                     │
├─────────────────────────────────────────────────────────────┤
│  • Users                    • Portfolios                     │
│  • Credit Cards             • Portfolio Snapshots            │
│  • Credit Card Payments     • Bank Accounts                  │
│  • Bank Account Deposits    • Net Worth Snapshots            │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

### Core Tables

#### Users
```sql
- id (PK)
- email (unique)
- password_hash
- name
- created_at
- updated_at
```

#### Credit Cards
```sql
- id (PK)
- user_id (FK)
- name
- current_balance
- total_balance
- due_date
- created_at
- updated_at
```

#### Credit Card Payments
```sql
- id (PK)
- credit_card_id (FK)
- amount
- payment_date
- notes
- created_at
```

#### Bank Accounts
```sql
- id (PK)
- user_id (FK)
- name
- current_balance
- created_at
- updated_at
```

#### Bank Account Deposits
```sql
- id (PK)
- bank_account_id (FK)
- amount
- deposit_date
- description
- created_at
```

#### Portfolios
```sql
- id (PK)
- user_id (FK)
- name
- created_at
- updated_at
```

#### Portfolio Snapshots
```sql
- id (PK)
- portfolio_id (FK)
- balance
- snapshot_date
- created_at
```

#### Net Worth Snapshots
```sql
- id (PK)
- user_id (FK)
- total_assets
- total_debts
- net_worth
- snapshot_date
- created_at
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Credit Cards
- `GET /api/credit-cards` - Get all credit cards
- `POST /api/credit-cards` - Create credit card
- `PUT /api/credit-cards/:id` - Update credit card
- `DELETE /api/credit-cards/:id` - Delete credit card
- `POST /api/credit-cards/:id/payments` - Record payment
- `GET /api/credit-cards/:id/payments` - Get payment history

### Bank Accounts
- `GET /api/bank-accounts` - Get all bank accounts
- `POST /api/bank-accounts` - Create bank account
- `PUT /api/bank-accounts/:id` - Update bank account
- `DELETE /api/bank-accounts/:id` - Delete bank account
- `POST /api/bank-accounts/:id/deposits` - Record deposit
- `GET /api/bank-accounts/:id/deposits` - Get deposit history

### Portfolios
- `GET /api/portfolios` - Get all portfolios
- `POST /api/portfolios` - Create portfolio
- `PUT /api/portfolios/:id` - Update portfolio
- `DELETE /api/portfolios/:id` - Delete portfolio
- `POST /api/portfolios/:id/snapshots` - Record balance snapshot
- `GET /api/portfolios/:id/snapshots` - Get snapshot history

### Reports
- `GET /api/reports/cashflow?month=YYYY-MM` - Get monthly cashflow
- `GET /api/reports/net-worth?year=YYYY` - Get annual net worth
- `POST /api/reports/net-worth/snapshot` - Create net worth snapshot

## Frontend Structure

```
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.vue
│   │   │   ├── Card.vue
│   │   │   ├── Input.vue
│   │   │   └── Modal.vue
│   │   ├── cashflow/
│   │   │   ├── CreditCardList.vue
│   │   │   ├── CreditCardForm.vue
│   │   │   ├── BankAccountList.vue
│   │   │   ├── BankAccountForm.vue
│   │   │   └── CashflowSummary.vue
│   │   ├── portfolio/
│   │   │   ├── PortfolioList.vue
│   │   │   ├── PortfolioForm.vue
│   │   │   ├── PortfolioChart.vue
│   │   │   └── SnapshotForm.vue
│   │   └── reports/
│   │       ├── NetWorthChart.vue
│   │       ├── NetWorthTable.vue
│   │       └── AnnualSummary.vue
│   ├── views/
│   │   ├── Login.vue
│   │   ├── Register.vue
│   │   ├── Dashboard.vue
│   │   ├── CashflowTracker.vue
│   │   ├── PortfolioTracker.vue
│   │   └── AnnualReport.vue
│   ├── stores/
│   │   ├── auth.js
│   │   ├── creditCards.js
│   │   ├── bankAccounts.js
│   │   ├── portfolios.js
│   │   └── reports.js
│   ├── router/
│   │   └── index.js
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── App.vue
│   └── main.js
├── public/
├── package.json
└── vite.config.js
```

## Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── auth.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── creditCardController.js
│   │   ├── bankAccountController.js
│   │   ├── portfolioController.js
│   │   └── reportController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── CreditCard.js
│   │   ├── BankAccount.js
│   │   ├── Portfolio.js
│   │   └── index.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── creditCards.js
│   │   ├── bankAccounts.js
│   │   ├── portfolios.js
│   │   └── reports.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── services/
│   │   ├── cashflowService.js
│   │   ├── portfolioService.js
│   │   └── reportService.js
│   ├── utils/
│   │   ├── calculations.js
│   │   └── dateHelpers.js
│   └── server.js
├── prisma/
│   └── schema.prisma
├── package.json
└── .env.example
```

## Key Features & Calculations

### Cashflow Tracker
- **Future Due Calculation**: `future_due = total_balance - current_balance`
- **Available Cash**: Sum of all bank account balances + future deposits
- **Total Obligations**: Sum of all credit card current balances
- **Cashflow Health**: Available cash - total obligations

### Portfolio Tracker
- **Daily Balance Tracking**: User manually inputs balance on market open days
- **Performance Metrics**: 
  - Day-over-day change
  - Month-to-date change
  - Year-to-date change
- **Visualization**: Line chart showing balance over time

### Annual Report
- **Net Worth Calculation**: 
  ```
  Total Assets = Sum(all portfolio balances) + Sum(all bank account balances)
  Total Debts = Sum(all credit card total balances)
  Net Worth = Total Assets - Total Debts
  ```
- **Year-over-Year Comparison**: Compare net worth snapshots
- **Asset Allocation**: Breakdown by portfolio and account type

## Security Considerations

1. **Authentication**: JWT-based authentication with refresh tokens
2. **Authorization**: User can only access their own data
3. **Password Security**: bcrypt hashing with salt
4. **Input Validation**: Server-side validation for all inputs
5. **SQL Injection Prevention**: Use ORM parameterized queries
6. **XSS Prevention**: Sanitize user inputs
7. **CORS**: Configure appropriate CORS policies
8. **HTTPS**: Enforce HTTPS in production
9. **Rate Limiting**: Implement rate limiting on API endpoints
10. **Environment Variables**: Store sensitive config in .env files

## Deployment Strategy

### Development
- Frontend: Vite dev server (port 5173)
- Backend: Node.js dev server (port 3000)
- Database: Local PostgreSQL instance

### Production
- Frontend: Static build deployed to Vercel/Netlify
- Backend: Node.js app on Railway/Render/DigitalOcean
- Database: Managed PostgreSQL (Railway/Supabase/AWS RDS)
- CDN: Cloudflare for static assets

## Future Enhancements

1. **Recurring Transactions**: Auto-populate recurring bills and income
2. **Budget Planning**: Set monthly budgets and track spending
3. **Notifications**: Alerts for upcoming due dates
4. **Mobile App**: React Native or PWA
5. **Data Export**: CSV/PDF export functionality
6. **Multi-Currency Support**: Handle multiple currencies
7. **Investment Analytics**: ROI, IRR calculations
8. **Bill Reminders**: Email/SMS notifications
9. **Data Visualization**: More advanced charts and insights
10. **API Integration**: Connect to bank/brokerage APIs
