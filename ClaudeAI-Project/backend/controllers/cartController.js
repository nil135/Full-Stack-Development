const Cart = require('../models/Cart');

const cartController = {
     getCartItems: (req, res) => {
          try {
               const cartId = req.query.cartId || 'default';
               const cart = Cart.getCart(cartId);
               res.json(cart);
          } catch (error) {
               res.status(500).json({ error: 'Failed to fetch cart' });
          }
     },

     addToCart: (req, res) => {
          try {
               const cartId = req.body.cartId || 'default';
               const { item } = req.body;
               const cart = Cart.addItem(cartId, item);
               res.json(cart);
          } catch (error) {
               res.status(500).json({ error: 'Failed to add item to cart' });
          }
     },

     removeFromCart: (req, res) => {
          try {
               const cartId = req.query.cartId || 'default';
               const itemId = parseInt(req.params.id);
               const cart = Cart.removeItem(cartId, itemId);
               res.json(cart);
          } catch (error) {
               res.status(500).json({ error: 'Failed to remove item from cart' });
          }
     },

     updateQuantity: (req, res) => {
          try {
               const cartId = req.query.cartId || 'default';
               const itemId = parseInt(req.params.id);
               const { quantity } = req.body;
               // Implementation for updating quantity
               res.json({ message: 'Quantity updated' });
          } catch (error) {
               res.status(500).json({ error: 'Failed to update quantity' });
          }
     },

     clearCart: (req, res) => {
          try {
               const cartId = req.query.cartId || 'default';
               const cart = Cart.clearCart(cartId);
               res.json(cart);
          } catch (error) {
               res.status(500).json({ error: 'Failed to clear cart' });
          }
     },
};

module.exports = cartController;
