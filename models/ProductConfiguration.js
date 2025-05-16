const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const ProductItem = require('./ProductItem');
const VariationOption = require('./VariationOption');

const ProductConfiguration = sequelize.define('ProductConfiguration', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ProductItem,
            key: 'id'
        }
    },
    variation_option_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: VariationOption,
            key: 'id'
        }
    }
}, {
    tableName: 'product_configuration',
    timestamps: false
});

ProductConfiguration.belongsTo(ProductItem, { foreignKey: 'product_item_id' });
ProductConfiguration.belongsTo(VariationOption, { foreignKey: 'variation_option_id' });

module.exports = ProductConfiguration; 