const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const {
    validateUserRegistration,
    validateUserLogin
} = require('../middleware/validation');

// Public routes
router.post('/register', validateUserRegistration, authController.registerUser);
router.post('/login', validateUserLogin, authController.loginUser);
router.post('/admin/login', validateUserLogin, authController.adminLogin);

// Password reset routes
router.post('/forgot-password', authController.requestPasswordReset);
router.post('/verify-otp', authController.verifyPasswordResetOTP);
router.post('/reset-password', authController.resetPasswordWithOTP);

// Protected routes
router.get('/profile', auth, authController.getCurrentUser);
router.put('/profile', auth, authController.updateProfile);
router.put('/change-password', auth, authController.changePassword);
router.post('/logout', auth, authController.logout);

module.exports = router;
