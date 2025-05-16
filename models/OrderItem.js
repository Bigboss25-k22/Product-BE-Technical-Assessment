const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const ProductItem = require('./ProductItem');
const Order = require('./Order');

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Order,
            key: 'id'
        }
    },
    product_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ProductItem,
            key: 'id'
        }
    },
    qty: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'order_line',
    timestamps: false
});

// Define associations
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
OrderItem.belongsTo(ProductItem, { foreignKey: 'product_item_id' });

module.exports = OrderItem; 