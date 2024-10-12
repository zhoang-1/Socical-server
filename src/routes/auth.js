const router = require('express').Router();
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();
const User = require('../models/userProfileModel');

//REGISTER
// Đăng ký người dùng mới
router.post('/signup', async (req, res) => {
    const { email } = req.body;
    try {
        // Kiểm tra xem người dùng đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const newUser = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            email: email,
            // Mã hóa mật khẩu bằng CryptoJS và lưu trữ dưới dạng chuỗi
            password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString(),
        });
        const user = await newUser.save();
        // Create JWT access token
        const accessToken = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '30s' }
        );
        res.status(201).json({ data: { token: accessToken }, message: 'Create Account Success ', status: 201 });
    } catch (err) {
        console.log(err);
        res.status(500).json({ data: {}, message: err, status: 500 });
    }
});
//LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.status(404).json({
                data: {},
                message: 'User not found!',
                status: 404,
            });
        } else if (user.isDelete) {
            res.status(406).json({
                data: {},
                message: 'Your account is restricted mode',
                status: 406,
            });
        } else {
            const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SECRET);
            const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
            const inputPassword = req.body.password;
            if (originalPassword != inputPassword) {
                res.status(401).json({
                    data: {},
                    message: 'Incorrect account or password',
                    status: 401,
                });
            } else {
                const accessToken = jwt.sign(
                    {
                        id: user._id,
                        role: user.role,
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '3d' }
                );
                res.status(200).json({ data: { token: accessToken }, message: 'login Success', status: 200 });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ data: {}, message: err, status: 500 });
    }
});
//FORGOT PASSWORD
router.post('/forgotPassword', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.status(500).json({ data: {}, message: 'khong ton tai user', status: 500 });
        } else {
            const forgotPassword = true;
            await SendMailUtil.verifyOTP(user._id, user.email, 'Verify Email Forgot Password', forgotPassword);
            res.status(200).json({ data: { userId: user._id }, message: 'Please verify email', status: 200 });
        }
    } catch (err) {
        res.status(500).json({ data: {}, message: err, status: 500 });
    }
});
// router.post('/verifyOTP', async (req, res) => {
//     try {
//         let { userId, otp } = req.body;
//         if (!userId || !otp) {
//             res.status(500).send({ message: 'Chua co' });
//         } else {
//             const userOTP = await OTP.findOne({
//                 userId: userId,
//             }).exec();
//             if (!userOTP) {
//                 res.status(500).send({ message: 'Khong tim thay OTP' });
//             } else {
//                 if (userOTP.expires < Date.now()) {
//                     // het han OTP
//                     await userOTP.remove();
//                 } else {
//                     const originalOTP = CryptoJS.AES.decrypt(userOTP.OTP, process.env.PASS_SECRET).toString(
//                         CryptoJS.enc.Utf8
//                     );
//                     if (originalOTP !== otp) {
//                         res.status(500).send({ data: {}, message: 'Internal Server Error', status: 500 });
//                     } else {
//                         await userOTP.remove();
//                         const user = await User.findById(userId).exec();
//                         await User.findByIdAndUpdate(userId, { verified: true });
//                         const accessToken = jwt.sign(
//                             {
//                                 id: user._id,
//                                 role: user.role,
//                             },
//                             process.env.JWT_SECRET,
//                             { expiresIn: '3d' }
//                         );
//                         res.status(200).send({
//                             data: { token: accessToken },
//                             message: 'Email verified successfully',
//                             status: 200,
//                         });
//                     }
//                 }
//             }
//         }
//     } catch (error) {
//         res.status(500).send({ data: {}, message: 'Internal Server Error', status: 500 });
//     }
// })
module.exports = router;
