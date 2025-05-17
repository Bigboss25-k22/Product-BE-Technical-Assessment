const { Order, User, OrderItem, ProductItem, Product, PaymentType, UserPaymentMethod } = require('../models');
const sendOrderConfirmationEmail = require('../utils/sendOrderEmail');
const vnpayConfig = require('../config/vnpay');
const vnpay = require('vnpay');
const vnpayUtil = require('../utils/vnpay');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const handleVnpayCallback = async (req, res) => {
  try {
    const vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    // Kiểm tra hash hợp lệ
    const checkHash = vnpay.verifyReturnUrl(vnp_Params, vnpayConfig.vnp_HashSecret, secureHash);
    if (!checkHash) return res.status(400).send('Invalid signature!');

    const orderId = vnp_Params['vnp_TxnRef'];
    const responseCode = vnp_Params['vnp_ResponseCode'];

    if (responseCode === '00') {
      // Thanh toán thành công
      const order = await Order.findByPk(orderId);
      if (order && order.status_id === 2) {
        order.status_id = 3; // paid/processing
        await order.save();

        // Lấy danh sách sản phẩm đã order
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
        const orderItemsForEmail = orderItems.map(item => ({
          product_name: item.ProductItem?.Product?.name || item.product_item_id,
          qty: item.qty,
          price: item.price
        }));

        // Gửi email xác nhận bất đồng bộ
        const user = await User.findByPk(order.user_id);
        if (user) setImmediate(() => sendOrderConfirmationEmail(user.email_address, order, orderItemsForEmail));
      }
      return res.send('Thanh toán thành công! Đơn hàng đã được xác nhận.');
    } else {
      return res.send('Thanh toán thất bại hoặc bị hủy.');
    }
  } catch (error) {
    return res.status(500).send('Lỗi xử lý callback VNPAY');
  }
};

// Process VNPay payment callback
const processVnpayCallback = catchAsync(async (req, res, next) => {
    const vnpayParams = req.query;
    const isValidSignature = vnpayUtil.verifyReturnUrl(vnpayParams);

    if (!isValidSignature) {
        return next(new AppError('Invalid payment signature', 400));
    }

    const orderId = vnpayParams.vnp_TxnRef;
    const order = await Order.findByPk(orderId);

    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    if (vnpayParams.vnp_ResponseCode === '00') {
        // Payment successful
        await order.update({ status_id: 3 });
        return res.redirect('/payment/success');
    } else {
        // Payment failed
        await order.update({ status_id: 4 });
        return res.redirect('/payment/failed');
    }
});

// Get payment methods
const getPaymentMethods = catchAsync(async (req, res, next) => {
    const paymentMethods = await PaymentType.findAll({
        include: [{
            model: UserPaymentMethod,
            where: { user_id: req.user.id },
            required: false
        }]
    });

    res.status(200).json({
        success: true,
        data: paymentMethods
    });
});

module.exports = {
    handleVnpayCallback,
    processVnpayCallback,
    getPaymentMethods
};
