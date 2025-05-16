const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Country = sequelize.define('Country', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    country_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'country',
    timestamps: false
});

module.exports = Country; 