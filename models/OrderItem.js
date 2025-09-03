const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'orders',
            key: 'id'
        }
    },
    foodItemId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'food_items',
            key: 'id'
        }
    },
    foodItemName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    specialInstructions: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    isPrepared: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    preparedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    preparedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'order_items',
    indexes: [
        {
            fields: ['order_id']
        },
        {
            fields: ['food_item_id']
        },
        {
            fields: ['is_prepared']
        }
    ]
});

module.exports = OrderItem;
