const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Admin = require('./Admin');

const ProductCategory = sequelize.define('ProductCategory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    parent_category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'product_category',
            key: 'id'
        }
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    discount_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Admin,
            key: 'id'
        }
    }
}, {
    tableName: 'product_category',
    timestamps: false
});

ProductCategory.belongsTo(ProductCategory, { as: 'parent', foreignKey: 'parent_category_id' });
ProductCategory.belongsTo(Admin, { foreignKey: 'updated_by' });

module.exports = ProductCategory; 