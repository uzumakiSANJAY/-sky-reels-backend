const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter with Gmail SMTP (you can change to other providers)
const createTransporter = () => {
    return nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'your-email@gmail.com',
            pass: process.env.EMAIL_PASSWORD || 'your-app-password'
        }
    });
};

// Generate random OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, name = 'User') => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: {
                name: 'Sky Reels Cafe',
                address: process.env.EMAIL_USER || 'noreply@skyreels.com'
            },
            to: email,
            subject: 'Password Reset OTP - Sky Reels Cafe',
            html: `
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #FFA500; margin: 0;">Sky Reels Cafe</h1>
                        <p style="color: #666; margin: 5px 0;">Password Reset Request</p>
                    </div>
                    
                    <div style="background: #f9f9f9; padding: 30px; border-radius: 10px; margin: 20px 0;">
                        <h2 style="color: #333; margin-top: 0;">Hello ${name},</h2>
                        <p style="color: #666; line-height: 1.6;">
                            We received a request to reset your password for your Sky Reels Cafe account.
                        </p>
                        <p style="color: #666; line-height: 1.6;">
                            Your password reset OTP is:
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <span style="display: inline-block; background: #FFA500; color: white; padding: 15px 30px; font-size: 24px; font-weight: bold; border-radius: 8px; letter-spacing: 2px;">
                                ${otp}
                            </span>
                        </div>
                        <p style="color: #666; line-height: 1.6;">
                            This OTP will expire in 10 minutes for security reasons.
                        </p>
                        <p style="color: #666; line-height: 1.6;">
                            If you didn't request this password reset, please ignore this email.
                        </p>
                    </div>
                    
                    <div style="text-align: center; color: #999; font-size: 14px; margin-top: 30px;">
                        <p>Best regards,<br>Sky Reels Cafe Team</p>
                        <p style="margin-top: 20px;">
                            This is an automated email. Please do not reply to this message.
                        </p>
                    </div>
                </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('✅ OTP email sent successfully:', result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('❌ Error sending OTP email:', error);
        return { success: false, error: error.message };
    }
};

// Send password reset confirmation email
const sendPasswordResetConfirmation = async (email, name = 'User') => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: {
                name: 'Sky Reels Cafe',
                address: process.env.EMAIL_USER || 'noreply@skyreels.com'
            },
            to: email,
            subject: 'Password Reset Successful - Sky Reels Cafe',
            html: `
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #FFA500; margin: 0;">Sky Reels Cafe</h1>
                        <p style="color: #666; margin: 5px 0;">Password Reset Confirmation</p>
                    </div>
                    
                    <div style="background: #f9f9f9; padding: 30px; border-radius: 10px; margin: 20px 0;">
                        <h2 style="color: #333; margin-top: 0;">Hello ${name},</h2>
                        <p style="color: #666; line-height: 1.6;">
                            Your password has been successfully reset for your Sky Reels Cafe account.
                        </p>
                        <p style="color: #666; line-height: 1.6;">
                            You can now log in to your account using your new password.
                        </p>
                        <p style="color: #666; line-height: 1.6;">
                            If you didn't make this change, please contact our support team immediately.
                        </p>
                    </div>
                    
                    <div style="text-align: center; color: #999; font-size: 14px; margin-top: 30px;">
                        <p>Best regards,<br>Sky Reels Cafe Team</p>
                        <p style="margin-top: 20px;">
                            This is an automated email. Please do not reply to this message.
                        </p>
                    </div>
                </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Password reset confirmation email sent:', result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('❌ Error sending confirmation email:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    generateOTP,
    sendOTPEmail,
    sendPasswordResetConfirmation
};