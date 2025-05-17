const { Op } = require('sequelize');
const { Product, ProductItem, StoreInventory, Store, ProductCategory } = require('../models');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// Fetches a list of products that belong to a specific category
const getProductsByCategory = catchAsync(async (req, res, next) => {
    const { categoryId } = req.params;

    const category = await ProductCategory.findByPk(categoryId);
    if (!category) {
        return next(new AppError('Category not found', 404));
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

    res.status(200).json({
        success: true,
        data: products
    });
});

const searchProducts = catchAsync(async (req, res, next) => {
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

    res.status(200).json({
        success: true,
        data: rows,
        pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit)
        }
    });
});

module.exports = {
    getProductsByCategory,
    searchProducts
};