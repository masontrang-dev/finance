# Authentication System Testing Guide

## Quick Start

### 1. Environment Setup

**Backend (.env):**
```bash
cd backend
cp .env.example .env
# Edit .env and set:
# JWT_SECRET=your-secret-key-here-change-in-production
# JWT_EXPIRES_IN=24h
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/finance_tracker
```

**Frontend (.env):**
```bash
cd frontend
cp .env.example .env
# Edit .env and set:
# VITE_API_BASE_URL=http://localhost:3000/api
```

### 2. Start Services

**Terminal 1 - Backend:**
```bash
cd backend
npm install  # if not already done
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install  # if not already done
npm run dev
```

### 3. Access Application

Open browser to: `http://localhost:5173`

## Test Scenarios

### Scenario 1: New User Registration

1. Navigate to `http://localhost:5173`
2. Should auto-redirect to `/login`
3. Click "create a new account" link
4. Fill in registration form:
   - Name: Your Name
   - Email: yourname@example.com
   - Password: password123 (min 8 chars)
   - Confirm Password: password123
5. Click "Create account"
6. Should redirect to dashboard
7. Verify your name appears in navigation bar

### Scenario 2: Login with Existing User

**Test credentials (from seed data):**
- Email: `test@example.com`
- Password: `password123`

1. Navigate to `http://localhost:5173/login`
2. Enter test credentials
3. Click "Sign in"
4. Should redirect to dashboard
5. Verify "Test User" appears in navigation

### Scenario 3: Logout

1. While logged in, click "Logout" button in navigation
2. Should redirect to `/login`
3. Try accessing `http://localhost:5173/` directly
4. Should redirect back to `/login` (not authenticated)

### Scenario 4: Route Guards

**Protected Routes (require authentication):**
- `/` - Dashboard

**Guest Routes (redirect if authenticated):**
- `/login` - Login page
- `/register` - Registration page

**Test:**
1. While logged out, try accessing `/`
   - Should redirect to `/login`
2. While logged in, try accessing `/login`
   - Should redirect to `/`
3. While logged in, try accessing `/register`
   - Should redirect to `/`

### Scenario 5: Token Persistence

1. Login with test credentials
2. Refresh the page (F5)
3. Should remain logged in (token persisted in localStorage)
4. Open browser DevTools → Application → Local Storage
5. Verify `token` key exists with JWT value

### Scenario 6: Validation Errors

**Registration Validation:**
1. Try registering with:
   - Name too short (< 2 chars)
   - Invalid email format
   - Password too short (< 8 chars)
   - Mismatched passwords
2. Verify error messages appear

**Login Validation:**
1. Try logging in with:
   - Invalid email format
   - Empty password
2. Verify error messages appear

### Scenario 7: Authentication Errors

1. Try logging in with non-existent email
   - Should show: "Invalid email or password"
2. Try logging in with wrong password
   - Should show: "Invalid email or password"
3. Try registering with existing email
   - Should show: "User with this email already exists"

## API Endpoints Testing (Optional)

### Using curl or Postman:

**Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Get Profile (protected):**
```bash
# Replace YOUR_TOKEN with token from login response
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Logout:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Expected Behaviors

### ✅ Success Cases

- Registration creates new user and returns token
- Login returns user data and token
- Token is stored in localStorage
- Protected routes require authentication
- Guest routes redirect if authenticated
- Token persists across page refreshes
- Logout clears token and redirects to login
- Profile endpoint returns current user data

### ❌ Error Cases

- Invalid credentials show generic error message
- Duplicate email shows specific error
- Validation errors show detailed messages
- Expired token redirects to login
- Invalid token redirects to login
- Missing token on protected route redirects to login

## Troubleshooting

### "Cannot connect to backend"
- Verify backend is running on port 3000
- Check `VITE_API_BASE_URL` in frontend/.env
- Check CORS settings in backend

### "Database connection error"
- Verify PostgreSQL is running
- Check DATABASE_URL in backend/.env
- Run `npm run db:migrate` in backend

### "JWT secret not configured"
- Set JWT_SECRET in backend/.env
- Restart backend server

### "Token expired" errors
- Tokens expire after 24h by default
- Logout and login again
- Adjust JWT_EXPIRES_IN in backend/.env if needed

## Security Notes

### Development
- Using simple passwords for testing is OK
- JWT_SECRET can be any string
- Tokens stored in localStorage (acceptable for development)

### Production Considerations
- Use strong JWT_SECRET (32+ random characters)
- Consider httpOnly cookies instead of localStorage
- Implement token refresh mechanism
- Add rate limiting to auth endpoints
- Use HTTPS only
- Implement CSRF protection
- Consider adding 2FA
- Add account lockout after failed attempts
- Log authentication events

## Next Steps

After verifying authentication works:
1. All future API endpoints can use `authenticate` middleware
2. User ID available in `req.user.userId` for protected routes
3. Frontend can access user data via `authStore.currentUser`
4. Ready to implement Epic 2: Monthly Cashflow Tracker
