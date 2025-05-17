const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/orderController');

// Route tạo đơn hàng mới
router.post('/', createOrder);

module.exports = router; 