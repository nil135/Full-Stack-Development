const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome endpoint
app.get('/', (req, res) => {
     res.json({
          message: '🛍️ EcomStore API Server',
          status: 'Server is running',
          version: '1.0.0',
          availableEndpoints: {
               products: '/api/products',
               cart: '/api/cart',
               orders: '/api/orders',
               health: '/api/health'
          }
     });
});

// API welcome endpoint
app.get('/api', (req, res) => {
     res.json({
          message: '🛍️ EcomStore API',
          endpoints: {
               products: {
                    get_all: 'GET /api/products',
                    get_one: 'GET /api/products/:id',
                    create: 'POST /api/products',
                    update: 'PUT /api/products/:id',
                    delete: 'DELETE /api/products/:id'
               },
               cart: {
                    get_items: 'GET /api/cart',
                    add_item: 'POST /api/cart/add',
                    remove_item: 'DELETE /api/cart/remove/:id',
                    update_quantity: 'PUT /api/cart/update/:id',
                    clear: 'DELETE /api/cart'
               },
               orders: {
                    get_all: 'GET /api/orders',
                    get_one: 'GET /api/orders/:id',
                    create: 'POST /api/orders',
                    update_status: 'PUT /api/orders/:id/status',
                    cancel: 'DELETE /api/orders/:id'
               },
               health: 'GET /api/health'
          }
     });
});

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

// Health check endpoint
app.get('/api/health', (req, res) => {
     res.json({ status: 'Server is running', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
     res.status(404).json({
          error: 'Route not found',
          message: 'Check available endpoints at http://localhost:5000/api'
     });
});

// Error handler
app.use((err, req, res, next) => {
     console.error(err.stack);
     res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
     console.log(`🚀 Server running on http://localhost:${PORT}`);
     console.log(`📦 API available at http://localhost:${PORT}/api`);
});
