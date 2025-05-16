const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const ShoppingCart = sequelize.define('ShoppingCart', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    tableName: 'shopping_cart',
    timestamps: false
});

ShoppingCart.belongsTo(User, { foreignKey: 'user_id' });

module.exports = ShoppingCart; 