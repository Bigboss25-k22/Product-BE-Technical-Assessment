const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Variation = require('./Variation');

const VariationOption = sequelize.define('VariationOption', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    variation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Variation,
            key: 'id'
        }
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'variation_option',
    timestamps: false
});

VariationOption.belongsTo(Variation, { foreignKey: 'variation_id' });

module.exports = VariationOption; 