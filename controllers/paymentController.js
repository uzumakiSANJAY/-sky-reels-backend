const Razorpay = require('razorpay');
const { Order } = require('../models');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
const createRazorpayOrder = async (req, res) => {
    try {
        const { orderId, amount, currency = 'INR' } = req.body;

        // Verify order exists and belongs to user
        const order = await Order.findOne({
            where: { id: orderId, userId: req.user.id }
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.paymentStatus === 'paid') {
            return res.status(400).json({
                success: false,
                message: 'Order is already paid'
            });
        }

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(amount * 100), // Convert to paise
            currency,
            receipt: order.orderNumber,
            notes: {
                orderId: order.id,
                orderNumber: order.orderNumber
            }
        });

        res.json({
            success: true,
            message: 'Razorpay order created successfully',
            data: {
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                orderId: order.id
            }
        });
    } catch (error) {
        console.error('Create Razorpay order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Verify Razorpay payment
const verifyRazorpayPayment = async (req, res) => {
    try {
        const {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            orderId
        } = req.body;

        // Verify order exists and belongs to user
        const order = await Order.findOne({
            where: { id: orderId, userId: req.user.id }
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Verify payment signature
        const text = `${razorpayOrderId}|${razorpayPaymentId}`;
        const crypto = require('crypto');
        const signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(text)
            .digest('hex');

        if (signature !== razorpaySignature) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }

        // Update order payment status
        await order.update({
            paymentStatus: 'paid'
        });

        res.json({
            success: true,
            message: 'Payment verified successfully',
            data: {
                order
            }
        });
    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify payment',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get payment methods
const getPaymentMethods = async (req, res) => {
    try {
        const paymentMethods = [
            {
                id: 'cod',
                name: 'Cash on Delivery',
                description: 'Pay when you receive your order',
                icon: '💵',
                isAvailable: true
            },
            {
                id: 'razorpay',
                name: 'Razorpay',
                description: 'Secure online payment',
                icon: '💳',
                isAvailable: process.env.RAZORPAY_KEY_ID ? true : false
            },
            {
                id: 'card',
                name: 'Credit/Debit Card',
                description: 'Pay with your card',
                icon: '💳',
                isAvailable: false // Not implemented yet
            },
            {
                id: 'upi',
                name: 'UPI',
                description: 'Pay using UPI',
                icon: '📱',
                isAvailable: false // Not implemented yet
            }
        ];

        res.json({
            success: true,
            data: {
                paymentMethods
            }
        });
    } catch (error) {
        console.error('Get payment methods error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Process COD payment
const processCODPayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        // Verify order exists and belongs to user
        const order = await Order.findOne({
            where: { id: orderId, userId: req.user.id }
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.paymentMethod !== 'cod') {
            return res.status(400).json({
                success: false,
                message: 'Order is not a COD order'
            });
        }

        // For COD, payment status remains pending until delivery
        // This function can be used to confirm COD orders
        res.json({
            success: true,
            message: 'COD order confirmed',
            data: {
                order
            }
        });
    } catch (error) {
        console.error('Process COD payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get payment status
const getPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Verify order exists and belongs to user
        const order = await Order.findOne({
            where: { id: orderId, userId: req.user.id }
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: {
                paymentStatus: order.paymentStatus,
                paymentMethod: order.paymentMethod,
                orderId: order.id
            }
        });
    } catch (error) {
        console.error('Get payment status error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Refund payment (Admin only)
const refundPayment = async (req, res) => {
    try {
        const { orderId, refundAmount, reason } = req.body;

        // Verify order exists
        const order = await Order.findOne({
            where: { id: orderId }
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.paymentStatus !== 'paid') {
            return res.status(400).json({
                success: false,
                message: 'Order is not paid'
            });
        }

        // Process refund through Razorpay if it was a Razorpay payment
        if (order.paymentMethod === 'razorpay') {
            try {
                // You would need to store the Razorpay payment ID in your order
                // For now, we'll just update the payment status
                await order.update({
                    paymentStatus: 'refunded'
                });
            } catch (refundError) {
                console.error('Razorpay refund error:', refundError);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to process refund'
                });
            }
        } else {
            // For COD orders, just update the status
            await order.update({
                paymentStatus: 'refunded'
            });
        }

        res.json({
            success: true,
            message: 'Payment refunded successfully',
            data: {
                order
            }
        });
    } catch (error) {
        console.error('Refund payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    createRazorpayOrder,
    verifyRazorpayPayment,
    getPaymentMethods,
    processCODPayment,
    getPaymentStatus,
    refundPayment
};
