const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ShippingMethod = sequelize.define('ShippingMethod', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'shipping_method',
    timestamps: false
});

module.exports = ShippingMethod; 