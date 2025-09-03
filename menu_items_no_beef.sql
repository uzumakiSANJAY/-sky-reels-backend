-- SQL Insert Query for Sky Reels Menu (No Beef Items)
-- Halal-friendly menu with diverse options

INSERT INTO food_items (
    id, name, description, price, category, image, is_available, preparation_time, 
    calories, allergens, dietary_info, spice_level, is_popular, is_featured, 
    stock_quantity, created_at, updated_at
) VALUES 
-- Pizza Category
('550e8400-e29b-41d4-a716-446655440001', 'Margherita Pizza', 'Classic tomato sauce with fresh mozzarella cheese and basil leaves', 299.00, 'Pizza', 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400', true, 20, 285, ARRAY['Gluten', 'Dairy'], ARRAY['Vegetarian'], 1, true, true, 50, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440002', 'Pepperoni Pizza', 'Chicken pepperoni slices with mozzarella cheese on tomato base', 399.00, 'Pizza', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', true, 25, 320, ARRAY['Gluten', 'Dairy'], ARRAY['Non-Vegetarian'], 2, true, false, 45, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440003', 'BBQ Chicken Pizza', 'Grilled chicken with BBQ sauce, onions, and bell peppers', 449.00, 'Pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', true, 28, 380, ARRAY['Gluten', 'Dairy'], ARRAY['Non-Vegetarian'], 3, false, true, 40, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440021', 'Veggie Supreme Pizza', 'Bell peppers, mushrooms, olives, onions with cheese', 349.00, 'Pizza', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', true, 22, 290, ARRAY['Gluten', 'Dairy'], ARRAY['Vegetarian'], 1, false, true, 35, NOW(), NOW()),

-- Burger Category (No Beef)
('550e8400-e29b-41d4-a716-446655440004', 'Classic Chicken Burger', 'Grilled chicken patty with lettuce, tomato, and mayo', 249.00, 'Burger', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', true, 15, 450, ARRAY['Gluten', 'Eggs'], ARRAY['Non-Vegetarian'], 2, true, false, 60, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440006', 'Veggie Burger', 'Plant-based patty with fresh vegetables and avocado', 199.00, 'Burger', 'https://images.unsplash.com/photo-1525059696034-4967a729002e?w=400', true, 12, 280, ARRAY['Gluten'], ARRAY['Vegetarian', 'Vegan'], 1, false, false, 55, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440022', 'Fish Burger', 'Crispy fish fillet with tartar sauce and lettuce', 279.00, 'Burger', 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400', true, 16, 380, ARRAY['Gluten', 'Fish', 'Eggs'], ARRAY['Non-Vegetarian'], 1, false, false, 45, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440023', 'Chicken Tikka Burger', 'Spiced chicken tikka patty with mint chutney', 299.00, 'Burger', 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400', true, 18, 420, ARRAY['Gluten', 'Dairy'], ARRAY['Non-Vegetarian'], 3, true, false, 40, NOW(), NOW()),

-- Pasta Category
('550e8400-e29b-41d4-a716-446655440007', 'Spaghetti Carbonara', 'Creamy pasta with chicken, eggs, and parmesan cheese', 349.00, 'Pasta', 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400', true, 25, 520, ARRAY['Gluten', 'Dairy', 'Eggs'], ARRAY['Non-Vegetarian'], 1, true, false, 42, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440008', 'Penne Arrabbiata', 'Spicy tomato sauce with garlic, chili, and herbs', 299.00, 'Pasta', 'https://images.unsplash.com/photo-1563379091339-03246963d80c?w=400', true, 20, 320, ARRAY['Gluten'], ARRAY['Vegetarian', 'Vegan'], 4, false, true, 48, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440009', 'Chicken Alfredo Pasta', 'Creamy alfredo sauce with grilled chicken', 429.00, 'Pasta', 'https://images.unsplash.com/photo-1621657153832-0baa4c1b3a64?w=400', true, 30, 480, ARRAY['Gluten', 'Dairy'], ARRAY['Non-Vegetarian'], 2, true, true, 25, NOW(), NOW()),

-- Salad Category
('550e8400-e29b-41d4-a716-446655440010', 'Caesar Salad', 'Crisp romaine lettuce with Caesar dressing and croutons', 199.00, 'Salad', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400', true, 10, 180, ARRAY['Gluten', 'Dairy'], ARRAY['Vegetarian'], 1, false, true, 65, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440011', 'Greek Salad', 'Mixed greens with feta cheese, olives, and Mediterranean dressing', 229.00, 'Salad', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400', true, 8, 220, ARRAY['Dairy'], ARRAY['Vegetarian'], 1, false, false, 58, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440024', 'Grilled Chicken Salad', 'Fresh greens with grilled chicken strips and vinaigrette', 329.00, 'Salad', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', true, 15, 280, ARRAY[]::text[], ARRAY['Non-Vegetarian', 'Gluten-Free'], 1, true, false, 50, NOW(), NOW()),

-- Main Course Category
('550e8400-e29b-41d4-a716-446655440016', 'Grilled Salmon', 'Atlantic salmon fillet with lemon butter sauce', 599.00, 'Main Course', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400', true, 22, 350, ARRAY['Fish'], ARRAY['Non-Vegetarian', 'Gluten-Free'], 1, true, true, 30, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440017', 'Butter Chicken', 'Creamy tomato-based curry with tender chicken pieces', 449.00, 'Main Course', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', true, 30, 420, ARRAY['Dairy'], ARRAY['Non-Vegetarian'], 3, true, false, 38, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440025', 'Chicken Biryani', 'Fragrant basmati rice with spiced chicken and herbs', 399.00, 'Main Course', 'https://images.unsplash.com/photo-1563379091339-03246963d80c?w=400', true, 35, 520, ARRAY['Dairy'], ARRAY['Non-Vegetarian'], 3, true, true, 25, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440026', 'Paneer Makhani', 'Cottage cheese in rich tomato and cream gravy', 369.00, 'Main Course', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', true, 25, 380, ARRAY['Dairy'], ARRAY['Vegetarian'], 2, false, true, 35, NOW(), NOW()),

-- Appetizer Category
('550e8400-e29b-41d4-a716-446655440018', 'Chicken Wings', 'Crispy chicken wings with spicy sauce', 279.00, 'Appetizer', 'https://images.unsplash.com/photo-1567620832904-9d843b3e3e8f?w=400', true, 18, 380, ARRAY['Gluten'], ARRAY['Non-Vegetarian'], 4, true, false, 52, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440019', 'Mozzarella Sticks', 'Deep-fried mozzarella with marinara sauce', 199.00, 'Appetizer', 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400', true, 12, 320, ARRAY['Gluten', 'Dairy'], ARRAY['Vegetarian'], 1, false, false, 68, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440027', 'Fish Fingers', 'Crispy breaded fish strips with tartar sauce', 249.00, 'Appetizer', 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400', true, 15, 290, ARRAY['Gluten', 'Fish'], ARRAY['Non-Vegetarian'], 1, false, false, 45, NOW(), NOW()),

-- Dessert Category
('550e8400-e29b-41d4-a716-446655440012', 'Chocolate Brownie', 'Rich chocolate brownie with vanilla ice cream', 159.00, 'Dessert', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400', true, 5, 320, ARRAY['Gluten', 'Dairy', 'Eggs'], ARRAY['Vegetarian'], 1, false, true, 75, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440013', 'Tiramisu', 'Classic Italian dessert with coffee and mascarpone', 199.00, 'Dessert', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', true, 3, 280, ARRAY['Gluten', 'Dairy', 'Eggs'], ARRAY['Vegetarian'], 1, true, false, 45, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440028', 'Gulab Jamun', 'Traditional Indian sweet dumplings in sugar syrup', 129.00, 'Dessert', 'https://images.unsplash.com/photo-1606668255074-8a2edc5cf303?w=400', true, 5, 250, ARRAY['Gluten', 'Dairy'], ARRAY['Vegetarian'], 1, true, true, 60, NOW(), NOW()),

-- Beverage Category
('550e8400-e29b-41d4-a716-446655440014', 'Iced Coffee Latte', 'Cold brew coffee with steamed milk and ice', 99.00, 'Beverage', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', true, 8, 120, ARRAY['Dairy'], ARRAY['Vegetarian'], 1, true, false, 100, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440015', 'Fresh Orange Juice', 'Freshly squeezed orange juice', 79.00, 'Beverage', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400', true, 5, 80, ARRAY[]::text[], ARRAY['Vegetarian', 'Vegan'], 1, false, false, 85, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440029', 'Mango Lassi', 'Traditional yogurt-based mango drink', 89.00, 'Beverage', 'https://images.unsplash.com/photo-1553787499-6d9ea020c33d?w=400', true, 6, 150, ARRAY['Dairy'], ARRAY['Vegetarian'], 1, true, false, 70, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440030', 'Mint Lemonade', 'Refreshing lemon drink with fresh mint', 69.00, 'Beverage', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400', true, 5, 60, ARRAY[]::text[], ARRAY['Vegetarian', 'Vegan'], 1, false, true, 90, NOW(), NOW()),

-- Bread Category
('550e8400-e29b-41d4-a716-446655440020', 'Garlic Naan Bread', 'Traditional Indian bread with garlic and butter', 89.00, 'Bread', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', true, 8, 220, ARRAY['Gluten', 'Dairy'], ARRAY['Vegetarian'], 2, false, false, 95, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440031', 'Butter Roti', 'Whole wheat flatbread with butter', 49.00, 'Bread', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', true, 6, 150, ARRAY['Gluten', 'Dairy'], ARRAY['Vegetarian'], 1, false, false, 100, NOW(), NOW()),

('550e8400-e29b-41d4-a716-446655440032', 'Cheese Garlic Bread', 'Crusty bread with cheese and garlic butter', 149.00, 'Bread', 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400', true, 10, 280, ARRAY['Gluten', 'Dairy'], ARRAY['Vegetarian'], 1, true, false, 75, NOW(), NOW());

-- Update any existing beef items to be unavailable
UPDATE food_items SET is_available = false WHERE LOWER(name) LIKE '%beef%' OR LOWER(description) LIKE '%beef%';