require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// Import middleware
const { initializeCookieParser, csrfProtection, csrfErrorHandler } = require('./middleware/csrf');
const { generalLimiter } = require('./middleware/rateLimiter');
const sequelize = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const checkoutRoutes = require('./routes/checkout');

// Initialize Express app
const app = express();

/**
 * Security Middleware
 */

// Helmet.js - Set security HTTP headers
app.use(helmet({
     contentSecurityPolicy: {
          directives: {
               defaultSrc: ["'self'"],
               scriptSrc: ["'self'"],
               styleSrc: ["'self'", "'unsafe-inline'"],
               imgSrc: ["'self'", 'data:', 'https:'],
               connectSrc: ["'self'", 'https://api.stripe.com', 'https://www.paypal.com'],
               frameSrc: ["'self'", 'https://www.paypal.com'],
          },
     },
     hsts: {
          maxAge: 31536000, // 1 year
          includeSubDomains: true,
          preload: true,
     },
}));

// CORS configuration
const corsOptions = {
     origin: process.env.FRONTEND_URL || 'http://localhost:3000',
     credentials: true,
     optionsSuccessStatus: 200,
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
};

app.use(cors(corsOptions));

// Request logging
app.use(morgan('combined', {
     skip: (req) => req.path === '/health',
}));

/**
 * Body Parsing Middleware
 */
app.use(express.json({ limit: '10kb' })); // Limit payload size to prevent DoS
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(initializeCookieParser);

/**
 * Rate Limiting
 */
app.use(generalLimiter);

/**
 * Health Check Endpoint
 */
app.get('/health', (req, res) => {
     res.status(200).json({
          status: 'OK',
          timestamp: new Date().toISOString(),
     });
});

/**
 * CSRF Token Endpoint
 * GET /api/csrf-token
 * Returns CSRF token for frontend
 */
app.get('/api/csrf-token', csrfProtection, (req, res) => {
     res.status(200).json({
          csrfToken: req.csrfToken(),
     });
});

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/checkout', csrfProtection, checkoutRoutes);
app.use('/api/payment', paymentRoutes);

/**
 * 404 Handler
 */
app.use((req, res) => {
     res.status(404).json({
          success: false,
          message: 'Endpoint not found',
          path: req.path,
     });
});

/**
 * CSRF Error Handler
 */
app.use(csrfErrorHandler);

/**
 * Global Error Handler
 */
app.use((err, req, res, next) => {
     console.error('Unhandled error:', err);

     // Don't expose stack trace in production
     const message = process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : err.message;

     res.status(err.status || 500).json({
          success: false,
          message,
          error: process.env.NODE_ENV === 'production' ? undefined : err,
     });
});

/**
 * Database Sync and Server Start
 */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
     try {
          // Sync database models
          await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
          console.log('✓ Database synchronized');

          // Start server
          app.listen(PORT, () => {
               console.log(`✓ Server running on port ${PORT}`);
               console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
               console.log(`✓ CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
          });
     } catch (error) {
          console.error('✗ Server startup failed:', error);
          process.exit(1);
     }
};

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
     console.error('✗ Unhandled rejection:', err);
     process.exit(1);
});

startServer();

module.exports = app;
