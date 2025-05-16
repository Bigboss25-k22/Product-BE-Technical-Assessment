const express = require('express');
const router = express.Router();
const { handleVnpayCallback } = require('../controllers/paymentController');

router.get('/vnpay/callback', handleVnpayCallback);

module.exports = router;