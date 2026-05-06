import axios from 'axios';

// Create axios instance
const api = axios.create({
     baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
     headers: {
          'Content-Type': 'application/json',
     },
});

// Store for CSRF token
let csrfToken = null;

/**
 * Get CSRF token from server
 */
export const fetchCsrfToken = async () => {
     try {
          const response = await api.get('/csrf-token');
          csrfToken = response.data.csrfToken;
          localStorage.setItem('csrfToken', csrfToken);
          return csrfToken;
     } catch (error) {
          console.error('Failed to fetch CSRF token:', error);
          throw error;
     }
};

/**
 * Get CSRF token from storage or fetch if not available
 */
export const getCsrfToken = async () => {
     if (!csrfToken) {
          csrfToken = localStorage.getItem('csrfToken');
     }

     if (!csrfToken) {
          await fetchCsrfToken();
     }

     return csrfToken;
};

/**
 * Add CSRF token to request headers
 */
api.interceptors.request.use(async (config) => {
     const token = await getCsrfToken();
     if (token) {
          config.headers['X-CSRF-Token'] = token;
     }

     // Add JWT token if available
     const jwtToken = localStorage.getItem('jwtToken');
     if (jwtToken) {
          config.headers['Authorization'] = `Bearer ${jwtToken}`;
     }

     return config;
});

/**
 * Handle response errors
 */
api.interceptors.response.use(
     (response) => response,
     (error) => {
          if (error.response?.status === 401) {
               // Unauthorized - clear tokens and redirect to login
               localStorage.removeItem('jwtToken');
               localStorage.removeItem('csrfToken');
               csrfToken = null;
               window.location.href = '/auth/login';
          }
          return Promise.reject(error);
     }
);

/**
 * Auth API calls
 */
export const authAPI = {
     register: (data) => api.post('/auth/register', data),
     login: (data) => api.post('/auth/login', data),
     getMe: () => api.get('/auth/me'),
};

/**
 * Checkout API calls
 */
export const checkoutAPI = {
     createOrder: (data) => api.post('/checkout/create-order', data),
     getOrder: (orderId) => api.get(`/checkout/order/${orderId}`),
     getOrders: (page = 1, limit = 10) =>
          api.get('/checkout/orders', { params: { page, limit } }),
};

/**
 * Payment API calls
 */
export const paymentAPI = {
     // Stripe
     createStripeIntent: (data) => api.post('/payment/stripe/create-intent', data),
     confirmStripePayment: (data) => api.post('/payment/stripe/confirm', data),

     // PayPal
     createPayPalPayment: (data) => api.post('/payment/paypal/create', data),
     executePayPalPayment: (data) => api.post('/payment/paypal/execute', data),
};

export default api;
