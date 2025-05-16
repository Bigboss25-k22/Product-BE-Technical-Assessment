const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Voucher = sequelize.define('Voucher', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    discount_type: {
        type: DataTypes.ENUM('fixed', 'percent'),
        allowNull: false
    },
    discount_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    min_order_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    max_discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'voucher',
    timestamps: false
});

module.exports = Voucher; 