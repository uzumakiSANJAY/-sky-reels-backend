-- Sky Reels Food Delivery Database Setup
-- Run this script in PostgreSQL to create the database

-- Create database (run this as superuser)
CREATE DATABASE skyreels_food_delivery;

-- Connect to the database
\c skyreels_food_delivery;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Note: Tables will be created automatically by Sequelize when you start the application
-- This script just sets up the database structure

-- You can also manually create tables if needed:
/*
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    address TEXT,
    profile_image VARCHAR(255),
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Food items table
CREATE TABLE food_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    preparation_time INTEGER NOT NULL,
    calories INTEGER,
    allergens TEXT[],
    dietary_info TEXT[],
    spice_level INTEGER,
    is_popular BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    stock_quantity INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    user_name VARCHAR(50) NOT NULL,
    user_phone VARCHAR(15) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_instructions TEXT,
    items JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20) DEFAULT 'cod',
    payment_status VARCHAR(20) DEFAULT 'pending',
    order_status VARCHAR(30) DEFAULT 'pending',
    estimated_delivery_time TIMESTAMP NOT NULL,
    actual_delivery_time TIMESTAMP,
    cancellation_reason TEXT,
    cancelled_by VARCHAR(20),
    cancelled_at TIMESTAMP,
    special_instructions TEXT,
    delivery_partner_id UUID,
    delivery_partner_name VARCHAR(100),
    delivery_partner_phone VARCHAR(15),
    tracking_number VARCHAR(100),
    is_urgent BOOLEAN DEFAULT FALSE,
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id),
    food_item_id UUID REFERENCES food_items(id),
    food_item_name VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    special_instructions TEXT,
    is_prepared BOOLEAN DEFAULT FALSE,
    prepared_at TIMESTAMP,
    prepared_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_food_items_category ON food_items(category);
CREATE INDEX idx_food_items_available ON food_items(is_available);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_food_item_id ON order_items(food_item_id);
*/

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON DATABASE skyreels_food_delivery TO your_user;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;

PRINT 'Database setup completed!';
PRINT 'Start the application to create tables and seed data automatically.';
