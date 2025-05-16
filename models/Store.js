const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Address = require('./Address');

const Store = sequelize.define('Store', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    address_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Address,
            key: 'id'
        }
    }
}, {
    tableName: 'store',
    timestamps: false
});

Store.belongsTo(Address, { foreignKey: 'address_id' });

module.exports = Store; 