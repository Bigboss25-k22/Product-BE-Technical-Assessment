const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Promotion = require('./Promotion');
const ProductCategory = require('./ProductCategory');

const PromotionCategory = sequelize.define('PromotionCategory', {
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
    promotion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Promotion,
            key: 'id'
        }
    }
}, {
    tableName: 'promotion_category',
    timestamps: false
});

PromotionCategory.belongsTo(Promotion, { foreignKey: 'promotion_id' });
PromotionCategory.belongsTo(ProductCategory, { foreignKey: 'category_id' });

module.exports = PromotionCategory; 