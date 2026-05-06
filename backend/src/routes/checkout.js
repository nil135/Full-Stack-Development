const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { csrfProtection } = require('../middleware/csrf');
const { Order, Product } = require('../models/index');
const {
     validateAddress,
     validatePrice,
     handleValidationErrors,
     sanitizeInput,
} = require('../utils/validation');

/**
 * POST /checkout/create-order
 * Create an order from cart items
 * 
 * Body:
 * {
 *   "items": [
 *     { "productId": 1, "quantity": 2 },
 *     { "productId": 2, "quantity": 1 }
 *   ],
 *   "shippingAddress": {
 *     "street": "123 Main St",
 *     "city": "New York",
 *     "state": "NY",
 *     "zipCode": "10001",
 *     "country": "USA"
 *   },
 *   "billingAddress": { ... } (optional, defaults to shipping)
 * }
 */
router.post(
     '/create-order',
     authenticateToken,
     csrfProtection,
     body('items').isArray({ min: 1 }).withMessage('Items array required'),
     body('items.*.productId').isInt({ min: 1 }).withMessage('Invalid product ID'),
     body('items.*.quantity').isInt({ min: 1, max: 1000 }).withMessage('Invalid quantity'),
     validateAddress(),
     async (req, res) => {
          try {
               const errors = validationResult(req);
               if (!errors.isEmpty()) {
                    return res.status(400).json({
                         success: false,
                         message: 'Validation failed',
                         errors: errors.array(),
                    });
               }

               const { items, shippingAddress, billingAddress } = req.body;

               // Fetch product details and validate
               let totalAmount = 0;
               const orderItems = [];

               for (const item of items) {
                    const product = await Product.findByPk(item.productId);

                    if (!product) {
                         return res.status(404).json({
                              success: false,
                              message: `Product ${item.productId} not found`,
                         });
                    }

                    if (!product.isActive) {
                         return res.status(400).json({
                              success: false,
                              message: `Product ${product.name} is no longer available`,
                         });
                    }

                    if (product.stock < item.quantity) {
                         return res.status(400).json({
                              success: false,
                              message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
                         });
                    }

                    const itemTotal = product.price * item.quantity;
                    totalAmount += itemTotal;

                    orderItems.push({
                         productId: product.id,
                         name: product.name,
                         price: product.price,
                         quantity: item.quantity,
                         total: itemTotal,
                    });
               }

               // Validate total amount
               if (totalAmount < 1 || totalAmount > 999999999) {
                    return res.status(400).json({
                         success: false,
                         message: 'Invalid order total',
                    });
               }

               // Generate order number
               const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

               // Create order
               const order = await Order.create({
                    orderNumber,
                    userId: req.user.id,
                    totalAmount,
                    shippingAddress: {
                         street: sanitizeInput(shippingAddress.street),
                         city: sanitizeInput(shippingAddress.city),
                         state: sanitizeInput(shippingAddress.state),
                         zipCode: sanitizeInput(shippingAddress.zipCode),
                         country: sanitizeInput(shippingAddress.country),
                    },
                    billingAddress: billingAddress
                         ? {
                              street: sanitizeInput(billingAddress.street),
                              city: sanitizeInput(billingAddress.city),
                              state: sanitizeInput(billingAddress.state),
                              zipCode: sanitizeInput(billingAddress.zipCode),
                              country: sanitizeInput(billingAddress.country),
                         }
                         : null,
                    items: orderItems,
                    status: 'pending',
                    paymentStatus: 'pending',
               });

               res.status(201).json({
                    success: true,
                    message: 'Order created successfully',
                    order: {
                         id: order.id,
                         orderNumber: order.orderNumber,
                         totalAmount: order.totalAmount,
                         items: order.items,
                         status: order.status,
                    },
               });
          } catch (error) {
               console.error('Order creation error:', error);
               res.status(500).json({
                    success: false,
                    message: 'Failed to create order',
               });
          }
     }
);

/**
 * GET /checkout/order/:orderId
 * Get order details
 */
router.get('/order/:orderId', authenticateToken, async (req, res) => {
     try {
          const { orderId } = req.params;

          // Validate order ID format
          if (!Number.isInteger(parseInt(orderId))) {
               return res.status(400).json({
                    success: false,
                    message: 'Invalid order ID format',
               });
          }

          const order = await Order.findOne({
               where: { id: orderId, userId: req.user.id },
          });

          if (!order) {
               return res.status(404).json({
                    success: false,
                    message: 'Order not found',
               });
          }

          res.status(200).json({
               success: true,
               order: {
                    id: order.id,
                    orderNumber: order.orderNumber,
                    totalAmount: order.totalAmount,
                    items: order.items,
                    shippingAddress: order.shippingAddress,
                    billingAddress: order.billingAddress,
                    status: order.status,
                    paymentStatus: order.paymentStatus,
                    paymentMethod: order.paymentMethod,
                    createdAt: order.createdAt,
               },
          });
     } catch (error) {
          console.error('Order fetch error:', error);
          res.status(500).json({
               success: false,
               message: 'Failed to fetch order',
          });
     }
});

/**
 * GET /checkout/orders
 * Get all orders for authenticated user
 */
router.get('/orders', authenticateToken, async (req, res) => {
     try {
          const { page = 1, limit = 10 } = req.query;

          // Validate pagination
          const pageNum = Math.max(1, parseInt(page));
          const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
          const offset = (pageNum - 1) * limitNum;

          const { count, rows } = await Order.findAndCountAll({
               where: { userId: req.user.id },
               order: [['createdAt', 'DESC']],
               limit: limitNum,
               offset,
          });

          res.status(200).json({
               success: true,
               orders: rows.map(order => ({
                    id: order.id,
                    orderNumber: order.orderNumber,
                    totalAmount: order.totalAmount,
                    status: order.status,
                    paymentStatus: order.paymentStatus,
                    createdAt: order.createdAt,
               })),
               pagination: {
                    total: count,
                    page: pageNum,
                    limit: limitNum,
                    pages: Math.ceil(count / limitNum),
               },
          });
     } catch (error) {
          console.error('Orders fetch error:', error);
          res.status(500).json({
               success: false,
               message: 'Failed to fetch orders',
          });
     }
});

module.exports = router;
