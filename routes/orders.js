const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, adminAuth } = require('../middleware/auth');
const {
    validateOrder,
    validateOrderStatusUpdate,
    validatePaymentStatusUpdate
} = require('../middleware/validation');

// User routes
router.post('/', auth, validateOrder, orderController.createOrder);
router.get('/my-orders', auth, orderController.getUserOrders);
router.get('/my-orders/:id', auth, orderController.getOrderById);
router.put('/:id/cancel', auth, orderController.cancelOrder);

// Admin routes
router.get('/', adminAuth, orderController.getAllOrders);
router.get('/statistics', adminAuth, orderController.getOrderStatistics);
router.put('/:id/status', adminAuth, validateOrderStatusUpdate, orderController.updateOrderStatus);
router.put('/:id/payment-status', adminAuth, validatePaymentStatusUpdate, orderController.updatePaymentStatus);

module.exports = router;
