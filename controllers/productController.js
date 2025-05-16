const { Op } = require('sequelize');
const { Product, ProductItem, StoreInventory, Store, ProductCategory } = require('../models');

// Fetches a list of products that belong to a specific category
const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const category = await ProductCategory.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Lấy danh sách sản phẩm thuộc category
        const products = await Product.findAll({
            where: { category_id: categoryId },
            attributes: ['id', 'name', 'description', 'product_image'],
            include: [{
                model: ProductItem,
                attributes: ['id', 'SKU', 'qty_in_stock', 'price']
            }],
            order: [['name', 'ASC']]
        });

        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};


const searchProducts = async (req, res) => {
    try {
        const {
            q, categoryId, minPrice, maxPrice, inStock, storeId,
            sortBy = 'name', sortOrder = 'ASC', page = 1, limit = 10
        } = req.query;

        // Build where conditions
        let productWhere = {};
        let itemWhere = {};
        let inventoryWhere = {};
        let storeWhere = {};

        if (q) {
            productWhere[Op.or] = [
                { name: { [Op.iLike]: `%${q}%` } },
                { description: { [Op.iLike]: `%${q}%` } }
            ];
        }
        if (categoryId) productWhere.category_id = categoryId;
        if (minPrice) itemWhere.price = { [Op.gte]: minPrice };
        if (maxPrice) itemWhere.price = { ...(itemWhere.price || {}), [Op.lte]: maxPrice };
        if (inStock === 'true') inventoryWhere.qty_in_stock = { [Op.gt]: 0 };
        if (storeId) storeWhere.id = storeId;

        // Pagination
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Query
        const { count, rows } = await Product.findAndCountAll({
            where: productWhere,
            attributes: ['id', 'name', 'description', 'product_image', 'category_id'],
            include: [
                {
                    model: ProductItem,
                    attributes: ['id', 'SKU', 'qty_in_stock', 'price'],
                    where: Object.keys(itemWhere).length ? itemWhere : undefined,
                    required: false,
                    include: [
                        {
                            model: StoreInventory,
                            attributes: ['id', 'qty_in_stock'],
                            where: Object.keys(inventoryWhere).length ? inventoryWhere : undefined,
                            required: false,
                            include: [
                                {
                                    model: Store,
                                    attributes: ['id', 'name'],
                                    where: Object.keys(storeWhere).length ? storeWhere : undefined,
                                    required: false
                                }
                            ]
                        }
                    ]
                },
                {
                    model: ProductCategory,
                    attributes: ['id', 'category_name'],
                    required: false
                }
            ],
            order: [[sortBy, sortOrder]],
            offset,
            limit: parseInt(limit),
            distinct: true // Đảm bảo count đúng khi join nhiều bảng
        });

        res.json({
            success: true,
            data: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

module.exports = {
    getProductsByCategory,
    searchProducts
};