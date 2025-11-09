# Database Setup Guide

This directory contains the Prisma schema and database configuration for the Finance Tracker application.

## Prerequisites

- PostgreSQL installed and running
- Node.js and npm installed

## Setup Instructions

### 1. Install PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

### 2. Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE finance_tracker;

# Create user (optional)
CREATE USER finance_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE finance_tracker TO finance_user;

# Exit psql
\q
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` in the backend directory:

```bash
cp .env.example .env
```

Update the `DATABASE_URL` in `.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/finance_tracker?schema=public"
```

Replace:
- `username` with your PostgreSQL username (default: `postgres`)
- `password` with your PostgreSQL password
- `localhost:5432` with your PostgreSQL host and port if different

### 4. Generate Prisma Client

```bash
npm run db:generate
```

### 5. Run Migrations

```bash
npm run db:migrate
```

This will:
- Create all database tables
- Apply the schema to your database
- Automatically run the seed script

### 6. Seed Database (Optional)

If you want to re-seed the database:

```bash
npm run db:seed
```

This creates:
- Test user: `test@example.com` / `password123`
- Sample credit cards
- Sample bank accounts
- Sample portfolios with historical data
- Sample net worth snapshots

## Available Scripts

- `npm run db:migrate` - Create and apply new migrations
- `npm run db:generate` - Generate Prisma Client
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio (GUI for database)
- `npm run db:reset` - Reset database (⚠️ deletes all data)

## Database Schema

### Tables

- **users** - User accounts
- **credit_cards** - Credit card information
- **payments** - Credit card payment history
- **bank_accounts** - Bank account information
- **deposits** - Future deposit tracking
- **portfolios** - Investment portfolio accounts
- **portfolio_snapshots** - Daily portfolio balance snapshots
- **net_worth_snapshots** - Periodic net worth snapshots

### Relationships

- Users have many: credit cards, bank accounts, portfolios, deposits, net worth snapshots
- Credit cards have many: payments
- Portfolios have many: portfolio snapshots

## Prisma Studio

To view and edit your database with a GUI:

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:5555`

## Troubleshooting

### Connection Issues

If you get connection errors:

1. Ensure PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Check your DATABASE_URL in `.env`

3. Verify PostgreSQL is listening on the correct port:
   ```bash
   psql -U postgres -c "SHOW port;"
   ```

### Migration Issues

If migrations fail:

1. Reset the database:
   ```bash
   npm run db:reset
   ```

2. Or manually drop and recreate:
   ```bash
   psql postgres
   DROP DATABASE finance_tracker;
   CREATE DATABASE finance_tracker;
   \q
   npm run db:migrate
   ```

### Permission Issues

If you get permission errors:

```bash
# Grant all privileges
psql postgres
GRANT ALL PRIVILEGES ON DATABASE finance_tracker TO your_username;
\q
```

## Production Deployment

For production:

1. Use a managed PostgreSQL service (AWS RDS, Heroku Postgres, etc.)
2. Update DATABASE_URL with production credentials
3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```
4. Do NOT run the seed script in production

## Learn More

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
