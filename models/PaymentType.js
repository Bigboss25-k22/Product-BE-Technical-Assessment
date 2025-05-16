const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PaymentType = sequelize.define('PaymentType', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'payment_type',
    timestamps: false
});

module.exports = PaymentType; 