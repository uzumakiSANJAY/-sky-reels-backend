const { FoodItem, OrderItem } = require('../models');
const { Op } = require('sequelize');

// Get all food items (with optional filtering)
const getAllFoodItems = async (req, res) => {
    try {
        const {
            category,
            isAvailable,
            isPopular,
            isFeatured,
            search,
            page = 1,
            limit = 20,
            sortBy = 'name',
            sortOrder = 'ASC'
        } = req.query;

        // Build where clause
        const whereClause = {};
        
        if (category) {
            whereClause.category = category;
        }
        
        if (isAvailable !== undefined) {
            whereClause.isAvailable = isAvailable === 'true';
        }
        
        if (isPopular !== undefined) {
            whereClause.isPopular = isPopular === 'true';
        }
        
        if (isFeatured !== undefined) {
            whereClause.isFeatured = isFeatured === 'true';
        }
        
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        // Pagination
        const offset = (page - 1) * limit;
        
        // Sorting
        const order = [[sortBy, sortOrder.toUpperCase()]];

        const { count, rows: foodItems } = await FoodItem.findAndCountAll({
            where: whereClause,
            order,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        const totalPages = Math.ceil(count / limit);

        res.json({
            success: true,
            data: {
                foodItems,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error('Get food items error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get food item by ID
const getFoodItemById = async (req, res) => {
    try {
        const { id } = req.params;

        const foodItem = await FoodItem.findByPk(id);
        if (!foodItem) {
            return res.status(404).json({
                success: false,
                message: 'Food item not found'
            });
        }

        res.json({
            success: true,
            data: {
                foodItem
            }
        });
    } catch (error) {
        console.error('Get food item error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Create new food item (Admin only)
const createFoodItem = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            image,
            isAvailable,
            preparationTime,
            calories,
            allergens,
            dietaryInfo,
            spiceLevel,
            isPopular,
            isFeatured,
            stockQuantity
        } = req.body;

        const foodItem = await FoodItem.create({
            name,
            description,
            price,
            category,
            image,
            isAvailable: isAvailable !== undefined ? isAvailable : true,
            preparationTime,
            calories,
            allergens: allergens || [],
            dietaryInfo: dietaryInfo || [],
            spiceLevel,
            isPopular: isPopular || false,
            isFeatured: isFeatured || false,
            stockQuantity
        });

        res.status(201).json({
            success: true,
            message: 'Food item created successfully',
            data: {
                foodItem
            }
        });
    } catch (error) {
        console.error('Create food item error:', error);
        
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.errors.map(err => ({
                    field: err.path,
                    message: err.message
                }))
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update food item (Admin only)
const updateFoodItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const foodItem = await FoodItem.findByPk(id);
        if (!foodItem) {
            return res.status(404).json({
                success: false,
                message: 'Food item not found'
            });
        }

        await foodItem.update(updateData);

        res.json({
            success: true,
            message: 'Food item updated successfully',
            data: {
                foodItem
            }
        });
    } catch (error) {
        console.error('Update food item error:', error);
        
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.errors.map(err => ({
                    field: err.path,
                    message: err.message
                }))
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Delete food item (Admin only)
const deleteFoodItem = async (req, res) => {
    try {
        const { id } = req.params;

        const foodItem = await FoodItem.findByPk(id);
        if (!foodItem) {
            return res.status(404).json({
                success: false,
                message: 'Food item not found'
            });
        }

        // Check if food item is used in any orders
        const orderItemsCount = await OrderItem.count({
            where: { foodItemId: id }
        });

        if (orderItemsCount > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete food item. It is associated with existing orders.'
            });
        }

        await foodItem.destroy();

        res.json({
            success: true,
            message: 'Food item deleted successfully'
        });
    } catch (error) {
        console.error('Delete food item error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get food item categories
const getFoodCategories = async (req, res) => {
    try {
        const categories = await FoodItem.findAll({
            attributes: [
                'category',
                [sequelize.fn('COUNT', sequelize.col('id')), 'itemCount']
            ],
            where: { isAvailable: true },
            group: ['category'],
            order: [['category', 'ASC']]
        });

        res.json({
            success: true,
            data: {
                categories
            }
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Toggle food item availability (Admin only)
const toggleFoodItemAvailability = async (req, res) => {
    try {
        const { id } = req.params;

        const foodItem = await FoodItem.findByPk(id);
        if (!foodItem) {
            return res.status(404).json({
                success: false,
                message: 'Food item not found'
            });
        }

        const newAvailability = !foodItem.isAvailable;
        await foodItem.update({ isAvailable: newAvailability });

        res.json({
            success: true,
            message: `Food item ${newAvailability ? 'made available' : 'made unavailable'}`,
            data: {
                foodItem
            }
        });
    } catch (error) {
        console.error('Toggle availability error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get popular food items
const getPopularFoodItems = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const popularItems = await FoodItem.findAll({
            where: { 
                isPopular: true,
                isAvailable: true
            },
            limit: parseInt(limit),
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                popularItems
            }
        });
    } catch (error) {
        console.error('Get popular items error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get featured food items
const getFeaturedFoodItems = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const featuredItems = await FoodItem.findAll({
            where: { 
                isFeatured: true,
                isAvailable: true
            },
            limit: parseInt(limit),
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                featuredItems
            }
        });
    } catch (error) {
        console.error('Get featured items error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    getAllFoodItems,
    getFoodItemById,
    createFoodItem,
    updateFoodItem,
    deleteFoodItem,
    getFoodCategories,
    toggleFoodItemAvailability,
    getPopularFoodItems,
    getFeaturedFoodItems
};
