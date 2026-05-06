const { body, validationResult, param, query } = require('express-validator');

/**
 * Email validation - RFC 5322 compliant
 */
const validateEmail = () => {
     return body('email')
          .trim()
          .isEmail()
          .withMessage('Invalid email format')
          .normalizeEmail()
          .isLength({ max: 254 })
          .withMessage('Email must be less than 254 characters');
};

/**
 * Password validation - strong password requirements
 * Min 12 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
 */
const validatePassword = () => {
     return body('password')
          .isLength({ min: 12 })
          .withMessage('Password must be at least 12 characters')
          .isLength({ max: 128 })
          .withMessage('Password must be less than 128 characters')
          .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
          .withMessage('Password must contain uppercase, lowercase, number, and special character (@$!%*?&)');
};

/**
 * Name validation
 */
const validateName = (field = 'name') => {
     return body(field)
          .trim()
          .isLength({ min: 2, max: 100 })
          .withMessage(`${field} must be between 2 and 100 characters`)
          .matches(/^[a-zA-Z\s'-]+$/)
          .withMessage(`${field} can only contain letters, spaces, hyphens, and apostrophes`);
};

/**
 * Phone validation
 */
const validatePhone = (field = 'phone') => {
     return body(field)
          .trim()
          .optional()
          .matches(/^\+?1?\d{9,15}$/)
          .withMessage('Invalid phone number format');
};

/**
 * Address validation
 */
const validateAddress = () => {
     return [
          body('street')
               .trim()
               .isLength({ min: 5, max: 100 })
               .withMessage('Street must be between 5 and 100 characters'),
          body('city')
               .trim()
               .isLength({ min: 2, max: 50 })
               .withMessage('City must be between 2 and 50 characters')
               .matches(/^[a-zA-Z\s'-]+$/)
               .withMessage('City can only contain letters, spaces, hyphens, and apostrophes'),
          body('state')
               .trim()
               .isLength({ min: 2, max: 50 })
               .withMessage('State must be between 2 and 50 characters'),
          body('zipCode')
               .trim()
               .matches(/^\d{5}(?:-\d{4})?$/)
               .withMessage('ZIP code must be valid format (e.g., 12345 or 12345-6789)'),
          body('country')
               .trim()
               .isLength({ min: 2, max: 50 })
               .withMessage('Country must be between 2 and 50 characters'),
     ];
};

/**
 * Stripe token validation
 */
const validateStripeToken = () => {
     return body('stripeToken')
          .trim()
          .matches(/^tok_[a-zA-Z0-9]{24}$|^src_[a-zA-Z0-9]{24}$/)
          .withMessage('Invalid Stripe token format');
};

/**
 * PayPal payment ID validation
 */
const validatePayPalPaymentId = () => {
     return body('paymentId')
          .trim()
          .matches(/^PAY-[0-9A-Z]+$/)
          .withMessage('Invalid PayPal payment ID');
};

/**
 * Price validation (cents)
 */
const validatePrice = (field = 'price') => {
     return body(field)
          .isInt({ min: 1, max: 999999999 })
          .withMessage('Price must be a valid amount (1 to 999,999,999 cents)');
};

/**
 * Product ID validation
 */
const validateProductId = () => {
     return param('productId')
          .isInt({ min: 1 })
          .withMessage('Invalid product ID');
};

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          return res.status(400).json({
               success: false,
               message: 'Validation failed',
               errors: errors.array().map(err => ({
                    field: err.param,
                    message: err.msg,
               })),
          });
     }
     next();
};

/**
 * Sanitize user input to prevent XSS
 */
const sanitizeInput = (value) => {
     if (typeof value !== 'string') return value;

     return value
          .replace(/[<>]/g, '') // Remove angle brackets
          .replace(/&/g, '&amp;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;');
};

module.exports = {
     validateEmail,
     validatePassword,
     validateName,
     validatePhone,
     validateAddress,
     validateStripeToken,
     validatePayPalPaymentId,
     validatePrice,
     validateProductId,
     handleValidationErrors,
     sanitizeInput,
};
