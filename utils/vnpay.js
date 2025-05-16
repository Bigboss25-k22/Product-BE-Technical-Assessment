const { VNPay, ignoreLogger } = require('vnpay');
const vnpayConfig = require('../config/vnpay');

// Khởi tạo VNPAY instance
const vnpay = new VNPay({
  tmnCode: vnpayConfig.vnp_TmnCode,
  secureSecret: vnpayConfig.vnp_HashSecret,
  vnpayHost: vnpayConfig.vnp_Url,
  testMode: process.env.NODE_ENV !== 'production',
  hashAlgorithm: 'SHA512',
  enableLog: true,
  loggerFn: ignoreLogger,
  endpoints: {
    paymentEndpoint: 'paymentv2/vpcpay.html',
    queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
    getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
  },
});

function createPaymentUrl(order, req) {
  try {
    // Validate config
    if (!vnpayConfig.vnp_TmnCode || !vnpayConfig.vnp_HashSecret || !vnpayConfig.vnp_Url || !vnpayConfig.vnp_ReturnUrl) {
      throw new Error('Missing VNPAY configuration');
    }

    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const orderId = order.id;
    const amount = Math.round(order.order_total * 100); // VNPAY yêu cầu đơn vị là VND * 100

    console.log('VNPAY Config:', {
      tmnCode: vnpayConfig.vnp_TmnCode,
      vnpUrl: vnpayConfig.vnp_Url,
      returnUrl: vnpayConfig.vnp_ReturnUrl,
      orderId,
      amount
    });

    // Tạo URL thanh toán
    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr: ipAddr,
      vnp_TxnRef: orderId.toString(),
      vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
      vnp_OrderType: 'other',
      vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
      vnp_Locale: 'vn'
    });
    
    console.log('Generated VNPAY URL:', paymentUrl);

    return paymentUrl;
  } catch (error) {
    console.error('Error creating VNPAY payment URL:', error);
    throw error;
  }
}

// Hàm xác thực IPN
function verifyIpnCall(query) {
  return vnpay.verifyIpnCall(query);
}

// Hàm xác thực Return URL
function verifyReturnUrl(query) {
  return vnpay.verifyReturnUrl(query);
}

module.exports = { 
  createPaymentUrl,
  verifyIpnCall,
  verifyReturnUrl
};
