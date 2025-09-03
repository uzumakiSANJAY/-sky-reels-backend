const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { connectDB } = require('./config/db');
require('./models'); // Import all models to establish relationships

const app = express();
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// API routes
app.use('/api/v1', routes);

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);

    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: error.errors.map(err => ({
                field: err.path,
                message: err.message
            }))
        });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            success: false,
            message: 'Duplicate entry',
            error: error.errors[0].message
        });
    }

    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});

const PORT = process.env.PORT || 5001;

// Start server
const startServer = async () => {
    try {
        // Connect to database
        await connectDB();

        // Start server - bind to all interfaces for React Native access
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📱 API available at http://localhost:${PORT}/api/v1`);
            console.log(`📱 React Native API: http://192.168.29.135:${PORT}/api/v1`);
            console.log(`🏥 Health check at http://localhost:${PORT}/api/v1/health`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
