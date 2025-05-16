const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Store = require('./Store');
const ProductItem = require('./ProductItem');

const StoreInventory = sequelize.define('StoreInventory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    store_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Store,
            key: 'id'
        }
    },
    product_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ProductItem,
            key: 'id'
        }
    },
    qty_in_stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'store_inventory',
    timestamps: false
});

StoreInventory.belongsTo(Store, { foreignKey: 'store_id' });
StoreInventory.belongsTo(ProductItem, { foreignKey: 'product_item_id' });

module.exports = StoreInventory; 