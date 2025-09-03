const { Order, OrderItem, User, FoodItem } = require('../models');
const { Op } = require('sequelize');

// Create new order
const createOrder = async (req, res) => {
    try {
        const {
            deliveryAddress,
            deliveryInstructions,
            items,
            paymentMethod,
            specialInstructions
        } = req.body;

        const userId = req.user.id;
        const user = req.user;

        // Calculate totals
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const foodItem = await FoodItem.findByPk(item.foodItemId);
            if (!foodItem || !foodItem.isAvailable) {
                return res.status(400).json({
                    success: false,
                    message: `Food item "${item.name}" is not available`
                });
            }

            const itemTotal = foodItem.price * item.quantity;
            subtotal += itemTotal;

            orderItems.push({
                foodItemId: foodItem.id,
                foodItemName: foodItem.name,
                quantity: item.quantity,
                unitPrice: foodItem.price,
                totalPrice: itemTotal
            });
        }

        const deliveryFee = 49;
        const tax = subtotal * 0.08; // 8% tax
        const totalAmount = subtotal + deliveryFee + tax;

        // Calculate estimated delivery time (45 minutes from now)
        const estimatedDeliveryTime = new Date(Date.now() + 45 * 60000);

        // Create order
        const order = await Order.create({
            userId,
            userName: user.name,
            userPhone: user.phone,
            userEmail: user.email,
            deliveryAddress,
            deliveryInstructions,
            items: orderItems,
            subtotal,
            deliveryFee,
            tax,
            totalAmount,
            paymentMethod,
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
            orderStatus: 'pending',
            estimatedDeliveryTime,
            specialInstructions
        });

        // Create order items
        for (const item of orderItems) {
            await OrderItem.create({
                orderId: order.id,
                foodItemId: item.foodItemId,
                foodItemName: item.foodItemName,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice
            });
        }

        // Fetch complete order with items
        const completeOrder = await Order.findByPk(order.id, {
            include: [
                {
                    model: OrderItem,
                    as: 'orderItems'
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email', 'phone']
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: {
                order: completeOrder
            }
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get user orders
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10, status } = req.query;

        const whereClause = { userId };
        if (status) {
            whereClause.orderStatus = status;
        }

        const offset = (page - 1) * limit;

        const { count, rows: orders } = await Order.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: OrderItem,
                    as: 'orderItems'
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        const totalPages = Math.ceil(count / limit);

        res.json({
            success: true,
            data: {
                orders,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const order = await Order.findOne({
            where: { id, userId },
            include: [
                {
                    model: OrderItem,
                    as: 'orderItems'
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email', 'phone']
                }
            ]
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
                order
            }
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get all orders (Admin only)
const getAllOrders = async (req, res) => {
    try {
        const {
            status,
            paymentStatus,
            page = 1,
            limit = 20,
            search,
            startDate,
            endDate
        } = req.query;

        const whereClause = {};

        if (status) {
            whereClause.orderStatus = status;
        }

        if (paymentStatus) {
            whereClause.paymentStatus = paymentStatus;
        }

        if (search) {
            whereClause[Op.or] = [
                { orderNumber: { [Op.iLike]: `%${search}%` } },
                { userName: { [Op.iLike]: `%${search}%` } },
                { userPhone: { [Op.iLike]: `%${search}%` } }
            ];
        }

        if (startDate && endDate) {
            whereClause.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        const offset = (page - 1) * limit;

        const { count, rows: orders } = await Order.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: OrderItem,
                    as: 'orderItems'
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email', 'phone']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        const totalPages = Math.ceil(count / limit);

        res.json({
            success: true,
            data: {
                orders,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus, notes } = req.body;

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update order status
        await order.update({ orderStatus });

        // Update order items preparation status if order is ready
        if (orderStatus === 'ready') {
            await OrderItem.update(
                { 
                    isPrepared: true,
                    preparedAt: new Date(),
                    preparedBy: req.user.id
                },
                { where: { orderId: id } }
            );
        }

        // Update actual delivery time if delivered
        if (orderStatus === 'delivered') {
            await order.update({ actualDeliveryTime: new Date() });
        }

        res.json({
            success: true,
            message: 'Order status updated successfully',
            data: {
                order
            }
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update payment status (Admin only)
const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentStatus } = req.body;

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        await order.update({ paymentStatus });

        res.json({
            success: true,
            message: 'Payment status updated successfully',
            data: {
                order
            }
        });
    } catch (error) {
        console.error('Update payment status error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Cancel order
const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { cancellationReason } = req.body;
        const userId = req.user.id;

        const order = await Order.findOne({
            where: { id, userId }
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if order can be cancelled
        if (!['pending', 'confirmed'].includes(order.orderStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Order cannot be cancelled at this stage'
            });
        }

        await order.update({
            orderStatus: 'cancelled',
            cancellationReason,
            cancelledBy: 'user',
            cancelledAt: new Date()
        });

        res.json({
            success: true,
            message: 'Order cancelled successfully',
            data: {
                order
            }
        });
    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get order statistics (Admin only)
const getOrderStatistics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const whereClause = {};
        if (startDate && endDate) {
            whereClause.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        const totalOrders = await Order.count({ where: whereClause });
        const pendingOrders = await Order.count({ 
            where: { ...whereClause, orderStatus: 'pending' }
        });
        const confirmedOrders = await Order.count({ 
            where: { ...whereClause, orderStatus: 'confirmed' }
        });
        const preparingOrders = await Order.count({ 
            where: { ...whereClause, orderStatus: 'preparing' }
        });
        const readyOrders = await Order.count({ 
            where: { ...whereClause, orderStatus: 'ready' }
        });
        const deliveredOrders = await Order.count({ 
            where: { ...whereClause, orderStatus: 'delivered' }
        });
        const cancelledOrders = await Order.count({ 
            where: { ...whereClause, orderStatus: 'cancelled' }
        });

        const totalRevenue = await Order.sum('totalAmount', {
            where: { 
                ...whereClause,
                paymentStatus: 'paid',
                orderStatus: { [Op.ne]: 'cancelled' }
            }
        });

        const averageOrderValue = totalRevenue / deliveredOrders || 0;

        res.json({
            success: true,
            data: {
                statistics: {
                    totalOrders,
                    pendingOrders,
                    confirmedOrders,
                    preparingOrders,
                    readyOrders,
                    deliveredOrders,
                    cancelledOrders,
                    totalRevenue: totalRevenue || 0,
                    averageOrderValue: parseFloat(averageOrderValue.toFixed(2))
                }
            }
        });
    } catch (error) {
        console.error('Get order statistics error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,
    getOrderStatistics
};
