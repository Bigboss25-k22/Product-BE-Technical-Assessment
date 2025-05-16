const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const ProductCategory = require('./ProductCategory');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ProductCategory,
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    product_image: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'product',
    timestamps: false
});

Product.belongsTo(ProductCategory, { foreignKey: 'category_id' });

module.exports = Product; 