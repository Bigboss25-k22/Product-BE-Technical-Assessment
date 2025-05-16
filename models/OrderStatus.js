const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrderStatus = sequelize.define('OrderStatus', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'order_status',
    timestamps: false
});

module.exports = OrderStatus; 