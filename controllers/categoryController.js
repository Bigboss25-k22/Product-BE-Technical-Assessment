const { ProductCategory } = require('../models');

// Fetches a list of all product categories available in the e-commerce platform
const getAllCategories = async (req, res) => {
    try {
        const categories = await ProductCategory.findAll({
            attributes: ['id', 'category_name'],
            order: [['category_name', 'ASC']]
        });

        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    getAllCategories
};
