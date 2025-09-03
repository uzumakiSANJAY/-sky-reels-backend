const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const foodRoutes = require('./food');
const orderRoutes = require('./orders');
const paymentRoutes = require('./payments');
const reviewRoutes = require('./reviews');

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Sky Reels Food Delivery API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// API routes
router.use('/auth', authRoutes);
router.use('/food', foodRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);

// 404 handler for undefined routes
router.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
    });
});

module.exports = router;
