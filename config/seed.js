const sequelize = require('./db');
const Country = require('../models/Country');
const Address = require('../models/Address');
const User = require('../models/User');
const Admin = require('../models/Admin');
const OrderStatus = require('../models/OrderStatus');
const PaymentType = require('../models/PaymentType');
const ShippingMethod = require('../models/ShippingMethod');
const ProductCategory = require('../models/ProductCategory');
const Store = require('../models/Store');
const Product = require('../models/Product');
const ProductItem = require('../models/ProductItem');
const Variation = require('../models/Variation');
const VariationOption = require('../models/VariationOption');
const ShoppingCart = require('../models/ShoppingCart');
const ShoppingCartItem = require('../models/ShoppingCartItem');
const Voucher = require('../models/Voucher');
const UserVoucher = require('../models/UserVoucher');
const UserPaymentMethod = require('../models/UserPaymentMethod');
const UserAddress = require('../models/UserAddress');
const StoreInventory = require('../models/StoreInventory');
const Promotion = require('../models/Promotion');
const PromotionCategory = require('../models/PromotionCategory');

async function seed() {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synced');

        // 1. Country
        const countries = await Country.bulkCreate([
            { country_name: 'Vietnam' },
            { country_name: 'United States' },
            { country_name: 'Japan' }
        ]);

        // 2. Address
        const addresses = await Address.bulkCreate([
            {
                unit_number: 'A1', street_number: '123', address_line1: '123 Tech Street', address_line2: '',
                city: 'Hanoi', region: 'HN', postal_code: '100000', country_id: countries[0].id
            },
            {
                unit_number: 'B2', street_number: '456', address_line1: '456 Fashion Avenue', address_line2: '',
                city: 'HCMC', region: 'SG', postal_code: '700000', country_id: countries[0].id
            }
        ]);

        // 3. User
        const users = await User.bulkCreate([
            { email_address: 'user1@example.com', password: 'password123', phone_number: '1234567890' },
            { email_address: 'user2@example.com', password: 'password123', phone_number: '0987654321' }
        ]);

        // 4. Admin
        const admins = await Admin.bulkCreate([
            { user_id: users[0].id, full_name: 'Super Admin', role: 'superadmin' },
            { user_id: users[1].id, full_name: 'Category Manager', role: 'category_manager' }
        ]);

        // 5. OrderStatus
        const orderStatuses = await OrderStatus.bulkCreate([
            { status: 'Pending' }, { status: 'Processing' }, { status: 'Shipped' }, { status: 'Delivered' }, { status: 'Cancelled' }
        ]);

        // 6. PaymentType
        const paymentTypes = await PaymentType.bulkCreate([
            { value: 'Credit Card' }, { value: 'PayPal' }, { value: 'Bank Transfer' }
        ]);

        // 7. ShippingMethod
        const shippingMethods = await ShippingMethod.bulkCreate([
            { name: 'Standard Shipping', price: 5.00 },
            { name: 'Express Shipping', price: 15.00 },
            { name: 'Free Shipping', price: 0.00 }
        ]);

        // 8. ProductCategory
        const categories = await ProductCategory.bulkCreate([
            { category_name: 'Electronics', discount_rate: 0, updated_by: admins[0].id },
            { category_name: 'Clothing', discount_rate: 0, updated_by: admins[1].id },
            { category_name: 'Books', discount_rate: 0, updated_by: admins[0].id }
        ]);

        // 9. Store
        const stores = await Store.bulkCreate([
            { name: 'Tech Store', description: 'Your one-stop shop for electronics', address_id: addresses[0].id },
            { name: 'Fashion Store', description: 'Trendy clothing and accessories', address_id: addresses[1].id }
        ]);

        // 10. Product
        const products = await Product.bulkCreate([
            { name: 'Smartphone X', description: 'Latest smartphone with amazing features', product_image: '', category_id: categories[0].id },
            { name: 'Laptop Pro', description: 'Powerful laptop for professionals', product_image: '', category_id: categories[0].id },
            { name: 'Summer Dress', description: 'Beautiful summer dress', product_image: '', category_id: categories[1].id }
        ]);

        // 11. ProductItem
        const productItems = await ProductItem.bulkCreate([
            { product_id: products[0].id, SKU: 'SPX-001', qty_in_stock: 10, product_image: '', price: 999.99 },
            { product_id: products[1].id, SKU: 'LTP-001', qty_in_stock: 5, product_image: '', price: 1499.99 },
            { product_id: products[2].id, SKU: 'SD-001', qty_in_stock: 20, product_image: '', price: 49.99 }
        ]);

        // 12. Variation
        const variations = await Variation.bulkCreate([
            { category_id: categories[0].id, name: 'Color' },
            { category_id: categories[1].id, name: 'Size' }
        ]);

        // 13. VariationOption
        const variationOptions = await VariationOption.bulkCreate([
            { variation_id: variations[0].id, value: 'Black' },
            { variation_id: variations[0].id, value: 'White' },
            { variation_id: variations[1].id, value: 'M' },
            { variation_id: variations[1].id, value: 'L' }
        ]);

        // 14. ShoppingCart
        const carts = await ShoppingCart.bulkCreate([
            { user_id: users[0].id },
            { user_id: users[1].id }
        ]);

        // 15. ShoppingCartItem
        await ShoppingCartItem.bulkCreate([
            { cart_id: carts[0].id, product_item_id: productItems[0].id, qty: 2 },
            { cart_id: carts[1].id, product_item_id: productItems[2].id, qty: 1 }
        ]);

        // 16. Voucher
        const now = new Date();
        const nextMonth = new Date();
        nextMonth.setMonth(now.getMonth() + 1);
        const vouchers = await Voucher.bulkCreate([
            { code: 'SALE10', description: '10% off', discount_type: 'percent', discount_value: 10, min_order_value: 100, max_discount: 50, start_date: now, end_date: nextMonth },
            { code: 'FREESHIP', description: 'Free shipping', discount_type: 'fixed', discount_value: 5, min_order_value: 50, max_discount: 5, start_date: now, end_date: nextMonth }
        ]);

        // 17. UserVoucher
        await UserVoucher.bulkCreate([
            { user_id: users[0].id, voucher_id: vouchers[0].id, is_used: false },
            { user_id: users[1].id, voucher_id: vouchers[1].id, is_used: true }
        ]);

        // 18. UserPaymentMethod
        await UserPaymentMethod.bulkCreate([
            { user_id: users[0].id, payment_type_id: paymentTypes[0].id, provider: 'Vietcombank', account_number: '123456789', expiry_date: '2026-12-31', is_default: true },
            { user_id: users[1].id, payment_type_id: paymentTypes[1].id, provider: 'PayPal', account_number: 'user2@paypal.com', expiry_date: '2027-01-01', is_default: true }
        ]);

        // 19. UserAddress
        await UserAddress.bulkCreate([
            { user_id: users[0].id, address_id: addresses[0].id, is_default: true },
            { user_id: users[1].id, address_id: addresses[1].id, is_default: true }
        ]);

        // 20. StoreInventory
        await StoreInventory.bulkCreate([
            { store_id: stores[0].id, product_item_id: productItems[0].id, qty_in_stock: 10 },
            { store_id: stores[0].id, product_item_id: productItems[1].id, qty_in_stock: 5 },
            { store_id: stores[1].id, product_item_id: productItems[2].id, qty_in_stock: 20 }
        ]);

        // 21. Promotion
        const promotions = await Promotion.bulkCreate([
            { name: 'Summer Sale', description: 'Discount for summer', discount_rate: 15, start_date: now, end_date: nextMonth },
            { name: 'Back to School', description: 'Discount for students', discount_rate: 10, start_date: now, end_date: nextMonth }
        ]);

        // 22. PromotionCategory
        await PromotionCategory.bulkCreate([
            { promotion_id: promotions[0].id, category_id: categories[0].id },
            { promotion_id: promotions[1].id, category_id: categories[1].id }
        ]);

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

seed(); 