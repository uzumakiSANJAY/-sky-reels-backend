const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    orderNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'Human-readable order number like ORD-2024-001'
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userPhone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userEmail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deliveryAddress: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    deliveryInstructions: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    items: {
        type: DataTypes.JSONB,
        allowNull: false,
        comment: 'Array of ordered items with quantity and price'
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    deliveryFee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    tax: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    paymentMethod: {
        type: DataTypes.ENUM('cod', 'razorpay', 'card', 'upi'),
        allowNull: false,
        defaultValue: 'cod'
    },
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: 'pending'
    },
    orderStatus: {
        type: DataTypes.ENUM('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
    },
    estimatedDeliveryTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    actualDeliveryTime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    cancellationReason: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    cancelledBy: {
        type: DataTypes.ENUM('user', 'admin', 'system'),
        allowNull: true
    },
    cancelledAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    specialInstructions: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    deliveryPartnerId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'ID of delivery partner assigned to this order'
    },
    deliveryPartnerName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    deliveryPartnerPhone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    trackingNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    isUrgent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    priority: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
            min: 1,
            max: 5
        },
        comment: 'Priority level from 1 (lowest) to 5 (highest)'
    }
}, {
    tableName: 'orders',
    indexes: [
        {
            fields: ['user_id']
        },
        {
            fields: ['order_status']
        },
        {
            fields: ['payment_status']
        },
        {
            fields: ['created_at']
        },
        {
            fields: ['order_number']
        }
    ],
    hooks: {
        beforeCreate: async (order) => {
            // Generate order number if not provided
            if (!order.orderNumber) {
                const date = new Date();
                const year = date.getFullYear();
                const count = await Order.count({
                    where: {
                        createdAt: {
                            [sequelize.Op.gte]: new Date(year, 0, 1),
                            [sequelize.Op.lt]: new Date(year + 1, 0, 1)
                        }
                    }
                });
                order.orderNumber = `ORD-${year}-${String(count + 1).padStart(3, '0')}`;
            }
        }
    }
});

module.exports = Order;
