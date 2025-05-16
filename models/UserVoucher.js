const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Voucher = require('./Voucher');

const UserVoucher = sequelize.define('UserVoucher', {
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
    voucher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Voucher,
            key: 'id'
        }
    },
    is_used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'user_voucher',
    timestamps: false
});

UserVoucher.belongsTo(User, { foreignKey: 'user_id' });
UserVoucher.belongsTo(Voucher, { foreignKey: 'voucher_id' });

module.exports = UserVoucher; 