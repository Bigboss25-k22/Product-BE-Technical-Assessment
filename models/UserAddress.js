const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Address = require('./Address');

const UserAddress = sequelize.define('UserAddress', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    address_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Address,
            key: 'id'
        }
    },
    is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'user_address',
    timestamps: false
});

UserAddress.belongsTo(User, { foreignKey: 'user_id' });
UserAddress.belongsTo(Address, { foreignKey: 'address_id' });

module.exports = UserAddress; 