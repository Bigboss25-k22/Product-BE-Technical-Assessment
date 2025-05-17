const { ProductCategory } = require('../models');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// Get all categories
const getAllCategories = catchAsync(async (req, res, next) => {
    const categories = await ProductCategory.findAll({
        attributes: ['id', 'category_name'],
        order: [['category_name', 'ASC']]
    });

    res.status(200).json({
        success: true,
        data: categories
    });
});

// Get single category
const getCategory = catchAsync(async (req, res, next) => {
    const category = await ProductCategory.findByPk(req.params.id);

    if (!category) {
        return next(new AppError('Category not found', 404));
    }

    res.status(200).json({
        success: true,
        data: category
    });
});

module.exports = {
    getAllCategories,
    getCategory
};
