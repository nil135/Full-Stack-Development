/**
 * Frontend Input Validation Utilities
 * All validations match backend requirements
 */

/**
 * Email validation
 */
export const validateEmail = (email) => {
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

     if (!email) {
          return { valid: false, error: 'Email is required' };
     }

     if (email.length > 254) {
          return { valid: false, error: 'Email is too long' };
     }

     if (!emailRegex.test(email)) {
          return { valid: false, error: 'Invalid email format' };
     }

     return { valid: true };
};

/**
 * Password validation
 * Min 12 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
 */
export const validatePassword = (password) => {
     if (!password) {
          return { valid: false, error: 'Password is required' };
     }

     if (password.length < 12) {
          return { valid: false, error: 'Password must be at least 12 characters' };
     }

     if (password.length > 128) {
          return { valid: false, error: 'Password is too long' };
     }

     if (!/[a-z]/.test(password)) {
          return { valid: false, error: 'Password must contain lowercase letters' };
     }

     if (!/[A-Z]/.test(password)) {
          return { valid: false, error: 'Password must contain uppercase letters' };
     }

     if (!/\d/.test(password)) {
          return { valid: false, error: 'Password must contain numbers' };
     }

     if (!/[@$!%*?&]/.test(password)) {
          return { valid: false, error: 'Password must contain special characters (@$!%*?&)' };
     }

     return { valid: true };
};

/**
 * Name validation
 */
export const validateName = (name, fieldName = 'Name') => {
     if (!name) {
          return { valid: false, error: `${fieldName} is required` };
     }

     if (name.length < 2) {
          return { valid: false, error: `${fieldName} must be at least 2 characters` };
     }

     if (name.length > 100) {
          return { valid: false, error: `${fieldName} is too long` };
     }

     if (!/^[a-zA-Z\s'-]+$/.test(name)) {
          return {
               valid: false,
               error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`
          };
     }

     return { valid: true };
};

/**
 * Phone validation
 */
export const validatePhone = (phone) => {
     if (!phone) {
          return { valid: true }; // Optional field
     }

     if (!/^\+?1?\d{9,15}$/.test(phone.replace(/[\s()-]/g, ''))) {
          return { valid: false, error: 'Invalid phone number format' };
     }

     return { valid: true };
};

/**
 * ZIP code validation
 */
export const validateZipCode = (zipCode) => {
     if (!zipCode) {
          return { valid: false, error: 'ZIP code is required' };
     }

     if (!/^\d{5}(?:-\d{4})?$/.test(zipCode)) {
          return {
               valid: false,
               error: 'ZIP code must be in format 12345 or 12345-6789'
          };
     }

     return { valid: true };
};

/**
 * Address validation
 */
export const validateAddress = (address) => {
     const errors = {};

     if (!address.street || address.street.length < 5 || address.street.length > 100) {
          errors.street = 'Street must be between 5 and 100 characters';
     }

     const cityValidation = validateName(address.city, 'City');
     if (!cityValidation.valid) {
          errors.city = cityValidation.error;
     }

     if (!address.state || address.state.length < 2 || address.state.length > 50) {
          errors.state = 'State must be between 2 and 50 characters';
     }

     const zipValidation = validateZipCode(address.zipCode);
     if (!zipValidation.valid) {
          errors.zipCode = zipValidation.error;
     }

     if (!address.country || address.country.length < 2 || address.country.length > 50) {
          errors.country = 'Country must be between 2 and 50 characters';
     }

     return Object.keys(errors).length === 0
          ? { valid: true }
          : { valid: false, errors };
};

/**
 * Credit card validation (Luhn algorithm)
 * Note: This is for basic client-side validation only
 * Actual card data should be tokenized by Stripe
 */
export const validateCardNumber = (cardNumber) => {
     const cleaned = cardNumber.replace(/\D/g, '');

     if (!/^\d{13,19}$/.test(cleaned)) {
          return { valid: false, error: 'Invalid card number length' };
     }

     // Luhn algorithm
     let sum = 0;
     let isEven = false;

     for (let i = cleaned.length - 1; i >= 0; i--) {
          let digit = parseInt(cleaned[i], 10);

          if (isEven) {
               digit *= 2;
               if (digit > 9) {
                    digit -= 9;
               }
          }

          sum += digit;
          isEven = !isEven;
     }

     if (sum % 10 === 0) {
          return { valid: true };
     }

     return { valid: false, error: 'Invalid card number' };
};

/**
 * Expiration date validation
 */
export const validateExpiry = (expiry) => {
     const [month, year] = expiry.split('/').map(x => x.trim());

     if (!month || !year) {
          return { valid: false, error: 'Invalid expiry format (MM/YY)' };
     }

     const monthNum = parseInt(month, 10);
     const yearNum = parseInt(year, 10);

     if (monthNum < 1 || monthNum > 12) {
          return { valid: false, error: 'Invalid month' };
     }

     // Check if card is expired
     const now = new Date();
     const currentYear = now.getFullYear() % 100;
     const currentMonth = now.getMonth() + 1;

     if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
          return { valid: false, error: 'Card is expired' };
     }

     return { valid: true };
};

/**
 * CVV validation
 */
export const validateCVV = (cvv) => {
     const cleaned = cvv.replace(/\D/g, '');

     if (!/^\d{3,4}$/.test(cleaned)) {
          return { valid: false, error: 'CVV must be 3 or 4 digits' };
     }

     return { valid: true };
};

/**
 * Cart item quantity validation
 */
export const validateQuantity = (quantity, maxStock = 1000) => {
     const qty = parseInt(quantity, 10);

     if (!Number.isInteger(qty) || qty < 1) {
          return { valid: false, error: 'Quantity must be at least 1' };
     }

     if (qty > maxStock) {
          return {
               valid: false,
               error: `Quantity cannot exceed available stock (${maxStock})`
          };
     }

     if (qty > 1000) {
          return { valid: false, error: 'Quantity is too large' };
     }

     return { valid: true };
};

/**
 * Form validation helper
 */
export const validateForm = (formData, validationRules) => {
     const errors = {};

     Object.keys(validationRules).forEach(field => {
          const rule = validationRules[field];
          const value = formData[field];
          const validation = rule(value);

          if (!validation.valid) {
               errors[field] = validation.error || validation.errors;
          }
     });

     return {
          valid: Object.keys(errors).length === 0,
          errors,
     };
};

/**
 * Sanitize user input (prevent XSS on frontend)
 */
export const sanitizeInput = (value) => {
     if (typeof value !== 'string') return value;

     const div = document.createElement('div');
     div.textContent = value;
     return div.innerHTML;
};

/**
 * Format price for display (cents to dollars)
 */
export const formatPrice = (priceInCents) => {
     return `$${(priceInCents / 100).toFixed(2)}`;
};
