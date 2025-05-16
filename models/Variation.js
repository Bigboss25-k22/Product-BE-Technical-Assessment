const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const ProductCategory = require('./ProductCategory');

const Variation = sequelize.define('Variation', {
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
    }
}, {
    tableName: 'variation',
    timestamps: false
});

Variation.belongsTo(ProductCategory, { foreignKey: 'category_id' });

module.exports = Variation; 