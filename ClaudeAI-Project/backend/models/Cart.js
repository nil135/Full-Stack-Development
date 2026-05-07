// Cart Model - Mock database
const carts = new Map();

const Cart = {
     getCart: (cartId) => {
          return carts.get(cartId) || { items: [], total: 0 };
     },

     addItem: (cartId, item) => {
          const cart = carts.get(cartId) || { items: [], total: 0 };
          const existingItem = cart.items.find((i) => i.id === item.id);

          if (existingItem) {
               existingItem.quantity += item.quantity;
          } else {
               cart.items.push(item);
          }

          cart.total = cart.items.reduce(
               (sum, i) => sum + i.price * i.quantity,
               0
          );
          carts.set(cartId, cart);
          return cart;
     },

     removeItem: (cartId, itemId) => {
          const cart = carts.get(cartId) || { items: [], total: 0 };
          cart.items = cart.items.filter((i) => i.id !== itemId);
          cart.total = cart.items.reduce(
               (sum, i) => sum + i.price * i.quantity,
               0
          );
          carts.set(cartId, cart);
          return cart;
     },

     clearCart: (cartId) => {
          carts.delete(cartId);
          return { items: [], total: 0 };
     },
};

module.exports = Cart;
