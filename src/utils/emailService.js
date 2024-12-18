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
            // const expiresAt = ;
            await new OTP({
                userId: _id,
                OTP: encryptedOtp,
                expiresAt:Date.now() + (5 * 60 * 1000)  // 5 minutes expiry
            }).save();

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: subject,
                html: forgotPassword
                    ? `<p>Enter <b>${otp}</b> in the app to verify forgot your password.</p>`
                    : `<p>Enter <b>${otp}</b> in the app to verify your account.</p>`,
            });

            console.log('email sent successfully');
            return { success: true, message: 'Email sent successfully' };
        } catch (error) {
            console.error('Error sending email:', error.message);
            throw new Error('Error sending email' + error.message);
        }
    }

    static async verifyOTP(email, userOtp) {
        try {
            const storedOtpData = await OTP.findOne({ email }); // Fetch OTP from database
            if (!storedOtpData) {
                return { success: false, message: 'OTP does not exist.' };
            }
            // Log the expiration time and current time for debugging
            console.log('OTP Created At:', Date.now(), 'Expires At:', storedOtpData.expiresAt);
            // Check expiration
            const expiresAts = storedOtpData.expiresAt; 
            if (Date.now() > expiresAts  ) {
                return { success: false, message: 'OTP has expired.' };
            }

            // Decrypt the stored OTP
            const decryptedOtp = CryptoJS.AES.decrypt(storedOtpData.OTP, process.env.PASS_SECRET).toString(
                CryptoJS.enc.Utf8
            );

            // Debugging logs
            console.log('Stored OTP (encrypted):', storedOtpData.OTP);
            console.log('Decrypted OTP:', decryptedOtp);
            console.log('User Provided OTP:', userOtp);

            // Check if user provided OTP matches decrypted OTP
            if (userOtp !== decryptedOtp) {
                return { success: false, message: 'Incorrect OTP.' };
            }

            return { success: true, message: 'OTP verified successfully!' };
        } catch (error) {
            console.error('Error during OTP verification:', error);
            return { success: false, message: 'An error occurred during OTP verification.' };
        }
    }

    static async deleteOTP(email) {
        await OTP.deleteOne({ email }); // Delete OTP after verification
    }
}

module.exports = emailService; // Export class to be used elsewhere
