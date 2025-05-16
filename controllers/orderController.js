const { Order, OrderItem, User, PaymentType, UserPaymentMethod, ShippingMethod, OrderStatus, ProductItem, Product } = require('../models');
const sendOrderConfirmationEmail = require('../utils/sendOrderEmail');
const vnpayUtil = require('../utils/vnpay');

const createOrder = async (req, res) => {
    try {
        const { user_id, shipping_address, payment_method_id, shipping_method_id, items } = req.body;

        // Kiểm tra phương thức thanh toán
        const userPaymentMethod = await UserPaymentMethod.findByPk(payment_method_id);
        if (!userPaymentMethod) return res.status(400).json({ success: false, message: 'Invalid payment method' });

        // Kiểm tra phương thức vận chuyển
        const shippingMethod = await ShippingMethod.findByPk(shipping_method_id);
        if (!shippingMethod) return res.status(400).json({ success: false, message: 'Invalid shipping method' });

        // Tính tổng tiền
        let total = 0;
        for (const item of items) total += item.price * item.qty;
        total += parseFloat(shippingMethod.price);

        // Lấy trạng thái đơn hàng ban đầu
        const orderStatus = await OrderStatus.findOne({ where: { status: 'Pending' } });
        if (!orderStatus) return res.status(400).json({ success: false, message: 'Order status not found' });

        // Tạo đơn hàng
        const order = await Order.create({
            user_id,
            order_date: new Date(),
            payment_method_id,
            shipping_method_id,
            shipping_address,
            order_total: total,
            order_status: orderStatus.id
        });

        // Tạo order items
        for (const item of items) {
            await OrderItem.create({
                order_id: order.id,
                product_item_id: item.product_item_id,
                qty: item.qty,
                price: item.price
            });
        }

        // Lấy danh sách order items với thông tin sản phẩm
        const orderItems = await OrderItem.findAll({
            where: { order_id: order.id },
            include: [
                {
                    model: ProductItem,
                    attributes: ['id', 'SKU', 'product_id'],
                    include: [
                        { model: Product, attributes: ['name'] }
                    ]
                }
            ]
        });

        // Map lại dữ liệu cho email
        const orderItemsForEmail = orderItems.map(item => ({
            product_name: item.ProductItem?.Product?.name || item.product_item_id,
            qty: item.qty,
            price: item.price
        }));

        // Lấy loại thanh toán (COD/VNPAY)
        const paymentType = await PaymentType.findByPk(userPaymentMethod.payment_type_id);
        if (!paymentType) return res.status(400).json({ success: false, message: 'Payment type not found' });

        console.log(paymentType);

        if (paymentType.value === 'COD') {
            // Gửi email xác nhận bất đồng bộ
            User.findByPk(user_id).then(user => {
                if (user) setImmediate(() => sendOrderConfirmationEmail(user.email_address, order, orderItemsForEmail));
            });
            return res.status(201).json({ success: true, order_id: order.id, status: 'processing' });
        } else if (paymentType.value === 'VNPAY') {
            // Tạo link thanh toán VNPAY
            const paymentUrl = vnpayUtil.createPaymentUrl(order, req);
            return res.status(201).json({ success: true, order_id: order.id, status: 'pending_payment', paymentUrl });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};
module.exports = { createOrder };
