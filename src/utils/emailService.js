const nodemailer = require('nodemailer');
const CryptoJS = require('crypto-js'); // Import CryptoJS for encryption
const OTP = require('../models/otpModel');
require('dotenv').config(); // To use environment variables

class emailService {
    static async sendEmail(_id, email, subject, forgotPassword = undefined) {
        try {
            const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
            const transporter = nodemailer.createTransport({
                host: process.env.GMAIL_SERVICE_HOST,
                port: Number(process.env.GMAIL_SERVICE_PORT),
                secure: Boolean(process.env.GMAIL_SERVICE_SECURE), // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const encryptedOtp = CryptoJS.AES.encrypt(otp.toString(), process.env.PASS_SECRET).toString();

            // Xóa tất cả OTP cũ trước khi lưu
            await OTP.deleteMany({ userId: _id });
            
            // Lưu OTP mới
            await new OTP({
                userId: _id,
                OTP: encryptedOtp,
                createdAt: Date.now(),
            }).save();

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: subject,
                html: forgotPassword
                    ? `<p>Enter <b>${otp}</b> in the app to verify forgot your password.</p>`
                    : `<p>Enter <b>${otp}</b> in the app to verify your account.</p>`
            });

            console.log('email sent successfully');
            return { success: true, message: 'Email sent successfully' };
        } catch (error) {
            console.error('Error sending email:', error.message);
            throw new Error('Error sending email: ' + error.message);
        }
    }

    static async verifyOTP(userId, userOtp) {
        try {
            // Truy vấn lấy OTP mới nhất
            const storedOtpData = await OTP.findOne({ userId }).sort({ createdAt: -1 }); 

            if (!storedOtpData) {
                return { success: false, message: 'OTP does not exist.' };
            }

            // Giải mã OTP
            const decryptedOtp = CryptoJS.AES.decrypt(storedOtpData.OTP, process.env.PASS_SECRET).toString(
                CryptoJS.enc.Utf8
            );

            // Log giá trị để kiểm tra
            console.log('Stored OTP (encrypted):', storedOtpData.OTP);
            console.log('Decrypted OTP:', decryptedOtp);
            console.log('User Provided OTP:', userOtp);

            // So sánh OTP
            if (userOtp !== decryptedOtp) {
                return { success: false, message: 'Incorrect OTP.' };
            }

            return { success: true, message: 'OTP verified successfully!' };
        } catch (error) {
            console.error('Error during OTP verification:', error);
            return { success: false, message: 'An error occurred during OTP verification.' };
        }
    }

    static async deleteOTP(userId) {
        await OTP.deleteMany({ userId }); // Delete OTP after verification
    }
}

module.exports = emailService; // Export class to be used elsewhere
