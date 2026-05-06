const rateLimit = require('express-rate-limit');

/**
 * Rate limiting configurations for different endpoints
 */

// General API rate limit: 100 requests per 15 minutes
const generalLimiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 100,
     message: 'Too many requests from this IP, please try again later.',
     standardHeaders: true,
     legacyHeaders: false,
     skip: (req) => {
          // Skip rate limiting for health check
          return req.path === '/health';
     },
});

// Authentication endpoints: 5 attempts per 15 minutes (stricter)
const authLimiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 5,
     message: 'Too many login attempts, please try again later.',
     standardHeaders: true,
     legacyHeaders: false,
     keyGenerator: (req) => {
          // Use email as key for login attempts instead of IP
          return req.body.email || req.ip;
     },
     store: new (require('express-rate-limit').MemoryStore)(),
});

// Registration endpoints: 3 attempts per hour
const registrationLimiter = rateLimit({
     windowMs: 60 * 60 * 1000,
     max: 3,
     message: 'Too many registration attempts, please try again later.',
     standardHeaders: true,
     legacyHeaders: false,
     skipSuccessfulRequests: true, // Don't count successful registrations
});

// Payment endpoints: 10 attempts per hour (prevent abuse)
const paymentLimiter = rateLimit({
     windowMs: 60 * 60 * 1000,
     max: 10,
     message: 'Too many payment attempts, please try again later.',
     standardHeaders: true,
     legacyHeaders: false,
     keyGenerator: (req) => {
          // Use user ID if authenticated, otherwise use IP
          return req.user?.id || req.ip;
     },
});

// Password reset: 3 attempts per hour
const passwordResetLimiter = rateLimit({
     windowMs: 60 * 60 * 1000,
     max: 3,
     message: 'Too many password reset attempts, please try again later.',
     standardHeaders: true,
     legacyHeaders: false,
});

// Public API endpoints: 30 requests per minute
const publicApiLimiter = rateLimit({
     windowMs: 1 * 60 * 1000,
     max: 30,
     message: 'Too many requests, please try again later.',
     standardHeaders: true,
     legacyHeaders: false,
});

module.exports = {
     generalLimiter,
     authLimiter,
     registrationLimiter,
     paymentLimiter,
     passwordResetLimiter,
     publicApiLimiter,
};
