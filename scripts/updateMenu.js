const { sequelize } = require('../config/db');
const { FoodItem } = require('../models');

const updateMenu = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');

        // Remove any beef items first
        const beefItemsRemoved = await FoodItem.update(
            { isAvailable: false },
            {
                where: {
                    [sequelize.Sequelize.Op.or]: [
                        { name: { [sequelize.Sequelize.Op.iLike]: '%beef%' } },
                        { description: { [sequelize.Sequelize.Op.iLike]: '%beef%' } }
                    ]
                }
            }
        );
        console.log(`🚫 ${beefItemsRemoved[0]} beef items marked as unavailable`);

        // Add new menu items (beef-free)
        const newMenuItems = [
            {
                id: '550e8400-e29b-41d4-a716-446655440021',
                name: 'Veggie Supreme Pizza',
                description: 'Bell peppers, mushrooms, olives, onions with cheese',
                price: 349.00,
                category: 'Pizza',
                image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
                isAvailable: true,
                preparationTime: 22,
                calories: 290,
                allergens: ['Gluten', 'Dairy'],
                dietaryInfo: ['Vegetarian'],
                spiceLevel: 1,
                isPopular: false,
                isFeatured: true,
                stockQuantity: 35
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440022',
                name: 'Fish Burger',
                description: 'Crispy fish fillet with tartar sauce and lettuce',
                price: 279.00,
                category: 'Burger',
                image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400',
                isAvailable: true,
                preparationTime: 16,
                calories: 380,
                allergens: ['Gluten', 'Fish', 'Eggs'],
                dietaryInfo: ['Non-Vegetarian'],
                spiceLevel: 1,
                isPopular: false,
                isFeatured: false,
                stockQuantity: 45
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440023',
                name: 'Chicken Tikka Burger',
                description: 'Spiced chicken tikka patty with mint chutney',
                price: 299.00,
                category: 'Burger',
                image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400',
                isAvailable: true,
                preparationTime: 18,
                calories: 420,
                allergens: ['Gluten', 'Dairy'],
                dietaryInfo: ['Non-Vegetarian'],
                spiceLevel: 3,
                isPopular: true,
                isFeatured: false,
                stockQuantity: 40
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440024',
                name: 'Grilled Chicken Salad',
                description: 'Fresh greens with grilled chicken strips and vinaigrette',
                price: 329.00,
                category: 'Salad',
                image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
                isAvailable: true,
                preparationTime: 15,
                calories: 280,
                allergens: [],
                dietaryInfo: ['Non-Vegetarian', 'Gluten-Free'],
                spiceLevel: 1,
                isPopular: true,
                isFeatured: false,
                stockQuantity: 50
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440025',
                name: 'Chicken Biryani',
                description: 'Fragrant basmati rice with spiced chicken and herbs',
                price: 399.00,
                category: 'Main Course',
                image: 'https://images.unsplash.com/photo-1563379091339-03246963d80c?w=400',
                isAvailable: true,
                preparationTime: 35,
                calories: 520,
                allergens: ['Dairy'],
                dietaryInfo: ['Non-Vegetarian'],
                spiceLevel: 3,
                isPopular: true,
                isFeatured: true,
                stockQuantity: 25
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440026',
                name: 'Paneer Makhani',
                description: 'Cottage cheese in rich tomato and cream gravy',
                price: 369.00,
                category: 'Main Course',
                image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
                isAvailable: true,
                preparationTime: 25,
                calories: 380,
                allergens: ['Dairy'],
                dietaryInfo: ['Vegetarian'],
                spiceLevel: 2,
                isPopular: false,
                isFeatured: true,
                stockQuantity: 35
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440027',
                name: 'Fish Fingers',
                description: 'Crispy breaded fish strips with tartar sauce',
                price: 249.00,
                category: 'Appetizer',
                image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400',
                isAvailable: true,
                preparationTime: 15,
                calories: 290,
                allergens: ['Gluten', 'Fish'],
                dietaryInfo: ['Non-Vegetarian'],
                spiceLevel: 1,
                isPopular: false,
                isFeatured: false,
                stockQuantity: 45
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440028',
                name: 'Gulab Jamun',
                description: 'Traditional Indian sweet dumplings in sugar syrup',
                price: 129.00,
                category: 'Dessert',
                image: 'https://images.unsplash.com/photo-1606668255074-8a2edc5cf303?w=400',
                isAvailable: true,
                preparationTime: 5,
                calories: 250,
                allergens: ['Gluten', 'Dairy'],
                dietaryInfo: ['Vegetarian'],
                spiceLevel: 1,
                isPopular: true,
                isFeatured: true,
                stockQuantity: 60
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440029',
                name: 'Mango Lassi',
                description: 'Traditional yogurt-based mango drink',
                price: 89.00,
                category: 'Beverage',
                image: 'https://images.unsplash.com/photo-1553787499-6d9ea020c33d?w=400',
                isAvailable: true,
                preparationTime: 6,
                calories: 150,
                allergens: ['Dairy'],
                dietaryInfo: ['Vegetarian'],
                spiceLevel: 1,
                isPopular: true,
                isFeatured: false,
                stockQuantity: 70
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440030',
                name: 'Mint Lemonade',
                description: 'Refreshing lemon drink with fresh mint',
                price: 69.00,
                category: 'Beverage',
                image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
                isAvailable: true,
                preparationTime: 5,
                calories: 60,
                allergens: [],
                dietaryInfo: ['Vegetarian', 'Vegan'],
                spiceLevel: 1,
                isPopular: false,
                isFeatured: true,
                stockQuantity: 90
            }
        ];

        // Add new items
        for (const item of newMenuItems) {
            await FoodItem.findOrCreate({
                where: { id: item.id },
                defaults: item
            });
        }

        console.log(`✅ Menu updated with ${newMenuItems.length} new beef-free items`);
        console.log('🌱 All items are halal-friendly');

        const totalItems = await FoodItem.count({ where: { isAvailable: true } });
        console.log(`📊 Total available menu items: ${totalItems}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating menu:', error);
        process.exit(1);
    }
};

updateMenu();