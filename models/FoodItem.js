const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const FoodItem = sequelize.define('FoodItem', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 100]
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['Pizza', 'Burger', 'Salad', 'Pasta', 'Dessert', 'Beverage', 'Appetizer', 'Main Course', 'Soup', 'Bread']]
        }
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true
        }
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    preparationTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 120
        },
        comment: 'Preparation time in minutes'
    },
    calories: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0
        }
    },
    allergens: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: []
    },
    dietaryInfo: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
        comment: 'e.g., ["Vegetarian", "Gluten-Free", "Vegan"]'
    },
    spiceLevel: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 5
        },
        comment: 'Spice level from 1 (mild) to 5 (very hot)'
    },
    isPopular: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    stockQuantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: 'Stock quantity for inventory management'
    }
}, {
    tableName: 'food_items',
    indexes: [
        {
            fields: ['category']
        },
        {
            fields: ['is_available']
        },
        {
            fields: ['is_popular']
        },
        {
            fields: ['is_featured']
        }
    ]
});

module.exports = FoodItem;
