const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrderVoucher = sequelize.define('OrderVoucher', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    voucher_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    applied_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'order_voucher',
    timestamps: false
});

module.exports = OrderVoucher; 