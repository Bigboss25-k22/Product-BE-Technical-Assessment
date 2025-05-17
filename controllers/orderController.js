const { Order, OrderItem, User, PaymentType, UserPaymentMethod, ShippingMethod, OrderStatus, ProductItem, Product, StoreInventory, sequelize } = require('../models');
const sendOrderConfirmationEmail = require('../utils/sendOrderEmail');
const vnpayUtil = require('../utils/vnpay');
const { Op } = require('sequelize');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// Create a new order
const createOrder = catchAsync(async (req, res, next) => {
    const { user_id, shipping_address, payment_method_id, shipping_method_id, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return next(new AppError('Please provide order items', 400));
    }

    const transaction = await sequelize.transaction();
    
    try {
        // phương thức thanh toán
        const userPaymentMethod = await UserPaymentMethod.findByPk(payment_method_id);
        if (!userPaymentMethod) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: 'Invalid payment method' });
        }

        // phương thức vận chuyển
        const shippingMethod = await ShippingMethod.findByPk(shipping_method_id);
        if (!shippingMethod) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: 'Invalid shipping method' });
        }

        const orderStatus = await OrderStatus.findOne({ where: { status: 'Pending' } });
        if (!orderStatus) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: 'Order status not found' });
        }

        // Kiểm tra và cập nhật số lượng sản phẩm cho từng item
        for (const item of items) {
            // Tìm store có đủ số lượng sản phẩm
            const storeInventory = await StoreInventory.findOne({
                where: {
                    product_item_id: item.product_item_id,
                    qty_in_stock: {
                        [Op.gte]: item.qty
                    }
                },
                order: [
                    ['qty_in_stock', 'DESC'] // Ưu tiên store có nhiều hàng nhất
                ],
                lock: true,
                transaction
            });

            if (!storeInventory) {
                await transaction.rollback();
                return res.status(400).json({ 
                    success: false, 
                    message: `Product ${item.product_item_id} is out of stock in all stores` 
                });
            }

            // Cập nhật số lượng trong store_inventory
            await storeInventory.update({
                qty_in_stock: storeInventory.qty_in_stock - item.qty
            }, { transaction });

            // Cập nhật số lượng tổng trong product_item
            const productItem = await ProductItem.findByPk(item.product_item_id, {
                lock: true,
                transaction
            });

            if (productItem.qty_in_stock < item.qty) {
                await transaction.rollback();
                return res.status(400).json({ 
                    success: false, 
                    message: `Insufficient total stock for product ${item.product_item_id}` 
                });
            }

            await productItem.update({
                qty_in_stock: productItem.qty_in_stock - item.qty
            }, { transaction });
        }

        // Tính tổng tiền
        let total = 0;
        for (const item of items) total += item.price * item.qty;
        total += parseFloat(shippingMethod.price);

        // Tạo đơn hàng
        const order = await Order.create({
            user_id,
            order_date: new Date(),
            payment_method_id,
            shipping_method_id,
            shipping_address,
            order_total: total,
            order_status: orderStatus.id
        }, { transaction });

        // Tạo order items
        for (const item of items) {
            await OrderItem.create({
                order_id: order.id,
                product_item_id: item.product_item_id,
                qty: item.qty,
                price: item.price
            }, { transaction });
        }

        // Lấy danh sách order items với thông tin sản phẩm và store
        const orderItems = await OrderItem.findAll({
            where: { order_id: order.id },
            include: [
                {
                    model: ProductItem,
                    attributes: ['id', 'SKU', 'product_id'],
                    include: [
                        { model: Product, attributes: ['name'] },
                        {
                            model: StoreInventory,
                            attributes: ['store_id', 'qty_in_stock'],
                            where: {
                                qty_in_stock: {
                                    [Op.gt]: 0
                                }
                            },
                            required: false
                        }
                    ]
                }
            ],
            transaction
        });

        const orderItemsForEmail = orderItems.map(item => ({
            product_name: item.ProductItem?.Product?.name || item.product_item_id,
            qty: item.qty,
            price: item.price,
            store_id: item.ProductItem?.StoreInventories?.[0]?.store_id
        }));

        // Lấy loại thanh toán (COD/VNPAY)
        const paymentType = await PaymentType.findByPk(userPaymentMethod.payment_type_id);
        if (!paymentType) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: 'Payment type not found' });
        }

        await transaction.commit();

        // Gửi email xác nhận bất đồng bộ
        if (paymentType.value === 'COD') {
            User.findByPk(user_id).then(user => {
                if (user) setImmediate(() => sendOrderConfirmationEmail(user.email_address, order, orderItemsForEmail));
            });
            return res.status(201).json({ success: true, order_id: order.id, status: 'processing' });
        } else if (paymentType.value === 'VNPAY') {
            const paymentUrl = vnpayUtil.createPaymentUrl(order, req);
            return res.status(201).json({ success: true, order_id: order.id, status: 'pending_payment', paymentUrl });
        }
    } catch (error) {
        await transaction.rollback();
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

// Get all orders for the current user
const getMyOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.findAll({
        where: { user_id: req.user.id },
        include: [{
            model: OrderItem,
            include: [{
                model: ProductItem,
                include: ['store']
            }]
        }],
        order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
        success: true,
        data: orders
    });
});

// Get a single order
const getOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findOne({
        where: {
            id: req.params.id,
            user_id: req.user.id
        },
        include: [{
            model: OrderItem,
            include: [{
                model: ProductItem,
                include: ['store']
            }]
        }]
    });

    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    res.status(200).json({
        success: true,
        data: order
    });
});

module.exports = { createOrder, getMyOrders, getOrder };
