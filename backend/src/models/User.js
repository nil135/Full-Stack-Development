const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
     id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
     },
     firstName: {
          type: DataTypes.STRING(100),
          allowNull: false,
          validate: {
               len: [2, 100],
               isAlpha: true,
          },
     },
     lastName: {
          type: DataTypes.STRING(100),
          allowNull: false,
          validate: {
               len: [2, 100],
               isAlpha: true,
          },
     },
     email: {
          type: DataTypes.STRING(254),
          allowNull: false,
          unique: true,
          validate: {
               isEmail: true,
          },
          index: true,
     },
     password: {
          type: DataTypes.STRING(255), // Hashed password with bcrypt
          allowNull: false,
          validate: {
               len: [60, 60], // bcrypt hash length
          },
     },
     phone: {
          type: DataTypes.STRING(20),
          allowNull: true,
     },
     isEmailVerified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
     },
     emailVerificationToken: {
          type: DataTypes.STRING(255),
          allowNull: true,
     },
     emailVerificationTokenExpires: {
          type: DataTypes.DATE,
          allowNull: true,
     },
     passwordResetToken: {
          type: DataTypes.STRING(255),
          allowNull: true,
     },
     passwordResetTokenExpires: {
          type: DataTypes.DATE,
          allowNull: true,
     },
     lastLoginAt: {
          type: DataTypes.DATE,
          allowNull: true,
     },
     loginAttempts: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
     },
     lockUntil: {
          type: DataTypes.DATE,
          allowNull: true,
     },
     isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
     },
}, {
     tableName: 'users',
     timestamps: true,
     underscored: true,
});

/**
 * Hash password before saving
 */
User.beforeCreate(async (user) => {
     const salt = await bcrypt.genSalt(12);
     user.password = await bcrypt.hash(user.password, salt);
});

/**
 * Compare password for authentication
 */
User.prototype.validatePassword = async function (password) {
     return bcrypt.compare(password, this.password);
};

/**
 * Check if account is locked
 */
User.prototype.isLocked = function () {
     return this.lockUntil && this.lockUntil > Date.now();
};

/**
 * Increment login attempts
 */
User.prototype.incLoginAttempts = async function () {
     // Reset if lock has expired
     if (this.lockUntil && this.lockUntil < Date.now()) {
          return this.update({
               loginAttempts: 1,
               lockUntil: null,
          });
     }

     // Increment login attempts, lock after 5 attempts for 30 minutes
     const updates = { loginAttempts: this.loginAttempts + 1 };

     if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
          updates.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
     }

     return this.update(updates);
};

/**
 * Reset login attempts
 */
User.prototype.resetLoginAttempts = async function () {
     return this.update({
          loginAttempts: 0,
          lockUntil: null,
          lastLoginAt: new Date(),
     });
};

module.exports = User;
