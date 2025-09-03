const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'skyreels_food_delivery',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || '12345',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: true,
            freezeTableName: true
        }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');

        // Sync all models (in development)
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('✅ Database models synchronized');

            // Seed initial data
            try {
                const { seedInitialData } = require('../seeders/initialData');
                await seedInitialData();
            } catch (seedError) {
                console.log('⚠️ Initial data seeding skipped (may already exist)');
            }
        }
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
