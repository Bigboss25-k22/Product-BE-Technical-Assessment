const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Country = require('./Country');

const Address = sequelize.define('Address', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    unit_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    street_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address_line1: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address_line2: {
        type: DataTypes.STRING,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    region: {
        type: DataTypes.STRING,
        allowNull: true
    },
    postal_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Country,
            key: 'id'
        }
    }
}, {
    tableName: 'address',
    timestamps: false
});

Address.belongsTo(Country, { foreignKey: 'country_id' });

module.exports = Address; 