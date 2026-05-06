const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/rateLimiter');
const { csrfProtection } = require('../middleware/csrf');
const { Order, Payment } = require('../models/index');
const { StripePaymentService, PayPalPaymentService } = require('../utils/paymentService');
const { validatePrice } = require('../utils/validation');

/**
 * POST /payment/stripe/create-intent
 * Create a Stripe payment intent for checkout
 * 
 * Body:
 * {
 *   "amount": 5000,
 *   "orderId": 123,
 *   "items": [{"productId": 1, "quantity": 2, "price": 2500}]
 * }
 */
router.post(
     '/stripe/create-intent',
     authenticateToken,
     paymentLimiter,
     csrfProtection,
     validatePrice('amount'),
     body('orderId').isInt({ min: 1 }).withMessage('Invalid order ID'),
     body('items').isArray().withMessage('Items must be an array'),
     async (req, res) => {
          try {
               const errors = validationResult(req);
               if (!errors.isEmpty()) {
                    return res.status(400).json({
                         success: false,
                         errors: errors.array(),
                    });
               }

               const { amount, orderId, items } = req.body;

               // Verify order exists and belongs to user
               const order = await Order.findOne({
                    where: { id: orderId, userId: req.user.id },
               });

               if (!order) {
                    return res.status(404).json({
                         success: false,
                         message: 'Order not found',
                    });
               }

               // Create Stripe payment intent
               const paymentResult = await StripePaymentService.createPaymentIntent(
                    amount,
                    orderId,
                    { userId: req.user.id }
               );

               if (!paymentResult.success) {
                    return res.status(400).json({
                         success: false,
                         message: 'Failed to create payment intent',
                         error: paymentResult.error,
                    });
               }

               res.status(200).json({
                    success: true,
                    clientSecret: paymentResult.clientSecret,
                    paymentIntentId: paymentResult.paymentIntentId,
               });
          } catch (error) {
               console.error('Stripe intent error:', error);
               res.status(500).json({
                    success: false,
                    message: 'Payment processing failed',
               });
          }
     }
);

/**
 * POST /payment/stripe/confirm
 * Confirm Stripe payment after client-side tokenization
 * 
 * Body:
 * {
 *   "paymentIntentId": "pi_...",
 *   "orderId": 123
 * }
 */
router.post(
     '/stripe/confirm',
     authenticateToken,
     paymentLimiter,
     csrfProtection,
     body('paymentIntentId').trim().notEmpty().withMessage('Payment Intent ID required'),
     body('orderId').isInt({ min: 1 }).withMessage('Invalid order ID'),
     async (req, res) => {
          try {
               const errors = validationResult(req);
               if (!errors.isEmpty()) {
                    return res.status(400).json({
                         success: false,
                         errors: errors.array(),
                    });
               }

               const { paymentIntentId, orderId } = req.body;

               // Verify order
               const order = await Order.findOne({
                    where: { id: orderId, userId: req.user.id },
               });

               if (!order) {
                    return res.status(404).json({
                         success: false,
                         message: 'Order not found',
                    });
               }

               // Confirm payment
               const paymentResult = await StripePaymentService.confirmPayment(paymentIntentId);

               if (!paymentResult.success) {
                    // Update order payment status
                    await order.update({ paymentStatus: 'failed' });

                    return res.status(400).json({
                         success: false,
                         message: 'Payment confirmation failed',
                         status: paymentResult.status,
                    });
               }

               // Create payment record
               await Payment.create({
                    orderId: orderId,
                    processor: 'stripe',
                    transactionId: paymentResult.transactionId,
                    amount: paymentResult.amount,
                    status: 'succeeded',
                    metadata: paymentResult.metadata,
               });

               // Update order
               await order.update({
                    paymentStatus: 'completed',
                    paymentId: paymentResult.transactionId,
                    status: 'processing',
               });

               res.status(200).json({
                    success: true,
                    message: 'Payment successful',
                    orderId: orderId,
                    transactionId: paymentResult.transactionId,
               });
          } catch (error) {
               console.error('Stripe confirmation error:', error);
               res.status(500).json({
                    success: false,
                    message: 'Payment confirmation failed',
               });
          }
     }
);

/**
 * POST /payment/paypal/create
 * Create PayPal payment
 * 
 * Body:
 * {
 *   "amount": 5000,
 *   "orderId": 123,
 *   "returnUrl": "http://localhost:3000/checkout/success",
 *   "cancelUrl": "http://localhost:3000/checkout/cancel"
 * }
 */
router.post(
     '/paypal/create',
     authenticateToken,
     paymentLimiter,
     csrfProtection,
     validatePrice('amount'),
     body('orderId').isInt({ min: 1 }).withMessage('Invalid order ID'),
     body('returnUrl').isURL().withMessage('Invalid return URL'),
     body('cancelUrl').isURL().withMessage('Invalid cancel URL'),
     async (req, res) => {
          try {
               const errors = validationResult(req);
               if (!errors.isEmpty()) {
                    return res.status(400).json({
                         success: false,
                         errors: errors.array(),
                    });
               }

               const { amount, orderId, returnUrl, cancelUrl } = req.body;

               // Verify order
               const order = await Order.findOne({
                    where: { id: orderId, userId: req.user.id },
               });

               if (!order) {
                    return res.status(404).json({
                         success: false,
                         message: 'Order not found',
                    });
               }

               // Create PayPal payment
               const paymentResult = await PayPalPaymentService.createPayment(
                    amount,
                    orderId,
                    {
                         return_url: returnUrl,
                         cancel_url: cancelUrl,
                    }
               );

               if (!paymentResult.success) {
                    return res.status(400).json({
                         success: false,
                         message: 'Failed to create PayPal payment',
                         error: paymentResult.error,
                    });
               }

               res.status(200).json({
                    success: true,
                    paymentId: paymentResult.paymentId,
                    approvalUrl: paymentResult.approvalUrl,
               });
          } catch (error) {
               console.error('PayPal creation error:', error);
               res.status(500).json({
                    success: false,
                    message: 'PayPal payment creation failed',
               });
          }
     }
);

/**
 * POST /payment/paypal/execute
 * Execute PayPal payment after user approval
 * 
 * Body:
 * {
 *   "paymentId": "PAY-...",
 *   "payerId": "...",
 *   "orderId": 123
 * }
 */
router.post(
     '/paypal/execute',
     authenticateToken,
     paymentLimiter,
     csrfProtection,
     body('paymentId').matches(/^PAY-[0-9A-Z]+$/).withMessage('Invalid PayPal payment ID'),
     body('payerId').notEmpty().withMessage('Payer ID required'),
     body('orderId').isInt({ min: 1 }).withMessage('Invalid order ID'),
     async (req, res) => {
          try {
               const errors = validationResult(req);
               if (!errors.isEmpty()) {
                    return res.status(400).json({
                         success: false,
                         errors: errors.array(),
                    });
               }

               const { paymentId, payerId, orderId } = req.body;

               // Verify order
               const order = await Order.findOne({
                    where: { id: orderId, userId: req.user.id },
               });

               if (!order) {
                    return res.status(404).json({
                         success: false,
                         message: 'Order not found',
                    });
               }

               // Execute PayPal payment
               const paymentResult = await PayPalPaymentService.executePayment(paymentId, payerId);

               if (!paymentResult.success) {
                    // Update order payment status
                    await order.update({ paymentStatus: 'failed' });

                    return res.status(400).json({
                         success: false,
                         message: 'PayPal payment execution failed',
                         error: paymentResult.error,
                    });
               }

               // Create payment record
               await Payment.create({
                    orderId: orderId,
                    processor: 'paypal',
                    transactionId: paymentResult.transactionId,
                    amount: Math.round(parseFloat(paymentResult.amount) * 100), // Convert to cents
                    status: paymentResult.status === 'completed' ? 'succeeded' : 'pending',
                    metadata: { payerId },
               });

               // Update order
               await order.update({
                    paymentStatus: paymentResult.status === 'completed' ? 'completed' : 'processing',
                    paymentId: paymentResult.transactionId,
                    status: 'processing',
               });

               res.status(200).json({
                    success: true,
                    message: 'PayPal payment successful',
                    orderId: orderId,
                    transactionId: paymentResult.transactionId,
               });
          } catch (error) {
               console.error('PayPal execution error:', error);
               res.status(500).json({
                    success: false,
                    message: 'PayPal payment execution failed',
               });
          }
     }
);

module.exports = router;
