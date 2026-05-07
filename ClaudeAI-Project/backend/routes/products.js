const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Get all products
router.get('/', productController.getAllProducts);

// Get product by ID
router.get('/:id', productController.getProductById);

// Create product (admin only)
router.post('/', productController.createProduct);

// Update product (admin only)
router.put('/:id', productController.updateProduct);

// Delete product (admin only)
router.delete('/:id', productController.deleteProduct);

module.exports = router;
