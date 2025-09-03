const { User } = require('../models');
const { generateToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { generateOTP, sendOTPEmail, sendPasswordResetConfirmation } = require('../services/mailService');

// User Registration
const registerUser = async (req, res) => {
    try {
        console.log("***********");
        const { name, email, password, phone, address } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            phone,
            address,
            isAdmin: false
        });

        // Generate token
        const token = generateToken(user.id);

        // Return user data (without password) and token
        const userResponse = user.getPublicProfile();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: userResponse,
                token
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// User Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated. Please contact support.'
            });
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        await user.update({ lastLogin: new Date() });

        // Generate token
        const token = generateToken(user.id);

        // Return user data and token
        const userResponse = user.getPublicProfile();

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: userResponse,
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Admin Login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user is admin
        if (!user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated. Please contact support.'
            });
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        await user.update({ lastLogin: new Date() });

        // Generate token
        const token = generateToken(user.id);

        // Return user data and token
        const userResponse = user.getPublicProfile();

        res.json({
            success: true,
            message: 'Admin login successful',
            data: {
                user: userResponse,
                token
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get Current User Profile
const getCurrentUser = async (req, res) => {
    try {
        const userResponse = req.user.getPublicProfile();

        res.json({
            success: true,
            data: {
                user: userResponse
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update User Profile
const updateProfile = async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        const userId = req.user.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update user profile
        await user.update({
            name: name || user.name,
            phone: phone || user.phone,
            address: address || user.address
        });

        const userResponse = user.getPublicProfile();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: userResponse
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Change Password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify current password
        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        await user.update({ password: newPassword });

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Logout (client-side token removal)
const logout = async (req, res) => {
    try {
        // In a stateless JWT system, logout is handled client-side
        // by removing the token from storage
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Request Password Reset (Send OTP)
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email address'
            });
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // Save OTP and expiration to user
        await user.update({
            resetPasswordOTP: otp,
            resetPasswordExpires: otpExpires
        });

        // Send OTP email
        const emailResult = await sendOTPEmail(email, otp, user.name);

        if (emailResult.success) {
            res.json({
                success: true,
                message: 'Password reset OTP has been sent to your email'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send OTP email. Please try again.'
            });
        }
    } catch (error) {
        console.error('Request password reset error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Verify OTP
const verifyPasswordResetOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find user with matching email and OTP
        const user = await User.findOne({ 
            where: { 
                email,
                resetPasswordOTP: otp,
                resetPasswordExpires: {
                    [Op.gt]: new Date()
                }
            } 
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        res.json({
            success: true,
            message: 'OTP verified successfully'
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Reset Password with OTP
const resetPasswordWithOTP = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Find user with matching email and OTP
        const user = await User.findOne({ 
            where: { 
                email,
                resetPasswordOTP: otp,
                resetPasswordExpires: {
                    [Op.gt]: new Date()
                }
            } 
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Validate new password
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Update password and clear OTP fields
        await user.update({
            password: newPassword,
            resetPasswordOTP: null,
            resetPasswordExpires: null
        });

        // Send confirmation email
        await sendPasswordResetConfirmation(email, user.name);

        res.json({
            success: true,
            message: 'Password has been reset successfully'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    adminLogin,
    getCurrentUser,
    updateProfile,
    changePassword,
    logout,
    requestPasswordReset,
    verifyPasswordResetOTP,
    resetPasswordWithOTP
};
