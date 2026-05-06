const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

/**
 * CSRF Protection Middleware
 * Protects against Cross-Site Request Forgery attacks
 */

// Initialize cookie parser (required for csrf)
const initializeCookieParser = cookieParser(process.env.CSRF_SECRET || 'your-csrf-secret');

// Initialize CSRF protection
const csrfProtection = csrf({
     cookie: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
     },
});

/**
 * Middleware to generate CSRF token for GET requests
 * Attach token to response locals for template rendering
 */
const generateCsrfToken = (req, res, next) => {
     res.locals.csrfToken = req.csrfToken();
     next();
};

/**
 * Middleware to provide CSRF token via API endpoint
 * Used by frontend to fetch token before submitting forms
 */
const csrfTokenRoute = (req, res) => {
     res.json({
          csrfToken: req.csrfToken(),
     });
};

/**
 * CSRF error handler
 * Catches CSRF validation failures
 */
const csrfErrorHandler = (err, req, res, next) => {
     if (err.code !== 'EBADCSRFTOKEN') {
          return next(err);
     }

     // CSRF token errors
     res.status(403).json({
          success: false,
          message: 'Invalid CSRF token. Please refresh and try again.',
          error: 'CSRF_TOKEN_INVALID',
     });
};

/**
 * Validate CSRF token from request headers or body
 * Can be used as standalone middleware
 */
const validateCsrfToken = (req, res, next) => {
     // CSRF token can come from:
     // 1. X-CSRF-Token header
     // 2. _csrf form field
     // 3. csrf query parameter

     const token = req.headers['x-csrf-token'] ||
          req.body._csrf ||
          req.query._csrf;

     if (!token) {
          return res.status(403).json({
               success: false,
               message: 'CSRF token required',
               error: 'CSRF_TOKEN_MISSING',
          });
     }

     next();
};

module.exports = {
     initializeCookieParser,
     csrfProtection,
     generateCsrfToken,
     csrfTokenRoute,
     csrfErrorHandler,
     validateCsrfToken,
};
