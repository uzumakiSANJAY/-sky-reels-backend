const { User, FoodItem } = require('../models');
const bcrypt = require('bcryptjs');

const seedInitialData = async () => {
    try {
        console.log('🌱 Seeding initial data...');

        // Create admin user
        const adminPassword = await bcrypt.hash('admin123', 10);
        const adminUser = await User.findOrCreate({
            where: { email: 'admin@skyreels.com' },
            defaults: {
                name: 'Admin User',
                email: 'admin@skyreels.com',
                password: adminPassword,
                phone: '9876543210',
                address: 'Sky Reels Restaurant, Main Street',
                isAdmin: true,
                isActive: true
            }
        });

        if (adminUser[1]) {
            console.log('✅ Admin user created');
        } else {
            console.log('ℹ️ Admin user already exists');
        }

        // Create demo user
        const userPassword = await bcrypt.hash('password', 10);
        const demoUser = await User.findOrCreate({
            where: { email: 'user@example.com' },
            defaults: {
                name: 'Demo User',
                email: 'user@example.com',
                password: userPassword,
                phone: '9876543211',
                address: '123 Demo Street, Demo City',
                isAdmin: false,
                isActive: true
            }
        });

        if (demoUser[1]) {
            console.log('✅ Demo user created');
        } else {
            console.log('ℹ️ Demo user already exists');
        }

        // Create sample food items
        const sampleFoodItems = [
            {
                name: 'Margherita Pizza',
                description: 'Classic tomato sauce with mozzarella cheese and fresh basil',
                price: 299,
                category: 'Pizza',
                image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400',
                preparationTime: 20,
                calories: 285,
                allergens: ['Gluten', 'Dairy'],
                dietaryInfo: ['Vegetarian'],
                spiceLevel: 1,
                isPopular: true,
                isFeatured: true,
                isAvailable: true
            },
            {
                name: 'Chicken Burger',
                description: 'Grilled chicken patty with lettuce, tomato, and special sauce',
                price: 249,
                category: 'Burger',
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
                preparationTime: 15,
                calories: 450,
                allergens: ['Gluten', 'Eggs'],
                dietaryInfo: ['Non-Vegetarian'],
                spiceLevel: 2,
                isPopular: true,
                isFeatured: false,
                isAvailable: true
            },
            {
                name: 'Caesar Salad',
                description: 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan',
                price: 199,
                category: 'Salad',
                image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
                preparationTime: 10,
                calories: 180,
                allergens: ['Gluten', 'Dairy'],
                dietaryInfo: ['Vegetarian'],
                spiceLevel: 1,
                isPopular: false,
                isFeatured: true,
                isAvailable: true
            },
            {
                name: 'Pasta Carbonara',
                description: 'Spaghetti with creamy sauce, bacon, and parmesan cheese',
                price: 349,
                category: 'Pasta',
                image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400',
                preparationTime: 25,
                calories: 520,
                allergens: ['Gluten', 'Dairy', 'Eggs'],
                dietaryInfo: ['Non-Vegetarian'],
                spiceLevel: 1,
                isPopular: true,
                isFeatured: false,
                isAvailable: true
            },
            {
                name: 'Chocolate Brownie',
                description: 'Rich chocolate brownie with vanilla ice cream',
                price: 159,
                category: 'Dessert',
                image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
                preparationTime: 5,
                calories: 320,
                allergens: ['Gluten', 'Dairy', 'Eggs'],
                dietaryInfo: ['Vegetarian'],
                spiceLevel: 1,
                isPopular: false,
                isFeatured: true,
                isAvailable: true
            },
            {
                name: 'Iced Latte',
                description: 'Smooth espresso with cold milk and ice',
                price: 99,
                category: 'Beverage',
                image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
                preparationTime: 8,
                calories: 120,
                allergens: ['Dairy'],
                dietaryInfo: ['Vegetarian'],
                spiceLevel: 1,
                isPopular: true,
                isFeatured: false,
                isAvailable: true
            },
            {
                name: 'Garlic Bread',
                description: 'Toasted bread with garlic butter and herbs',
                price: 79,
                category: 'Bread',
                image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
                preparationTime: 7,
                calories: 180,
                allergens: ['Gluten', 'Dairy'],
                dietaryInfo: ['Vegetarian'],
                spiceLevel: 1,
                isPopular: false,
                isFeatured: false,
                isAvailable: true
            },
            {
                name: 'Chicken Wings',
                description: 'Crispy fried chicken wings with hot sauce',
                price: 279,
                category: 'Appetizer',
                image: 'https://images.unsplash.com/photo-1567620832904-9d843b3e3e8f?w=400',
                preparationTime: 18,
                calories: 380,
                allergens: ['Gluten', 'Eggs'],
                dietaryInfo: ['Non-Vegetarian'],
                spiceLevel: 4,
                isPopular: true,
                isFeatured: false,
                isAvailable: true
            }
        ];

        for (const foodItem of sampleFoodItems) {
            await FoodItem.findOrCreate({
                where: { name: foodItem.name },
                defaults: foodItem
            });
        }

        console.log('✅ Sample food items created');
        console.log('🎉 Initial data seeding completed!');

    } catch (error) {
        console.error('❌ Error seeding initial data:', error);
        throw error;
    }
};

module.exports = { seedInitialData };
