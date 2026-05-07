const Order = require('../models/Order');

const orderController = {
     getAllOrders: (req, res) => {
          try {
               const orders = Order.getAllOrders();
               res.json(orders);
          } catch (error) {
               res.status(500).json({ error: 'Failed to fetch orders' });
          }
     },

     getOrderById: (req, res) => {
          try {
               const order = Order.getOrderById(parseInt(req.params.id));
               if (!order) {
                    return res.status(404).json({ error: 'Order not found' });
               }
               res.json(order);
          } catch (error) {
               res.status(500).json({ error: 'Failed to fetch order' });
          }
     },

     createOrder: (req, res) => {
          try {
               const order = Order.createOrder(req.body);
               res.status(201).json(order);
          } catch (error) {
               res.status(500).json({ error: 'Failed to create order' });
          }
     },

     updateOrderStatus: (req, res) => {
          try {
               const { status } = req.body;
               const order = Order.updateStatus(parseInt(req.params.id), status);
               if (!order) {
                    return res.status(404).json({ error: 'Order not found' });
               }
               res.json(order);
          } catch (error) {
               res.status(500).json({ error: 'Failed to update order' });
          }
     },

     cancelOrder: (req, res) => {
          try {
               const success = Order.cancelOrder(parseInt(req.params.id));
               if (!success) {
                    return res.status(404).json({ error: 'Order not found' });
               }
               res.json({ message: 'Order cancelled' });
          } catch (error) {
               res.status(500).json({ error: 'Failed to cancel order' });
          }
     },
};

module.exports = orderController;
