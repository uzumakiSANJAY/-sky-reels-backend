const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// User validation rules
const validateUserRegistration = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('phone')
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    handleValidationErrors
];

const validateUserLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

// Food item validation rules
const validateFoodItem = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('description')
        .trim()
        .isLength({ min: 10 })
        .withMessage('Description must be at least 10 characters long'),
    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('category')
        .isIn(['Pizza', 'Burger', 'Salad', 'Pasta', 'Dessert', 'Beverage', 'Appetizer', 'Main Course', 'Soup', 'Bread'])
        .withMessage('Invalid category'),
    body('preparationTime')
        .isInt({ min: 1, max: 120 })
        .withMessage('Preparation time must be between 1 and 120 minutes'),
    handleValidationErrors
];

// Order validation rules
const validateOrder = [
    body('deliveryAddress')
        .trim()
        .isLength({ min: 10 })
        .withMessage('Delivery address must be at least 10 characters long'),
    body('items')
        .isArray({ min: 1 })
        .withMessage('Order must contain at least one item'),
    body('items.*.name')
        .notEmpty()
        .withMessage('Item name is required'),
    body('items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Item quantity must be at least 1'),
    body('items.*.price')
        .isFloat({ min: 0 })
        .withMessage('Item price must be a positive number'),
    body('paymentMethod')
        .isIn(['cod', 'razorpay', 'card', 'upi'])
        .withMessage('Invalid payment method'),
    handleValidationErrors
];

// Order status update validation
const validateOrderStatusUpdate = [
    body('orderStatus')
        .isIn(['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'])
        .withMessage('Invalid order status'),
    handleValidationErrors
];

// Payment status update validation
const validatePaymentStatusUpdate = [
    body('paymentStatus')
        .isIn(['pending', 'paid', 'failed', 'refunded'])
        .withMessage('Invalid payment status'),
    handleValidationErrors
];

module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateFoodItem,
    validateOrder,
    validateOrderStatusUpdate,
    validatePaymentStatusUpdate,
    handleValidationErrors
};
