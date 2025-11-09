# Personal Finance Tracker

A comprehensive personal finance application for tracking credit card payments, bank account balances, investment portfolios, and net worth over time.

## 🚀 Features

- **Monthly Cashflow Tracker**: Manage credit cards, bank accounts, and track payment obligations
- **Portfolio Tracker**: Monitor investment portfolios with daily balance snapshots
- **Annual Net Worth Report**: Calculate and visualize net worth over time
- **Manual Data Entry**: Full control over your financial data with no external API dependencies

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **pnpm**
- **PostgreSQL** (v14 or higher)
- **Git**

## 🛠️ Technology Stack

### Frontend
- Vue 3 (Composition API)
- Pinia (State Management)
- Vue Router
- TailwindCSS
- Chart.js
- Vite

### Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Joi Validation

## 📦 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd finance
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env file with your configuration
# Update DATABASE_URL, JWT_SECRET, etc.
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env file if needed
```

### 4. Database Setup

```bash
cd backend

# This will be completed in Story 1.2
# Create database
# Run Prisma migrations
# Seed initial data (optional)
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
The backend API will run on `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

### Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📁 Project Structure

```
finance/
├── docs/                       # Documentation
│   ├── ARCHITECTURE.md         # System architecture
│   ├── IMPLEMENTATION_PLAN.md  # User stories and timeline
│   └── TECHNICAL_STANDARDS.md  # Code quality guidelines
├── frontend/                   # Vue.js frontend
│   ├── src/
│   │   ├── assets/            # Static assets
│   │   ├── components/        # Vue components
│   │   ├── router/            # Vue Router config
│   │   ├── services/          # API services
│   │   ├── stores/            # Pinia stores
│   │   ├── utils/             # Utility functions
│   │   ├── views/             # Page components
│   │   ├── App.vue
│   │   └── main.js
│   ├── package.json
│   └── vite.config.js
├── backend/                    # Express.js backend
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Custom middleware
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Helper functions
│   │   ├── validators/        # Input validation
│   │   └── server.js          # Entry point
│   ├── prisma/                # Prisma schema
│   └── package.json
└── README.md
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                # Run all tests
npm run test:watch      # Watch mode
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🎨 Code Quality

### Linting
```bash
# Frontend
cd frontend
npm run lint

# Backend
cd backend
npm run lint
```

### Formatting
```bash
# Frontend
cd frontend
npm run format

# Backend
cd backend
npm run format
```

## 📚 Documentation

- **[Architecture](docs/ARCHITECTURE.md)**: System design and technical stack
- **[Implementation Plan](docs/IMPLEMENTATION_PLAN.md)**: User stories and development timeline
- **[Technical Standards](docs/TECHNICAL_STANDARDS.md)**: Code quality and best practices

## 🔐 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/finance_tracker
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 🚧 Development Workflow

1. **Create a feature branch**: `git checkout -b feature/feature-name`
2. **Make changes**: Follow the [Technical Standards](docs/TECHNICAL_STANDARDS.md)
3. **Test your changes**: Run tests and linting
4. **Commit**: Use conventional commit messages
5. **Push and create PR**: Request review

## 📝 API Documentation

API documentation will be available at:
- Development: `http://localhost:3000/api-docs`
- Production: TBD

## 🤝 Contributing

1. Follow the coding standards in [TECHNICAL_STANDARDS.md](docs/TECHNICAL_STANDARDS.md)
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PR

## 📄 License

MIT

## 🗓️ Development Status

**Current Phase**: Epic 1 - Project Setup & Infrastructure

- [x] Story 1.1: Initialize Project Structure
- [ ] Story 1.2: Database Setup
- [ ] Story 1.3: Authentication System

See [IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) for full roadmap.

## 💡 Notes

- This application uses **manual data entry** - no automatic bank/brokerage API integration
- All financial data is stored locally in your PostgreSQL database
- Designed for personal use with focus on privacy and control

## 🆘 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 3000 (backend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

**Database connection errors:**
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists

**Module not found errors:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📧 Support

For questions or issues, please refer to the documentation or create an issue in the repository.

---

**Happy Tracking! 💰📊**
