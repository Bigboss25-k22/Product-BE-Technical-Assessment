const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const PaymentType = require('./PaymentType');

const UserPaymentMethod = sequelize.define('UserPaymentMethod', {
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
    payment_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: PaymentType,
            key: 'id'
        }
    },
    provider: {
        type: DataTypes.STRING,
        allowNull: false
    },
    account_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiry_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'user_payment_method',
    timestamps: false
});

UserPaymentMethod.belongsTo(User, { foreignKey: 'user_id' });
UserPaymentMethod.belongsTo(PaymentType, { foreignKey: 'payment_type_id' });

module.exports = UserPaymentMethod; 