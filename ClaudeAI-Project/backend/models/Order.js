// Order Model - Mock database
const orders = new Map();
let orderId = 1000;

const Order = {
     getAllOrders: () => {
          return Array.from(orders.values());
     },

     getOrderById: (id) => {
          return orders.get(id);
     },

     createOrder: (orderData) => {
          const id = orderId++;
          const order = {
               id,
               ...orderData,
               status: 'pending',
               createdAt: new Date(),
          };
          orders.set(id, order);
          return order;
     },

     updateStatus: (id, status) => {
          const order = orders.get(id);
          if (order) {
               order.status = status;
               orders.set(id, order);
          }
          return order;
     },

     cancelOrder: (id) => {
          return orders.delete(id);
     },
};

module.exports = Order;
