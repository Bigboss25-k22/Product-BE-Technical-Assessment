const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Product = require('./Product');

const ProductItem = sequelize.define('ProductItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Product,
            key: 'id'
        }
    },
    SKU: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    qty_in_stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    product_image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'product_item',
    timestamps: false
});

ProductItem.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = ProductItem; 