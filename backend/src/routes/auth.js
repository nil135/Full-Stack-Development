const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, authenticateToken } = require('../middleware/auth');
const { authLimiter, registrationLimiter } = require('../middleware/rateLimiter');
const {
     validateEmail,
     validatePassword,
     validateName,
     validatePhone,
     handleValidationErrors,
     sanitizeInput,
} = require('../utils/validation');

/**
 * POST /auth/register
 * Register a new user account
 * 
 * Body:
 * {
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "email": "john@example.com",
 *   "password": "SecurePass123!",
 *   "phone": "+12125551234" (optional)
 * }
 */
router.post(
     '/register',
     registrationLimiter,
     validateName('firstName'),
     validateName('lastName'),
     validateEmail(),
     validatePassword(),
     validatePhone('phone'),
     handleValidationErrors,
     async (req, res) => {
          try {
               const { firstName, lastName, email, password, phone } = req.body;

               // Check if user already exists
               const existingUser = await User.findOne({ where: { email } });
               if (existingUser) {
                    return res.status(409).json({
                         success: false,
                         message: 'Email already registered',
                         error: 'EMAIL_EXISTS',
                    });
               }

               // Create new user
               const user = await User.create({
                    firstName: sanitizeInput(firstName),
                    lastName: sanitizeInput(lastName),
                    email: email.toLowerCase(),
                    password, // Password will be hashed by User model hook
                    phone: phone || null,
               });

               // Generate JWT token
               const token = generateToken(user.id);

               res.status(201).json({
                    success: true,
                    message: 'User registered successfully',
                    user: {
                         id: user.id,
                         firstName: user.firstName,
                         lastName: user.lastName,
                         email: user.email,
                    },
                    token,
               });
          } catch (error) {
               console.error('Registration error:', error);
               res.status(500).json({
                    success: false,
                    message: 'Registration failed',
                    error: 'INTERNAL_ERROR',
               });
          }
     }
);

/**
 * POST /auth/login
 * Authenticate user and return JWT token
 * 
 * Body:
 * {
 *   "email": "john@example.com",
 *   "password": "SecurePass123!"
 * }
 */
router.post(
     '/login',
     authLimiter,
     validateEmail(),
     body('password').notEmpty().withMessage('Password required'),
     handleValidationErrors,
     async (req, res) => {
          try {
               const { email, password } = req.body;

               // Find user by email
               const user = await User.findOne({ where: { email: email.toLowerCase() } });

               if (!user) {
                    // Don't reveal if email exists (security best practice)
                    return res.status(401).json({
                         success: false,
                         message: 'Invalid email or password',
                         error: 'INVALID_CREDENTIALS',
                    });
               }

               // Check if account is locked
               if (user.isLocked()) {
                    return res.status(429).json({
                         success: false,
                         message: 'Account temporarily locked due to multiple failed attempts',
                         retryAfter: Math.ceil((user.lockUntil - Date.now()) / 1000),
                         error: 'ACCOUNT_LOCKED',
                    });
               }

               // Validate password
               const isPasswordValid = await user.validatePassword(password);
               if (!isPasswordValid) {
                    await user.incLoginAttempts();
                    return res.status(401).json({
                         success: false,
                         message: 'Invalid email or password',
                         error: 'INVALID_CREDENTIALS',
                    });
               }

               // Check if account is active
               if (!user.isActive) {
                    return res.status(403).json({
                         success: false,
                         message: 'Account is disabled',
                         error: 'ACCOUNT_DISABLED',
                    });
               }

               // Reset login attempts on successful login
               await user.resetLoginAttempts();

               // Generate JWT token
               const token = generateToken(user.id);

               res.status(200).json({
                    success: true,
                    message: 'Login successful',
                    user: {
                         id: user.id,
                         firstName: user.firstName,
                         lastName: user.lastName,
                         email: user.email,
                    },
                    token,
               });
          } catch (error) {
               console.error('Login error:', error);
               res.status(500).json({
                    success: false,
                    message: 'Login failed',
                    error: 'INTERNAL_ERROR',
               });
          }
     }
);

/**
 * GET /auth/me
 * Get current authenticated user info
 * Requires JWT token in Authorization header
 */
router.get('/me', authenticateToken, (req, res) => {
     try {
          res.status(200).json({
               success: true,
               user: {
                    id: req.user.id,
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    email: req.user.email,
                    phone: req.user.phone,
                    isEmailVerified: req.user.isEmailVerified,
                    lastLoginAt: req.user.lastLoginAt,
               },
          });
     } catch (error) {
          res.status(500).json({
               success: false,
               message: 'Failed to fetch user info',
          });
     }
});

const { body } = require('express-validator');

module.exports = router;
