const User = require('./User');
const FoodItem = require('./FoodItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Review = require('./Review');

// Define associations
User.hasMany(Order, {
    foreignKey: 'userId',
    as: 'orders'
});

Order.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

Order.hasMany(OrderItem, {
    foreignKey: 'orderId',
    as: 'orderItems'
});

OrderItem.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order'
});

FoodItem.hasMany(OrderItem, {
    foreignKey: 'foodItemId',
    as: 'orderItems'
});

OrderItem.belongsTo(FoodItem, {
    foreignKey: 'foodItemId',
    as: 'foodItem'
});

// User who prepared the order item
User.hasMany(OrderItem, {
    foreignKey: 'preparedBy',
    as: 'preparedItems'
});

OrderItem.belongsTo(User, {
    foreignKey: 'preparedBy',
    as: 'preparedByUser'
});

// Review associations
User.hasMany(Review, {
    foreignKey: 'userId',
    as: 'reviews'
});

Review.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

FoodItem.hasMany(Review, {
    foreignKey: 'foodItemId',
    as: 'reviews'
});

Review.belongsTo(FoodItem, {
    foreignKey: 'foodItemId',
    as: 'foodItem'
});

Order.hasMany(Review, {
    foreignKey: 'orderId',
    as: 'reviews'
});

Review.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order'
});

module.exports = {
    User,
    FoodItem,
    Order,
    OrderItem,
    Review
};
