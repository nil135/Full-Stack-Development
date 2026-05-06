const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
     return jwt.sign(
          { id: userId },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRE || '7d' }
     );
};

/**
 * Verify JWT token
 */
const verifyToken = (token) => {
     try {
          return jwt.verify(token, process.env.JWT_SECRET);
     } catch (error) {
          return null;
     }
};

/**
 * Middleware to authenticate JWT token
 * Extracts token from Authorization header (Bearer <token>)
 */
const authenticateToken = async (req, res, next) => {
     try {
          const authHeader = req.headers['authorization'];
          const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

          if (!token) {
               return res.status(401).json({
                    success: false,
                    message: 'Access token required',
               });
          }

          const decoded = verifyToken(token);
          if (!decoded) {
               return res.status(401).json({
                    success: false,
                    message: 'Invalid or expired token',
               });
          }

          // Fetch user to ensure they still exist and are active
          const user = await User.findByPk(decoded.id);
          if (!user || !user.isActive) {
               return res.status(401).json({
                    success: false,
                    message: 'User not found or account disabled',
               });
          }

          req.user = user;
          next();
     } catch (error) {
          res.status(500).json({
               success: false,
               message: 'Token verification failed',
          });
     }
};

/**
 * Middleware to check if user account is locked
 */
const checkAccountLock = async (req, res, next) => {
     try {
          if (req.user && req.user.isLocked()) {
               return res.status(429).json({
                    success: false,
                    message: 'Account is temporarily locked due to multiple failed login attempts',
                    retryAfter: Math.ceil((req.user.lockUntil - Date.now()) / 1000),
               });
          }
          next();
     } catch (error) {
          res.status(500).json({
               success: false,
               message: 'Error checking account status',
          });
     }
};

module.exports = {
     generateToken,
     verifyToken,
     authenticateToken,
     checkAccountLock,
};
