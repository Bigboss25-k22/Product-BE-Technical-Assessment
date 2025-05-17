const sequelize = require('../config/db');
const User = require('./User');
const Admin = require('./Admin');
const Country = require('./Country');
const Address = require('./Address');
const UserAddress = require('./UserAddress');
const ProductCategory = require('./ProductCategory');
const Product = require('./Product');
const ProductItem = require('./ProductItem');
const Variation = require('./Variation');
const VariationOption = require('./VariationOption');
const ProductConfiguration = require('./ProductConfiguration');
const Store = require('./Store');
const StoreInventory = require('./StoreInventory');
const Promotion = require('./Promotion');
const PromotionCategory = require('./PromotionCategory');
const ShoppingCart = require('./ShoppingCart');
const ShoppingCartItem = require('./ShoppingCartItem');
const Voucher = require('./Voucher');
const UserVoucher = require('./UserVoucher');
const PaymentType = require('./PaymentType');
const UserPaymentMethod = require('./UserPaymentMethod');
const ShippingMethod = require('./ShippingMethod');
const OrderStatus = require('./OrderStatus');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const OrderVoucher = require('./OrderVoucher');
const OrderFee = require('./OrderFee');
const UserReview = require('./UserReview');

// Define associations
User.hasMany(Admin, { foreignKey: 'user_id' });
User.hasMany(UserAddress, { foreignKey: 'user_id' });
User.hasMany(ShoppingCart, { foreignKey: 'user_id' });
User.hasMany(UserVoucher, { foreignKey: 'user_id' });
User.hasMany(UserPaymentMethod, { foreignKey: 'user_id' });

Admin.hasMany(ProductCategory, { foreignKey: 'updated_by' });

Country.hasMany(Address, { foreignKey: 'country_id' });

Address.hasMany(UserAddress, { foreignKey: 'address_id' });
Address.hasMany(Store, { foreignKey: 'address_id' });

ProductCategory.hasMany(Product, { foreignKey: 'category_id' });
ProductCategory.hasMany(Variation, { foreignKey: 'category_id' });
ProductCategory.hasMany(PromotionCategory, { foreignKey: 'category_id' });

Product.hasMany(ProductItem, { foreignKey: 'product_id' });

ProductItem.hasMany(ProductConfiguration, { foreignKey: 'product_item_id' });
ProductItem.hasMany(StoreInventory, { foreignKey: 'product_item_id' });
ProductItem.hasMany(ShoppingCartItem, { foreignKey: 'product_item_id' });

Variation.hasMany(VariationOption, { foreignKey: 'variation_id' });

VariationOption.hasMany(ProductConfiguration, { foreignKey: 'variation_option_id' });

Store.hasMany(StoreInventory, { foreignKey: 'store_id' });

Promotion.hasMany(PromotionCategory, { foreignKey: 'promotion_id' });

ShoppingCart.hasMany(ShoppingCartItem, { foreignKey: 'cart_id' });

Voucher.hasMany(UserVoucher, { foreignKey: 'voucher_id' });

PaymentType.hasMany(UserPaymentMethod, { foreignKey: 'payment_type_id' });

module.exports = {
    sequelize,
    User,
    Admin,
    Country,
    Address,
    UserAddress,
    ProductCategory,
    Product,
    ProductItem,
    Variation,
    VariationOption,
    ProductConfiguration,
    Store,
    StoreInventory,
    Promotion,
    PromotionCategory,
    ShoppingCart,
    ShoppingCartItem,
    Voucher,
    UserVoucher,
    PaymentType,
    UserPaymentMethod,
    ShippingMethod,
    OrderStatus,
    Order,
    OrderItem,
    OrderVoucher,
    OrderFee,
    UserReview
}; 