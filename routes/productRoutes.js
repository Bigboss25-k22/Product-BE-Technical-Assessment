const express = require('express');
const router = express.Router();
const { getProductsByCategory, searchProducts } = require('../controllers/productController');

// GET /api/products/category/:categoryId - Get products by category
router.get('/category/:categoryId', getProductsByCategory);
router.get('/search', searchProducts);

module.exports = router; 