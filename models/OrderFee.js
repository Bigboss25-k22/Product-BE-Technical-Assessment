const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrderFee = sequelize.define('OrderFee', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('shipping', 'tax', 'service', 'handling', 'discount', 'voucher'),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'order_fee',
    timestamps: false
});

module.exports = OrderFee; 