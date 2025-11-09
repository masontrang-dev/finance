# Personal Finance Tracker - Implementation Plan

## Project Overview
A Vue.js and Node.js application for tracking credit cards, bank accounts, investment portfolios, and net worth.

**⚠️ Important Note**: This application is based on **manual user input**. Users will manually enter all financial data including credit card balances, bank account balances, and portfolio values. This is NOT an API-integrated system that automatically syncs with banks, credit cards, or brokerage accounts.

## Project Summary

- **Total User Stories**: 23 stories across 6 epics
- **Total Estimated Effort**: 95-131 hours
- **Estimated Timeline**: 8-13 weeks for full implementation
- **Technology Stack**: Vue 3 + Node.js/Express + PostgreSQL
- **Data Entry Method**: Manual user input (no external API integration)

### Effort Breakdown by Epic
- **Epic 1 - Project Setup & Infrastructure**: 10-13 hours (3 stories)
- **Epic 2 - Monthly Cashflow Tracker**: 23-29 hours (5 stories)
- **Epic 3 - Portfolio Tracker**: 19-24 hours (4 stories)
- **Epic 4 - Annual Net Worth Report**: 16-21 hours (4 stories)
- **Epic 5 - UI/UX & Polish**: 19-24 hours (4 stories)
- **Epic 6 - Testing & Deployment**: 18-24 hours (3 stories)

---

## User Stories

### Epic 1: Project Setup & Infrastructure

#### Story 1.1: Initialize Project Structure ✅
**As a** developer  
**I want** to set up the initial project structure  
**So that** I have a solid foundation to build upon

**Acceptance Criteria:**
- [x] Create frontend directory with Vue 3 + Vite
- [x] Create backend directory with Express.js
- [x] Set up package.json files with dependencies
- [x] Configure ESLint and Prettier
- [x] Create .gitignore files
- [x] Initialize Git repository
- [x] Create README.md with setup instructions

**Estimated Effort:** 2-3 hours
**Status:** Complete

---

#### Story 1.2: Database Setup ✅
**As a** developer  
**I want** to set up PostgreSQL database with schema  
**So that** I can store application data

**Acceptance Criteria:**
- [x] Install and configure PostgreSQL
- [x] Set up Prisma ORM
- [x] Create database schema (users, credit_cards, bank_accounts, portfolios, etc.)
- [x] Create initial migration
- [x] Set up database connection in backend
- [x] Create seed data for development

**Estimated Effort:** 3-4 hours
**Status:** Complete

**Implementation Details:**
- Created comprehensive Prisma schema with all required models
- Set up Prisma client with logging and graceful shutdown
- Created seed script with sample data for all entities
- Added database management scripts to package.json
- Created detailed setup documentation in prisma/README.md

---

#### Story 1.3: Authentication System ✅
**As a** user  
**I want** to register and log in securely  
**So that** my financial data is protected

**Acceptance Criteria:**
- [x] Implement user registration endpoint
- [x] Implement login endpoint with JWT
- [x] Create password hashing with bcrypt
- [x] Implement authentication middleware
- [x] Create login/register Vue components
- [x] Store JWT in localStorage/cookies
- [x] Implement route guards in Vue Router
- [x] Add logout functionality

**Estimated Effort:** 5-6 hours
**Status:** Complete

---

### Epic 2: Monthly Cashflow Tracker

#### Story 2.1: Credit Card Management ✅
**As a** user  
**I want** to manage my credit cards  
**So that** I can track my credit card obligations

**Acceptance Criteria:**
- [x] Create API endpoints for CRUD operations on credit cards
- [x] Implement credit card model with fields: name, current_balance, total_balance, due_date
- [x] Calculate future_due (total_balance - current_balance)
- [x] Create CreditCardList.vue component
- [x] Create CreditCardForm.vue component for add/edit
- [x] Display all credit cards with balances and due dates
- [x] Implement validation for required fields
- [x] Add delete functionality with confirmation

**Estimated Effort:** 6-8 hours
**Status:** Complete

---

#### Story 2.2: Credit Card Payment Tracking ✅
**As a** user  
**I want** to record payments on my credit cards  
**So that** I can track my payment history

**Acceptance Criteria:**
- [x] Create payment recording endpoint
- [x] Create payment history endpoint
- [x] Implement payment model with fields: amount, payment_date, notes
- [x] Update credit card balance after payment
- [x] Create PaymentForm.vue component
- [x] Create PaymentHistory.vue component
- [x] Display payment history in a table
- [x] Calculate remaining balance after payments

**Estimated Effort:** 4-5 hours
**Status:** Complete

---

#### Story 2.3: Bank Account Management ✅
**As a** user  
**I want** to manage my bank accounts  
**So that** I can track my available cash

**Acceptance Criteria:**
- [x] Create API endpoints for CRUD operations on bank accounts
- [x] Implement bank account model with fields: name, current_balance
- [x] Create BankAccountList.vue component
- [x] Create BankAccountForm.vue component
- [x] Display all bank accounts with balances
- [x] Implement validation
- [x] Add delete functionality with confirmation

**Estimated Effort:** 4-5 hours
**Status:** Complete

---

#### Story 2.4: Future Deposits Tracking
**As a** user  
**I want** to record future deposits  
**So that** I can plan my cashflow

**Acceptance Criteria:**
- [ ] Create deposit recording endpoint
- [ ] Create deposit history endpoint
- [ ] Implement deposit model with fields: amount, deposit_date, description
- [ ] Create DepositForm.vue component
- [ ] Create DepositList.vue component
- [ ] Display upcoming deposits
- [ ] Filter deposits by date range

**Estimated Effort:** 4-5 hours

---

#### Story 2.5: Cashflow Summary Dashboard
**As a** user  
**I want** to see a summary of my monthly cashflow  
**So that** I can ensure I have sufficient funds

**Acceptance Criteria:**
- [ ] Create cashflow summary endpoint
- [ ] Calculate total available cash (bank balances + future deposits)
- [ ] Calculate total obligations (credit card current balances)
- [ ] Calculate cashflow surplus/deficit
- [ ] Create CashflowSummary.vue component
- [ ] Display summary with visual indicators (green/red)
- [ ] Show breakdown by credit card and bank account
- [ ] Add month selector

**Estimated Effort:** 5-6 hours

---

### Epic 3: Portfolio Tracker

#### Story 3.1: Portfolio Management
**As a** user  
**I want** to create and manage multiple portfolios  
**So that** I can track different investment accounts

**Acceptance Criteria:**
- [ ] Create API endpoints for CRUD operations on portfolios
- [ ] Implement portfolio model with fields: name
- [ ] Create PortfolioList.vue component
- [ ] Create PortfolioForm.vue component
- [ ] Display all portfolios with current balance
- [ ] Implement validation
- [ ] Add delete functionality with confirmation

**Estimated Effort:** 4-5 hours

---

#### Story 3.2: Daily Balance Snapshots
**As a** user  
**I want** to record portfolio balances on market days  
**So that** I can track performance over time

**Acceptance Criteria:**
- [ ] Create snapshot recording endpoint
- [ ] Create snapshot history endpoint
- [ ] Implement snapshot model with fields: balance, snapshot_date
- [ ] Create SnapshotForm.vue component
- [ ] Validate that snapshot_date is a market open day (weekday, not holiday)
- [ ] Prevent duplicate snapshots for same date
- [ ] Display recent snapshots in a list
- [ ] Calculate day-over-day change

**Estimated Effort:** 5-6 hours

---

#### Story 3.3: Portfolio Performance Chart
**As a** user  
**I want** to see a chart of my portfolio balances  
**So that** I can visualize performance trends

**Acceptance Criteria:**
- [ ] Install Chart.js or similar library
- [ ] Create PortfolioChart.vue component
- [ ] Fetch snapshot data for selected portfolio
- [ ] Display line chart with dates on x-axis and balance on y-axis
- [ ] Add date range selector (1M, 3M, 6M, 1Y, All)
- [ ] Show total balance across all portfolios
- [ ] Display percentage change
- [ ] Add tooltips with detailed information

**Estimated Effort:** 6-8 hours

---

#### Story 3.4: Portfolio Summary View
**As a** user  
**I want** to see a summary of all my portfolios  
**So that** I can quickly assess my investment status

**Acceptance Criteria:**
- [ ] Create portfolio summary endpoint
- [ ] Calculate total portfolio value
- [ ] Calculate performance metrics (MTD, YTD)
- [ ] Create PortfolioSummary.vue component
- [ ] Display total value and individual portfolio values
- [ ] Show performance metrics with color coding
- [ ] Add last updated timestamp

**Estimated Effort:** 4-5 hours

---

### Epic 4: Annual Net Worth Report

#### Story 4.1: Net Worth Calculation
**As a** user  
**I want** the system to calculate my net worth  
**So that** I can understand my financial position

**Acceptance Criteria:**
- [ ] Create net worth calculation service
- [ ] Sum all portfolio balances (assets)
- [ ] Sum all bank account balances (assets)
- [ ] Sum all credit card total balances (debts)
- [ ] Calculate net worth = total assets - total debts
- [ ] Create endpoint to get current net worth
- [ ] Create endpoint to save net worth snapshot

**Estimated Effort:** 3-4 hours

---

#### Story 4.2: Net Worth Snapshots
**As a** user  
**I want** to save periodic net worth snapshots  
**So that** I can track my progress over time

**Acceptance Criteria:**
- [ ] Create net worth snapshot model
- [ ] Implement snapshot creation endpoint
- [ ] Store total_assets, total_debts, net_worth, snapshot_date
- [ ] Create manual snapshot trigger
- [ ] Display snapshot history
- [ ] Calculate change from previous snapshot

**Estimated Effort:** 3-4 hours

---

#### Story 4.3: Annual Report View
**As a** user  
**I want** to view my annual net worth report  
**So that** I can review my financial progress

**Acceptance Criteria:**
- [ ] Create annual report endpoint
- [ ] Fetch all snapshots for selected year
- [ ] Create AnnualReport.vue component
- [ ] Display net worth chart for the year
- [ ] Show breakdown of assets and debts
- [ ] Display year-over-year comparison
- [ ] Show monthly snapshots in a table
- [ ] Calculate annual growth rate

**Estimated Effort:** 6-8 hours

---

#### Story 4.4: Asset Allocation Breakdown
**As a** user  
**I want** to see how my assets are allocated  
**So that** I can understand my financial composition

**Acceptance Criteria:**
- [ ] Calculate percentage of each portfolio in total assets
- [ ] Calculate percentage of each bank account in total assets
- [ ] Create AssetAllocation.vue component
- [ ] Display pie chart or bar chart
- [ ] Show percentages and dollar amounts
- [ ] Include debts in the visualization

**Estimated Effort:** 4-5 hours

---

### Epic 5: UI/UX & Polish

#### Story 5.1: Responsive Design
**As a** user  
**I want** the app to work on mobile and desktop  
**So that** I can access it from any device

**Acceptance Criteria:**
- [ ] Implement responsive layouts with TailwindCSS
- [ ] Test on mobile, tablet, and desktop viewports
- [ ] Ensure forms are mobile-friendly
- [ ] Optimize charts for mobile viewing
- [ ] Add mobile navigation menu

**Estimated Effort:** 6-8 hours

---

#### Story 5.2: Dashboard Overview
**As a** user  
**I want** a dashboard with key metrics  
**So that** I can quickly see my financial status

**Acceptance Criteria:**
- [ ] Create Dashboard.vue component
- [ ] Display cashflow summary card
- [ ] Display portfolio summary card
- [ ] Display net worth card
- [ ] Show upcoming credit card due dates
- [ ] Add quick action buttons
- [ ] Display recent activity

**Estimated Effort:** 5-6 hours

---

#### Story 5.3: Data Validation & Error Handling
**As a** user  
**I want** helpful error messages  
**So that** I know when something goes wrong

**Acceptance Criteria:**
- [ ] Implement client-side validation for all forms
- [ ] Implement server-side validation
- [ ] Display user-friendly error messages
- [ ] Add loading states for async operations
- [ ] Handle network errors gracefully
- [ ] Add success notifications

**Estimated Effort:** 4-5 hours

---

#### Story 5.4: Date Pickers & Input Components
**As a** user  
**I want** intuitive input controls  
**So that** data entry is easy

**Acceptance Criteria:**
- [ ] Implement date picker component
- [ ] Implement currency input component
- [ ] Add input masking for numbers
- [ ] Create reusable form components
- [ ] Add keyboard shortcuts where appropriate

**Estimated Effort:** 4-5 hours

---

### Epic 6: Testing & Deployment

#### Story 6.1: Unit Tests
**As a** developer  
**I want** unit tests for critical functions  
**So that** I can ensure code quality

**Acceptance Criteria:**
- [ ] Set up testing framework (Vitest/Jest)
- [ ] Write tests for calculation functions
- [ ] Write tests for API endpoints
- [ ] Write tests for Vue components
- [ ] Achieve >70% code coverage

**Estimated Effort:** 8-10 hours

---

#### Story 6.2: Integration Tests
**As a** developer  
**I want** integration tests for key workflows  
**So that** I can ensure the app works end-to-end

**Acceptance Criteria:**
- [ ] Set up Playwright or Cypress
- [ ] Write tests for authentication flow
- [ ] Write tests for credit card management
- [ ] Write tests for portfolio tracking
- [ ] Write tests for report generation

**Estimated Effort:** 6-8 hours

---

#### Story 6.3: Production Deployment
**As a** developer  
**I want** to deploy the app to production  
**So that** users can access it

**Acceptance Criteria:**
- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Deploy backend to hosting service
- [ ] Deploy frontend to hosting service
- [ ] Set up HTTPS/SSL
- [ ] Configure CORS
- [ ] Set up monitoring and logging
- [ ] Create deployment documentation

**Estimated Effort:** 4-6 hours

---

## Development Phases

### Phase 1: Foundation (Stories 1.1 - 1.3)
**Duration:** 1-2 weeks  
**Goal:** Set up infrastructure and authentication

### Phase 2: Cashflow Tracker (Stories 2.1 - 2.5)
**Duration:** 2-3 weeks  
**Goal:** Complete monthly cashflow tracking functionality

### Phase 3: Portfolio Tracker (Stories 3.1 - 3.4)
**Duration:** 2-3 weeks  
**Goal:** Complete portfolio tracking and visualization

### Phase 4: Annual Reports (Stories 4.1 - 4.4)
**Duration:** 1-2 weeks  
**Goal:** Complete net worth reporting

### Phase 5: Polish & Testing (Stories 5.1 - 6.3)
**Duration:** 2-3 weeks  
**Goal:** Refine UI/UX, add tests, and deploy

---

## Total Estimated Timeline
**8-13 weeks** for full implementation

---

## Priority Order

### Must Have (MVP)
1. Authentication (1.3)
2. Credit Card Management (2.1, 2.2)
3. Bank Account Management (2.3, 2.4)
4. Cashflow Summary (2.5)
5. Portfolio Management (3.1, 3.2)
6. Basic Dashboard (5.2)

### Should Have
1. Portfolio Charts (3.3, 3.4)
2. Net Worth Calculation (4.1, 4.2)
3. Annual Report (4.3)
4. Responsive Design (5.1)
5. Error Handling (5.3)

### Nice to Have
1. Asset Allocation (4.4)
2. Advanced Input Components (5.4)
3. Comprehensive Testing (6.1, 6.2)

---

## Technical Debt & Risks

### Risks
1. **Date Handling**: Ensure proper timezone handling for due dates and market days
2. **Data Consistency**: Ensure balance calculations are accurate across all views
3. **Performance**: Large datasets may slow down charts and reports
4. **Security**: Proper authentication and authorization is critical

### Mitigation Strategies
1. Use a robust date library (date-fns)
2. Implement database transactions for critical operations
3. Add pagination and lazy loading for large datasets
4. Follow OWASP security best practices
5. Regular code reviews and testing

---

## Success Metrics

1. **Functionality**: All user stories completed and tested
2. **Performance**: Page load time < 2 seconds
3. **Reliability**: 99% uptime
4. **Security**: No critical vulnerabilities
5. **Usability**: User can complete key tasks in < 5 clicks
6. **Code Quality**: >70% test coverage, no critical linting errors

---

## Next Steps

1. Review and approve architecture and implementation plan
2. Set up development environment
3. Begin Phase 1: Foundation
4. Establish regular check-ins and demos
5. Iterate based on feedback

---

## Frequently Asked Questions

### Is this using API calls to banks and credit cards?
**No.** This application is designed for **manual data entry only**. Users will:
- Manually input credit card balances, due dates, and payment amounts
- Manually input bank account balances and future deposits
- Manually input portfolio balances on market days
- Manually update all financial information

This approach:
- ✅ Provides full privacy and data control
- ✅ Avoids complex API integrations and authentication
- ✅ Works with any financial institution
- ✅ Simpler to build and maintain
- ❌ Requires manual updates from the user
- ❌ No automatic transaction syncing

### Future Enhancement: API Integration
If you want to add automatic syncing in the future, you could integrate with:
- **Plaid API** - For bank and credit card connections
- **Alpaca/Polygon** - For brokerage account data
- **Yodlee** - For comprehensive financial data aggregation

This would be a significant additional effort (estimated 40-60 hours) and would be added as a separate epic.
