const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
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
    orderId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'orders',
            key: 'id'
        },
        comment: 'Optional: Link review to specific order for verification'
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        },
        comment: 'Rating from 1 to 5 stars'
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: [0, 1000]
        }
    },
    isVerifiedPurchase: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'True if user has ordered this item before'
    },
    isReported: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    adminResponse: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Optional response from restaurant admin'
    },
    helpfulCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Number of users who found this review helpful'
    }
}, {
    tableName: 'reviews',
    indexes: [
        {
            fields: ['user_id']
        },
        {
            fields: ['food_item_id']
        },
        {
            fields: ['rating']
        },
        {
            fields: ['created_at']
        },
        {
            unique: true,
            fields: ['user_id', 'food_item_id'],
            name: 'unique_user_food_item_review'
        }
    ]
});

module.exports = Review;