const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
     id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
     },
     name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          validate: {
               len: [3, 255],
          },
     },
     description: {
          type: DataTypes.TEXT,
          allowNull: true,
     },
     price: {
          type: DataTypes.INTEGER, // Stored in cents
          allowNull: false,
          validate: {
               min: 1,
               isInt: true,
          },
     },
     category: {
          type: DataTypes.STRING(100),
          allowNull: false,
     },
     sku: {
          type: DataTypes.STRING(50),
          unique: true,
          allowNull: false,
     },
     stock: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          validate: {
               min: 0,
               isInt: true,
          },
     },
     images: {
          type: DataTypes.JSON,
          defaultValue: [],
     },
     isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
     },
}, {
     tableName: 'products',
     timestamps: true,
     underscored: true,
});

const Order = sequelize.define('Order', {
     id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
     },
     orderNumber: {
          type: DataTypes.STRING(50),
          unique: true,
          allowNull: false,
          index: true,
     },
     userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          index: true,
     },
     status: {
          type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
          defaultValue: 'pending',
     },
     totalAmount: {
          type: DataTypes.INTEGER, // In cents
          allowNull: false,
          validate: {
               min: 1,
          },
     },
     shippingAddress: {
          type: DataTypes.JSON,
          allowNull: false,
     },
     billingAddress: {
          type: DataTypes.JSON,
          allowNull: true,
     },
     items: {
          type: DataTypes.JSON,
          allowNull: false,
     },
     paymentMethod: {
          type: DataTypes.ENUM('stripe', 'paypal'),
          allowNull: false,
     },
     paymentId: {
          type: DataTypes.STRING(255), // Stripe charge ID or PayPal transaction ID
          allowNull: true,
          unique: true,
     },
     paymentStatus: {
          type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded'),
          defaultValue: 'pending',
     },
     notes: {
          type: DataTypes.TEXT,
          allowNull: true,
     },
}, {
     tableName: 'orders',
     timestamps: true,
     underscored: true,
});

const Payment = sequelize.define('Payment', {
     id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
     },
     orderId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: true,
          index: true,
     },
     processor: {
          type: DataTypes.ENUM('stripe', 'paypal'),
          allowNull: false,
     },
     transactionId: {
          type: DataTypes.STRING(255),
          unique: true,
          allowNull: false,
          index: true,
     },
     amount: {
          type: DataTypes.INTEGER, // In cents
          allowNull: false,
     },
     currency: {
          type: DataTypes.STRING(3),
          defaultValue: 'USD',
     },
     status: {
          type: DataTypes.ENUM('pending', 'processing', 'succeeded', 'failed', 'refunded'),
          defaultValue: 'pending',
     },
     metadata: {
          type: DataTypes.JSON,
          defaultValue: {},
     },
}, {
     tableName: 'payments',
     timestamps: true,
     underscored: true,
});

module.exports = {
     Product,
     Order,
     Payment,
};
