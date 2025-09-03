const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { auth, adminAuth } = require('../middleware/auth');

// User routes
router.get('/methods', paymentController.getPaymentMethods);
router.post('/razorpay/create-order', auth, paymentController.createRazorpayOrder);
router.post('/razorpay/verify', auth, paymentController.verifyRazorpayPayment);
router.post('/cod/confirm', auth, paymentController.processCODPayment);
router.get('/status/:orderId', auth, paymentController.getPaymentStatus);

// Admin routes
router.post('/refund', adminAuth, paymentController.refundPayment);

module.exports = router;
