// Utility functions for common operations
export const formatPrice = (price) => {
     return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
     }).format(price);
};

export const calculateDiscount = (original, discount) => {
     return original - (original * discount) / 100;
};

export const calculateTax = (price, taxRate = 0.08) => {
     return price * taxRate;
};

export const validateEmail = (email) => {
     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     return re.test(email);
};

export const validatePhoneNumber = (phone) => {
     const re = /^\+?1?\d{9,15}$/;
     return re.test(phone);
};
