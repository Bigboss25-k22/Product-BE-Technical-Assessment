const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const ShoppingCart = require('./ShoppingCart');
const ProductItem = require('./ProductItem');

const ShoppingCartItem = sequelize.define('ShoppingCartItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cart_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ShoppingCart,
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
        allowNull: false,
        defaultValue: 1
    }
}, {
    tableName: 'shopping_cart_item',
    timestamps: false
});

ShoppingCartItem.belongsTo(ShoppingCart, { foreignKey: 'cart_id' });
ShoppingCartItem.belongsTo(ProductItem, { foreignKey: 'product_item_id' });

module.exports = ShoppingCartItem; 