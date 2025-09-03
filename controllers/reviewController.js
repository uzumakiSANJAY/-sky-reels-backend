const { Review, User, FoodItem, Order, OrderItem } = require('../models');
const { Op } = require('sequelize');

// Create a new review
const createReview = async (req, res) => {
    try {
        const { foodItemId, rating, comment, orderId } = req.body;
        const userId = req.user.id;

        // Check if user has already reviewed this food item
        const existingReview = await Review.findOne({
            where: { userId, foodItemId }
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this food item'
            });
        }

        // Check if food item exists
        const foodItem = await FoodItem.findByPk(foodItemId);
        if (!foodItem) {
            return res.status(404).json({
                success: false,
                message: 'Food item not found'
            });
        }

        // Check if user has ordered this item (for verified purchase)
        let isVerifiedPurchase = false;
        if (orderId) {
            const order = await Order.findOne({
                where: { id: orderId, userId },
                include: [{
                    model: OrderItem,
                    as: 'orderItems',
                    where: { foodItemId }
                }]
            });
            if (order) {
                isVerifiedPurchase = true;
            }
        } else {
            // Check if user has ever ordered this item
            const userOrder = await Order.findOne({
                where: { userId },
                include: [{
                    model: OrderItem,
                    as: 'orderItems',
                    where: { foodItemId }
                }]
            });
            if (userOrder) {
                isVerifiedPurchase = true;
            }
        }

        // Create the review
        const review = await Review.create({
            userId,
            foodItemId,
            orderId: orderId || null,
            rating,
            comment: comment || null,
            isVerifiedPurchase
        });

        // Fetch the created review with user info
        const createdReview = await Review.findByPk(review.id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'profileImage']
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            data: {
                review: createdReview
            }
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get reviews for a specific food item
const getFoodItemReviews = async (req, res) => {
    try {
        const { foodItemId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder || 'DESC';
        const rating = req.query.rating; // Filter by rating

        const offset = (page - 1) * limit;

        // Build where condition
        const whereCondition = { foodItemId };
        if (rating) {
            whereCondition.rating = parseInt(rating);
        }

        const { count, rows: reviews } = await Review.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'profileImage']
                }
            ],
            order: [[sortBy, sortOrder]],
            limit,
            offset
        });

        // Calculate review statistics
        const reviewStats = await Review.findAll({
            where: { foodItemId },
            attributes: [
                'rating',
                [require('sequelize').fn('COUNT', require('sequelize').col('rating')), 'count']
            ],
            group: ['rating'],
            raw: true
        });

        const totalReviews = await Review.count({ where: { foodItemId } });
        const avgRating = totalReviews > 0 ? 
            await Review.findOne({
                where: { foodItemId },
                attributes: [[require('sequelize').fn('AVG', require('sequelize').col('rating')), 'averageRating']],
                raw: true
            }) : { averageRating: 0 };

        const ratingDistribution = {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0
        };
        reviewStats.forEach(stat => {
            ratingDistribution[stat.rating] = parseInt(stat.count);
        });

        res.json({
            success: true,
            data: {
                reviews,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(count / limit),
                    totalReviews: count,
                    hasNext: page < Math.ceil(count / limit),
                    hasPrev: page > 1
                },
                statistics: {
                    totalReviews,
                    averageRating: parseFloat(avgRating.averageRating || 0).toFixed(1),
                    ratingDistribution
                }
            }
        });
    } catch (error) {
        console.error('Get food item reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get user's reviews
const getUserReviews = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows: reviews } = await Review.findAndCountAll({
            where: { userId },
            include: [
                {
                    model: FoodItem,
                    as: 'foodItem',
                    attributes: ['id', 'name', 'image', 'price']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        res.json({
            success: true,
            data: {
                reviews,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(count / limit),
                    totalReviews: count,
                    hasNext: page < Math.ceil(count / limit),
                    hasPrev: page > 1
                }
            }
        });
    } catch (error) {
        console.error('Get user reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update a review
const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id;

        const review = await Review.findOne({
            where: { id: reviewId, userId }
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found or unauthorized'
            });
        }

        // Update the review
        await review.update({
            rating: rating || review.rating,
            comment: comment !== undefined ? comment : review.comment
        });

        // Fetch updated review with user info
        const updatedReview = await Review.findByPk(reviewId, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'profileImage']
                }
            ]
        });

        res.json({
            success: true,
            message: 'Review updated successfully',
            data: {
                review: updatedReview
            }
        });
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Delete a review
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id;

        const review = await Review.findOne({
            where: { id: reviewId, userId }
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found or unauthorized'
            });
        }

        await review.destroy();

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Mark review as helpful
const markReviewHelpful = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findByPk(reviewId);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        await review.increment('helpfulCount', { by: 1 });

        res.json({
            success: true,
            message: 'Review marked as helpful',
            data: {
                helpfulCount: review.helpfulCount + 1
            }
        });
    } catch (error) {
        console.error('Mark review helpful error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Admin: Add response to review
const addAdminResponse = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { adminResponse } = req.body;

        // Check if user is admin
        if (!req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        const review = await Review.findByPk(reviewId);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        await review.update({ adminResponse });

        const updatedReview = await Review.findByPk(reviewId, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'profileImage']
                }
            ]
        });

        res.json({
            success: true,
            message: 'Admin response added successfully',
            data: {
                review: updatedReview
            }
        });
    } catch (error) {
        console.error('Add admin response error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    createReview,
    getFoodItemReviews,
    getUserReviews,
    updateReview,
    deleteReview,
    markReviewHelpful,
    addAdminResponse
};