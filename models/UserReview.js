const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserReview = sequelize.define('UserReview', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ordered_product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rating_value: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'user_review',
    timestamps: false
});

module.exports = UserReview; 