# Secure Ecommerce Platform - Complete Implementation Guide

## 🎯 Project Overview

This is a **production-ready, full-stack ecommerce platform** with:

- ✅ Secure user registration with password hashing (bcrypt)
- ✅ CSRF token protection on all state-changing operations
- ✅ Payment processing via **Stripe and PayPal**
- ✅ Comprehensive input validation (client & server-side)
- ✅ Rate limiting on sensitive endpoints
- ✅ SQL injection prevention via parameterized queries
- ✅ XSS prevention with input sanitization
- ✅ Account lockout after failed login attempts

---

## 📋 Technology Stack

### Backend

- **Framework**: Express.js (Node.js)
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Security**: Helmet.js, CSRF protection, rate limiting
- **Payments**: Stripe SDK, PayPal REST SDK

### Frontend

- **Framework**: Next.js 13 with React 18
- **Styling**: SCSS modules
- **Payments**: Stripe React library, PayPal SDK
- **Validation**: Custom validation utilities
- **HTTP Client**: Axios with interceptors

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn
- Stripe and PayPal developer accounts

### 1. Environment Setup

#### Backend Configuration

```bash
cd backend
cp .env.example .env
```

Fill in `.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret

# Frontend
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
PORT=5000
```

#### Frontend Configuration

```bash
cd frontend
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_client_id
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb ecommerce_db

# Run migrations (backend automatically syncs models)
npm run migrate
npm run seed  # Optional: populate sample data
```

### 3. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 4. Start Development Servers

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

---

## 🔐 Security Features

### User Registration & Authentication

#### Password Requirements

- Minimum 12 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (@$!%\*?&)

#### Password Storage

- Hashed with **bcrypt** (salt rounds: 12)
- Never stored in plain text
- Validated on every login

#### Account Lockout

- Locks after 5 failed login attempts
- Locked for 30 minutes
- Tracks attempt count and lock time

### API Security

#### CSRF Protection

- All POST/PUT/DELETE requests require CSRF token
- Token obtained from `/api/csrf-token` endpoint
- Token stored in HTTP-only cookies
- Token validated on every mutation

#### Rate Limiting

- **General API**: 100 requests / 15 minutes
- **Auth endpoints**: 5 attempts / 15 minutes
- **Registration**: 3 attempts / 1 hour
- **Payment**: 10 attempts / 1 hour
- **Password reset**: 3 attempts / 1 hour

#### Input Validation

All inputs validated on **both client and server**:

- Email format (RFC 5322)
- Phone number format
- Address validation
- Price validation (prevents negative amounts)
- Quantity limits (1-1000)
- String length limits

#### Headers Security

- **Helmet.js** sets security headers:
  - Content-Security-Policy
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Strict-Transport-Security (HSTS)

#### XSS Prevention

- React auto-escaping on frontend
- Output sanitization in utilities
- Input trimming and validation
- No dangerous HTML/JS evaluation

#### SQL Injection Prevention

- Sequelize ORM with parameterized queries
- Never concatenate user input in queries
- All inputs sanitized before DB operations

### Payment Security

#### Stripe Integration

- **Never store card data** - use Stripe tokens only
- Payment intents for SCA/3D Secure compliance
- Server-side confirmation before marking as complete
- Transaction ID stored in database for auditing

#### PayPal Integration

- Tokenized payment handling
- Server-side verification of transactions
- No sensitive data in frontend
- Webhooks for payment verification

---

## 📊 API Endpoints

### Authentication

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

### Checkout

```
POST   /api/checkout/create-order
GET    /api/checkout/order/:orderId
GET    /api/checkout/orders
```

### Payments

```
POST   /api/payment/stripe/create-intent
POST   /api/payment/stripe/confirm
POST   /api/payment/paypal/create
POST   /api/payment/paypal/execute
```

### CSRF

```
GET    /api/csrf-token
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── csrf.js
│   │   └── rateLimiter.js
│   ├── models/
│   │   ├── User.js
│   │   └── index.js (Product, Order, Payment)
│   ├── routes/
│   │   ├── auth.js
│   │   ├── checkout.js
│   │   └── payment.js
│   ├── utils/
│   │   ├── validation.js
│   │   └── paymentService.js
│   └── server.js
├── package.json
└── .env.example

frontend/
├── src/
│   ├── components/
│   │   ├── RegistrationForm.jsx
│   │   ├── CheckoutForm.jsx
│   │   └── PaymentForm.jsx
│   ├── pages/
│   │   ├── auth/
│   │   ├── checkout/
│   │   └── payment/
│   ├── styles/
│   │   ├── auth.module.scss
│   │   ├── checkout.module.scss
│   │   └── payment.module.scss
│   └── utils/
│       ├── api.js
│       └── validation.js
├── package.json
└── .env.example
```

---

## 🧪 Testing the Implementation

### 1. Register a New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "phone": "+12125551234"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

Store the returned `token` for subsequent requests.

### 3. Create an Order

```bash
curl -X POST http://localhost:5000/api/checkout/create-order \
  -H "Authorization: Bearer <token>" \
  -H "X-CSRF-Token: <csrfToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"productId": 1, "quantity": 2}
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    }
  }'
```

### 4. Create Stripe Payment

```bash
curl -X POST http://localhost:5000/api/payment/stripe/create-intent \
  -H "Authorization: Bearer <token>" \
  -H "X-CSRF-Token: <csrfToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "orderId": 1
  }'
```

---

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL service
sudo systemctl status postgresql

# Create database manually
psql -U postgres -c "CREATE DATABASE ecommerce_db;"
```

### CSRF Token Errors

- Ensure cookies are enabled
- Check if `CSRF_SECRET` is set in `.env`
- Verify `X-CSRF-Token` header is sent on mutations

### Stripe Issues

- Verify keys are correct (use test keys for development)
- Check webhook secret is properly configured
- Test with Stripe test cards: `4242 4242 4242 4242`

### PayPal Issues

- Ensure mode is set to `sandbox` for testing
- Verify Client ID and Secret are correct
- Check redirect URLs are properly configured

---

## 📚 Security Checklist

When deploying to production:

- [ ] Change JWT_SECRET to a strong random value
- [ ] Change CSRF_SECRET to a strong random value
- [ ] Set NODE_ENV=production
- [ ] Use HTTPS/TLS for all connections
- [ ] Set Secure flag on cookies
- [ ] Set SameSite=Strict on CSRF cookies
- [ ] Enable HSTS header (HTTP Strict-Transport-Security)
- [ ] Use environment-specific keys for Stripe/PayPal
- [ ] Set up database backups and encryption
- [ ] Enable database SSL connections
- [ ] Configure firewall rules
- [ ] Set up error logging (don't expose stack traces)
- [ ] Enable rate limiting for all endpoints
- [ ] Set up monitoring and alerting
- [ ] Regular security audits

---

## 📖 Component Documentation

### RegistrationForm Component

- Validates all inputs in real-time
- Shows password strength hints
- Prevents password mismatch
- Enforces terms acceptance
- Handles server-side validation errors

### CheckoutForm Component

- Multi-step form (Shipping → Billing → Review)
- Address validation
- Order summary sidebar
- Cart item display with pricing

### PaymentForm Component

- Stripe card payment with PCI compliance
- PayPal integration with redirect flow
- Payment method selector
- Real-time card validation
- Security information display

---

## 🔄 Workflow: User → Order → Payment

1. **User Registration**
   - User enters credentials with validation
   - Password hashed with bcrypt
   - JWT token returned
   - User redirected to dashboard

2. **Shopping**
   - User adds items to cart
   - Cart stored in frontend state/local storage

3. **Checkout**
   - Multi-step checkout form
   - Address validation
   - Order created with "pending" status
   - Redirect to payment

4. **Payment (Stripe)**
   - User selects card payment
   - Frontend creates Stripe payment intent
   - User enters card details
   - Stripe tokenizes card (PCI compliant)
   - Backend confirms payment intent
   - Order status → "processing"

5. **Payment (PayPal)**
   - User selects PayPal
   - Backend creates PayPal payment
   - User redirected to PayPal approval
   - User approves payment
   - Backend executes PayPal transaction
   - Order status → "processing"

---

## 📞 Support & Resources

- [Stripe Documentation](https://stripe.com/docs)
- [PayPal REST API Docs](https://developer.paypal.com/docs/api/overview/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [React Security Best Practices](https://react.dev/learn/security)

---

## 📝 License

This project is licensed under the MIT License.

---

## ✅ Completed Security Tasks

- ✅ User registration with password hashing
- ✅ CSRF protection on all mutations
- ✅ Rate limiting on sensitive endpoints
- ✅ Input validation (client & server)
- ✅ Account lockout mechanism
- ✅ Stripe integration with tokenization
- ✅ PayPal integration
- ✅ Security headers (Helmet.js)
- ✅ SQL injection prevention (ORM)
- ✅ XSS prevention with sanitization
- ✅ JWT authentication
- ✅ Order management with status tracking
- ✅ Payment record auditing

Enjoy building your secure ecommerce platform! 🚀
