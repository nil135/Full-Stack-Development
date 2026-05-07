const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Get cart items
router.get('/', cartController.getCartItems);

// Add item to cart
router.post('/add', cartController.addToCart);

// Remove item from cart
router.delete('/remove/:id', cartController.removeFromCart);

// Update cart item quantity
router.put('/update/:id', cartController.updateQuantity);

// Clear cart
router.delete('/', cartController.clearCart);

module.exports = router;
