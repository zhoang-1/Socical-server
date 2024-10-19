class OtpService {
    static otpStorage = {}; // Biến lưu trữ OTP tạm thời
    // // Lưu OTP kèm thời gian hết hạn và trạng thái
    // static generateOTP() {
    //     const otp = Math.floor(100000 + Math.random() * 900000); // Tạo OTP 6 chữ số
    //     const expiresIn = 5 * 60 * 1000; // 5 phút (mili giây)
    //     const expirationTime = Date.now() + expiresIn;
    //     OtpService.otpStorage[email] = {
    //         otp,
    //         expirationTime,
    //     };
    //     return otp;
    // }
    // // Phương thức static để kiểm tra OTP
    
    // Hàm gửi email
    // static async sendEmail(email, subject, context) {
    //     try {
    //         const transporter = nodemailer.createTransport({
    //             host: process.env.GMAIL_SERVICE_HOST,
    //             port: Number(process.env.GMAIL_SERVICE_PORT),
    //             secure: Boolean(process.env.GMAIL_SERVICE_SECURE), // true cho 465, false cho các cổng khác
    //             auth: {
    //                 user: process.env.EMAIL_USER,
    //                 pass: process.env.EMAIL_PASS,
    //             },
    //         });

    //         await transporter.sendMail({
    //             from: process.env.EMAIL_USER,
    //             to: email,
    //             subject: subject,
    //             html: context,
    //         });
    //         console.log('Email sent successfully ');
    //     } catch (error) {
    //         console.error('Error sending email:', error);
    //     }
    // }
}

module.exports = OtpService;
