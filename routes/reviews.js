const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { auth } = require('../middleware/auth');
const { body, param } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

// Validation rules
const createReviewValidation = [
    body('foodItemId')
        .notEmpty()
        .withMessage('Food item ID is required')
        .isUUID()
        .withMessage('Invalid food item ID format'),
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be an integer between 1 and 5'),
    body('comment')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Comment must not exceed 1000 characters'),
    body('orderId')
        .optional()
        .isUUID()
        .withMessage('Invalid order ID format'),
    handleValidationErrors
];

const updateReviewValidation = [
    param('reviewId')
        .isUUID()
        .withMessage('Invalid review ID format'),
    body('rating')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be an integer between 1 and 5'),
    body('comment')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Comment must not exceed 1000 characters'),
    handleValidationErrors
];

const reviewIdValidation = [
    param('reviewId')
        .isUUID()
        .withMessage('Invalid review ID format'),
    handleValidationErrors
];

const foodItemIdValidation = [
    param('foodItemId')
        .isUUID()
        .withMessage('Invalid food item ID format'),
    handleValidationErrors
];

const adminResponseValidation = [
    param('reviewId')
        .isUUID()
        .withMessage('Invalid review ID format'),
    body('adminResponse')
        .notEmpty()
        .withMessage('Admin response is required')
        .isLength({ max: 1000 })
        .withMessage('Admin response must not exceed 1000 characters'),
    handleValidationErrors
];

// Public routes
router.get('/food-item/:foodItemId', foodItemIdValidation, reviewController.getFoodItemReviews);

// Protected routes (require authentication)
router.post('/', auth, createReviewValidation, reviewController.createReview);
router.get('/my-reviews', auth, reviewController.getUserReviews);
router.put('/:reviewId', auth, updateReviewValidation, reviewController.updateReview);
router.delete('/:reviewId', auth, reviewIdValidation, reviewController.deleteReview);
router.post('/:reviewId/helpful', auth, reviewIdValidation, reviewController.markReviewHelpful);

// Admin routes
router.post('/:reviewId/admin-response', auth, adminResponseValidation, reviewController.addAdminResponse);

module.exports = router;