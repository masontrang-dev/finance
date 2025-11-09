# Technical Standards & Code Quality Guidelines

## Overview
This document defines the coding standards, best practices, and quality guidelines for the Personal Finance Tracker application.

---

## Table of Contents
1. [Code Style & Formatting](#code-style--formatting)
2. [TypeScript/JavaScript Standards](#typescriptjavascript-standards)
3. [Vue.js Standards](#vuejs-standards)
4. [Node.js/Express Standards](#nodejsexpress-standards)
5. [Database Standards](#database-standards)
6. [API Design Standards](#api-design-standards)
7. [Testing Standards](#testing-standards)
8. [Security Standards](#security-standards)
9. [Git & Version Control](#git--version-control)
10. [Documentation Standards](#documentation-standards)
11. [Performance Standards](#performance-standards)
12. [Error Handling](#error-handling)

---

## Code Style & Formatting

### General Rules
- **Line Length**: Maximum 100 characters per line
- **Indentation**: 2 spaces (no tabs)
- **Quotes**: Single quotes for strings (except JSON)
- **Semicolons**: Always use semicolons
- **Trailing Commas**: Use trailing commas in multi-line objects/arrays

### Tools
```json
{
  "eslint": "^8.x",
  "prettier": "^3.x",
  "eslint-config-prettier": "^9.x",
  "eslint-plugin-vue": "^9.x"
}
```

### ESLint Configuration
```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/multi-word-component-names': 'error',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
  },
};
```

### Prettier Configuration
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

---

## TypeScript/JavaScript Standards

### Naming Conventions
- **Variables/Functions**: camelCase
  ```javascript
  const userName = 'John';
  function calculateNetWorth() {}
  ```

- **Classes/Components**: PascalCase
  ```javascript
  class UserService {}
  // CreditCardForm.vue
  ```

- **Constants**: UPPER_SNAKE_CASE
  ```javascript
  const MAX_RETRY_ATTEMPTS = 3;
  const API_BASE_URL = 'https://api.example.com';
  ```

- **Private Properties**: Prefix with underscore
  ```javascript
  class Service {
    _privateMethod() {}
  }
  ```

### Variable Declarations
- Use `const` by default
- Use `let` only when reassignment is needed
- Never use `var`

```javascript
// Good
const userId = 123;
let counter = 0;

// Bad
var userId = 123;
```

### Functions
- Prefer arrow functions for callbacks
- Use descriptive function names
- Keep functions small and focused (< 50 lines)
- Maximum 3-4 parameters (use object destructuring for more)

```javascript
// Good
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// Good - object destructuring
const createUser = ({ name, email, password }) => {
  // ...
};

// Bad - too many parameters
const createUser = (name, email, password, age, address, phone) => {
  // ...
};
```

### Async/Await
- Prefer async/await over raw promises
- Always handle errors with try/catch

```javascript
// Good
async function fetchUserData(userId) {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch user data', error);
    throw new AppError('User data unavailable', 500);
  }
}

// Bad
function fetchUserData(userId) {
  return api.get(`/users/${userId}`)
    .then(response => response.data)
    .catch(error => console.log(error));
}
```

### Object/Array Manipulation
- Use spread operator for copying
- Use destructuring for extracting values
- Use array methods (map, filter, reduce) over loops

```javascript
// Good
const newUser = { ...user, isActive: true };
const { name, email } = user;
const activeUsers = users.filter((u) => u.isActive);

// Bad
const newUser = Object.assign({}, user, { isActive: true });
const name = user.name;
const activeUsers = [];
for (let i = 0; i < users.length; i++) {
  if (users[i].isActive) activeUsers.push(users[i]);
}
```

---

## Vue.js Standards

### Component Structure
Follow this order in Single File Components:

```vue
<script setup>
// 1. Imports
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// 2. Props
const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
});

// 3. Emits
const emit = defineEmits(['update', 'delete']);

// 4. Composables
const router = useRouter();

// 5. Reactive state
const isLoading = ref(false);
const userData = ref(null);

// 6. Computed properties
const fullName = computed(() => {
  return `${userData.value?.firstName} ${userData.value?.lastName}`;
});

// 7. Methods
const fetchData = async () => {
  // ...
};

// 8. Lifecycle hooks
onMounted(() => {
  fetchData();
});
</script>

<template>
  <!-- Template content -->
</template>

<style scoped>
/* Component styles */
</style>
```

### Component Naming
- Use multi-word component names
- Use PascalCase for component files
- Use kebab-case in templates

```vue
<!-- Good -->
<!-- CreditCardForm.vue -->
<template>
  <credit-card-list />
</template>

<!-- Bad -->
<!-- card.vue -->
```

### Props
- Always define prop types
- Mark required props
- Provide defaults for optional props
- Use validators when needed

```javascript
defineProps({
  balance: {
    type: Number,
    required: true,
    validator: (value) => value >= 0,
  },
  currency: {
    type: String,
    default: 'USD',
  },
});
```

### Events
- Use kebab-case for event names
- Prefix with action verb
- Document expected payload

```javascript
// Good
emit('update-balance', { cardId: 1, amount: 100 });

// Bad
emit('balance', 100);
```

### Composables
- Prefix with `use`
- Return reactive values and methods
- Keep focused on single responsibility

```javascript
// useCreditCards.js
import { ref } from 'vue';
import { api } from '@/services/api';

export function useCreditCards() {
  const cards = ref([]);
  const isLoading = ref(false);

  const fetchCards = async () => {
    isLoading.value = true;
    try {
      const response = await api.get('/credit-cards');
      cards.value = response.data;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    cards,
    isLoading,
    fetchCards,
  };
}
```

### Template Guidelines
- Keep templates simple and readable
- Extract complex logic to computed properties
- Use v-for with :key
- Avoid v-if with v-for on same element

```vue
<!-- Good -->
<template>
  <div v-for="card in activeCards" :key="card.id">
    {{ card.name }}: {{ formattedBalance(card) }}
  </div>
</template>

<!-- Bad -->
<template>
  <div v-for="card in cards" :key="card.id" v-if="card.isActive">
    {{ card.name }}: ${{ (card.balance / 100).toFixed(2) }}
  </div>
</template>
```

---

## Node.js/Express Standards

### Project Structure
```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # Route definitions
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   ├── validators/      # Input validation schemas
│   └── server.js        # App entry point
```

### Controller Pattern
- Keep controllers thin
- Delegate business logic to services
- Handle HTTP concerns only

```javascript
// controllers/creditCardController.js
const creditCardService = require('../services/creditCardService');
const { AppError } = require('../utils/errors');

exports.getCreditCards = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cards = await creditCardService.getUserCards(userId);
    
    res.json({
      success: true,
      data: cards,
    });
  } catch (error) {
    next(error);
  }
};

exports.createCreditCard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cardData = req.body;
    
    const card = await creditCardService.createCard(userId, cardData);
    
    res.status(201).json({
      success: true,
      data: card,
    });
  } catch (error) {
    next(error);
  }
};
```

### Service Layer
- Contains business logic
- Independent of HTTP layer
- Reusable across controllers

```javascript
// services/creditCardService.js
const { CreditCard } = require('../models');
const { AppError } = require('../utils/errors');

class CreditCardService {
  async getUserCards(userId) {
    const cards = await CreditCard.findAll({
      where: { userId },
      order: [['dueDate', 'ASC']],
    });
    
    return cards.map(this.calculateFutureDue);
  }

  async createCard(userId, cardData) {
    const { name, currentBalance, totalBalance, dueDate } = cardData;
    
    if (currentBalance > totalBalance) {
      throw new AppError('Current balance cannot exceed total balance', 400);
    }
    
    return await CreditCard.create({
      userId,
      name,
      currentBalance,
      totalBalance,
      dueDate,
    });
  }

  calculateFutureDue(card) {
    return {
      ...card.toJSON(),
      futureDue: card.totalBalance - card.currentBalance,
    };
  }
}

module.exports = new CreditCardService();
```

### Middleware
- Single responsibility
- Reusable and composable
- Proper error handling

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errors');

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      throw new AppError('Authentication required', 401);
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token', 401));
    } else {
      next(error);
    }
  }
};
```

### Route Definition
- Group related routes
- Apply middleware appropriately
- Use route parameters correctly

```javascript
// routes/creditCards.js
const express = require('express');
const router = express.Router();
const creditCardController = require('../controllers/creditCardController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { creditCardSchema } = require('../validators/creditCard');

router.use(authenticate);

router.get('/', creditCardController.getCreditCards);
router.post('/', validate(creditCardSchema), creditCardController.createCreditCard);
router.put('/:id', validate(creditCardSchema), creditCardController.updateCreditCard);
router.delete('/:id', creditCardController.deleteCreditCard);

module.exports = router;
```

---

## Database Standards

### Prisma Schema Conventions
- Use camelCase for model names
- Use camelCase for field names
- Always include `createdAt` and `updatedAt`
- Use meaningful relation names

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  creditCards CreditCard[]
  bankAccounts BankAccount[]
  portfolios Portfolio[]

  @@map("users")
}

model CreditCard {
  id             Int      @id @default(autoincrement())
  userId         Int
  name           String
  currentBalance Decimal  @db.Decimal(10, 2)
  totalBalance   Decimal  @db.Decimal(10, 2)
  dueDate        DateTime
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  user     User                 @relation(fields: [userId], references: [id], onDelete: Cascade)
  payments CreditCardPayment[]

  @@index([userId])
  @@map("credit_cards")
}
```

### Query Best Practices
- Use transactions for related operations
- Select only needed fields
- Use indexes for frequent queries
- Avoid N+1 queries

```javascript
// Good - use select to limit fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
});

// Good - use include for relations
const card = await prisma.creditCard.findUnique({
  where: { id: cardId },
  include: {
    payments: {
      orderBy: { paymentDate: 'desc' },
      take: 10,
    },
  },
});

// Good - use transactions
await prisma.$transaction(async (tx) => {
  await tx.creditCard.update({
    where: { id: cardId },
    data: { currentBalance: newBalance },
  });
  
  await tx.creditCardPayment.create({
    data: { creditCardId: cardId, amount, paymentDate },
  });
});
```

---

## API Design Standards

### RESTful Conventions
- Use nouns for resources
- Use HTTP methods correctly
- Use proper status codes
- Version your API

```
GET    /api/v1/credit-cards          # List all
POST   /api/v1/credit-cards          # Create new
GET    /api/v1/credit-cards/:id      # Get one
PUT    /api/v1/credit-cards/:id      # Update
DELETE /api/v1/credit-cards/:id      # Delete
POST   /api/v1/credit-cards/:id/payments  # Nested resource
```

### Response Format
- Consistent structure
- Include metadata
- Proper error format

```javascript
// Success response
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Chase Sapphire",
    "currentBalance": 1500.00
  }
}

// List response
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 10,
    "page": 1,
    "perPage": 20
  }
}

// Error response
{
  "success": false,
  "error": {
    "message": "Credit card not found",
    "code": "CARD_NOT_FOUND",
    "statusCode": 404
  }
}
```

### Input Validation
- Validate all inputs
- Use validation library (Joi/Zod)
- Return clear error messages

```javascript
// validators/creditCard.js
const Joi = require('joi');

exports.creditCardSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  currentBalance: Joi.number().min(0).required(),
  totalBalance: Joi.number().min(0).required(),
  dueDate: Joi.date().iso().required(),
}).custom((value, helpers) => {
  if (value.currentBalance > value.totalBalance) {
    return helpers.error('any.invalid');
  }
  return value;
});
```

---

## Testing Standards

### Test Structure
- Follow AAA pattern (Arrange, Act, Assert)
- One assertion per test (when possible)
- Descriptive test names

```javascript
// Good
describe('CreditCardService', () => {
  describe('createCard', () => {
    it('should create a credit card with valid data', async () => {
      // Arrange
      const userId = 1;
      const cardData = {
        name: 'Test Card',
        currentBalance: 100,
        totalBalance: 1000,
        dueDate: '2024-01-15',
      };

      // Act
      const result = await creditCardService.createCard(userId, cardData);

      // Assert
      expect(result).toHaveProperty('id');
      expect(result.name).toBe('Test Card');
    });

    it('should throw error when current balance exceeds total balance', async () => {
      // Arrange
      const userId = 1;
      const cardData = {
        name: 'Test Card',
        currentBalance: 1000,
        totalBalance: 100,
        dueDate: '2024-01-15',
      };

      // Act & Assert
      await expect(
        creditCardService.createCard(userId, cardData)
      ).rejects.toThrow('Current balance cannot exceed total balance');
    });
  });
});
```

### Coverage Requirements
- Minimum 70% overall coverage
- 80% for critical business logic
- 100% for utility functions

### Test Types
1. **Unit Tests**: Test individual functions/methods
2. **Integration Tests**: Test API endpoints
3. **E2E Tests**: Test complete user workflows

```javascript
// Integration test example
describe('POST /api/credit-cards', () => {
  it('should create a new credit card', async () => {
    const response = await request(app)
      .post('/api/credit-cards')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Card',
        currentBalance: 100,
        totalBalance: 1000,
        dueDate: '2024-01-15',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
  });
});
```

---

## Security Standards

### Authentication
- Use JWT with expiration
- Store tokens securely
- Implement refresh tokens
- Hash passwords with bcrypt (min 10 rounds)

```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Password hashing
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

// Token generation
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};
```

### Input Sanitization
- Validate all user inputs
- Sanitize before database operations
- Use parameterized queries (ORM handles this)

### Environment Variables
- Never commit .env files
- Use different configs for dev/prod
- Validate required env vars on startup

```javascript
// config/env.js
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'NODE_ENV',
];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});
```

### CORS Configuration
```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
```

---

## Git & Version Control

### Branch Naming
- `main` - production code
- `develop` - development branch
- `feature/feature-name` - new features
- `bugfix/bug-description` - bug fixes
- `hotfix/critical-fix` - production hotfixes

### Commit Messages
Follow conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Examples:
```
feat(credit-cards): add payment history endpoint

Implemented GET /api/credit-cards/:id/payments to retrieve
payment history for a specific credit card.

Closes #123
```

```
fix(auth): prevent token expiration edge case

Fixed issue where tokens could be used briefly after expiration
due to clock skew.
```

### Pull Request Guidelines
- Keep PRs small and focused
- Write descriptive PR titles
- Include testing instructions
- Link related issues
- Request reviews from team members

---

## Documentation Standards

### Code Comments
- Explain WHY, not WHAT
- Document complex algorithms
- Use JSDoc for functions

```javascript
/**
 * Calculates the net worth based on current assets and debts
 * 
 * @param {number} userId - The user's ID
 * @param {Date} snapshotDate - Date for the snapshot
 * @returns {Promise<Object>} Net worth data including assets, debts, and total
 * @throws {AppError} If user not found or calculation fails
 */
async function calculateNetWorth(userId, snapshotDate) {
  // Implementation
}
```

### README Files
Each major directory should have a README explaining:
- Purpose
- Structure
- Usage examples
- Dependencies

### API Documentation
- Use Swagger/OpenAPI
- Document all endpoints
- Include request/response examples
- Document error codes

---

## Performance Standards

### Frontend Performance
- Lazy load routes
- Debounce user inputs
- Virtualize long lists
- Optimize images
- Code splitting

```javascript
// Lazy load routes
const routes = [
  {
    path: '/portfolio',
    component: () => import('@/views/PortfolioTracker.vue'),
  },
];

// Debounce search
import { debounce } from 'lodash-es';

const searchCards = debounce((query) => {
  // Search logic
}, 300);
```

### Backend Performance
- Use database indexes
- Implement caching (Redis)
- Paginate large datasets
- Use connection pooling
- Monitor query performance

```javascript
// Pagination
const getCards = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  
  const [cards, total] = await Promise.all([
    prisma.creditCard.findMany({
      skip: offset,
      take: limit,
    }),
    prisma.creditCard.count(),
  ]);
  
  return { cards, total, page, perPage: limit };
};
```

---

## Error Handling

### Custom Error Classes
```javascript
// utils/errors.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404);
  }
}

module.exports = { AppError, ValidationError, NotFoundError };
```

### Global Error Handler
```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';
  
  // Log error
  if (!err.isOperational) {
    console.error('CRITICAL ERROR:', err);
  }
  
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: err.code,
      statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};
```

---

## Code Review Checklist

### Before Submitting PR
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] No console.log or debugger statements
- [ ] Documentation updated
- [ ] No sensitive data in code
- [ ] Performance considered
- [ ] Error handling implemented
- [ ] Security implications reviewed

### During Review
- [ ] Code is readable and maintainable
- [ ] Logic is sound
- [ ] Edge cases handled
- [ ] No code duplication
- [ ] Proper error handling
- [ ] Tests are comprehensive
- [ ] Performance is acceptable
- [ ] Security best practices followed

---

## Continuous Integration

### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{js,vue}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

### CI Pipeline
1. Lint code
2. Run unit tests
3. Run integration tests
4. Check code coverage
5. Build application
6. Deploy to staging (if main branch)

---

## Monitoring & Logging

### Logging Standards
- Use structured logging
- Include context (userId, requestId)
- Log levels: error, warn, info, debug
- Never log sensitive data

```javascript
const logger = require('./utils/logger');

logger.info('User logged in', {
  userId: user.id,
  timestamp: new Date(),
  ip: req.ip,
});

logger.error('Payment processing failed', {
  userId: user.id,
  cardId: card.id,
  error: error.message,
});
```

### Metrics to Track
- API response times
- Error rates
- Database query performance
- User activity
- System resources

---

## Accessibility Standards

### Frontend Accessibility
- Use semantic HTML
- Include ARIA labels
- Keyboard navigation support
- Color contrast compliance (WCAG AA)
- Screen reader testing

```vue
<template>
  <button
    aria-label="Delete credit card"
    @click="deleteCard"
    @keydown.enter="deleteCard"
  >
    <TrashIcon aria-hidden="true" />
  </button>
</template>
```

---

## Summary

Following these standards ensures:
- ✅ Consistent, maintainable code
- ✅ High code quality
- ✅ Better collaboration
- ✅ Fewer bugs
- ✅ Easier onboarding
- ✅ Scalable architecture

Review and update this document regularly as the project evolves.
