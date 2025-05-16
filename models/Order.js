const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    order_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    payment_method_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    shipping_method_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    shipping_address: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    order_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    order_status: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'shop_order',
    timestamps: false
});

module.exports = Order; 