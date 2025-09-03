const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const { auth, adminAuth } = require('../middleware/auth');
const {
    validateFoodItem
} = require('../middleware/validation');

// Public routes
router.get('/', foodController.getAllFoodItems);
router.get('/categories', foodController.getFoodCategories);
router.get('/popular', foodController.getPopularFoodItems);
router.get('/featured', foodController.getFeaturedFoodItems);
router.get('/:id', foodController.getFoodItemById);

// Admin only routes
router.post('/', adminAuth, validateFoodItem, foodController.createFoodItem);
router.put('/:id', adminAuth, validateFoodItem, foodController.updateFoodItem);
router.delete('/:id', adminAuth, foodController.deleteFoodItem);
router.patch('/:id/toggle-availability', adminAuth, foodController.toggleFoodItemAvailability);

module.exports = router;
