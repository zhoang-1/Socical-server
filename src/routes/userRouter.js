const express = require('express');
const router = express.Router();
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const User = require('../models/userProfileModel');
const mongoose = require('mongoose');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyTokenAndAdminOnly } = require('../middleware/verifyToken');


//  USER
router.get('/userInfo', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { password, ...other } = user._doc;
        res.status(200).json({ data: { ...other }, message: 'Success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

// router.post('/v1', async (req, res) => {
//     try {
//         // Chuyển đổi ngày sinh từ chuỗi sang Date nếu cần thiết
//         const { first_name, last_name, password, email, phone, address, date_of_birth, sex } = req.body;
//         const formattedDateOfBirth = new Date(date_of_birth);

//         // Tạo người dùng mới
//         const newUser = {
//             first_name,
//             last_name,
//             email,
//             password,
//             phone,
//             address,
//             date_of_birth: formattedDateOfBirth, // Chuyển đổi ngày sinh
//             sex,
//             isDelete: false,
//             // role: req.body.role
//         };
//         const emailExists = await User.findOne({ email });
//         // Tạo và lưu người dùng
//         if (emailExists) {
//             return res.status(400).json({ error: 'Email already exists' });
//         }
//         const result = await User.create(newUser);

//         // Trả về kết quả thành công
//         res.status(201).json({ data: result, message: 'User added successfully', status: 201 });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ data: {}, message: error.message, status: 500 });
//     }
// });

//update user

router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString();
    }
    try {
        const updateUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json({ data: { updateUser }, message: 'Success', status: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

// DELETE
router.delete('/delete/:id', verifyToken, async (req, res) => {
    try {
        // Kiểm tra nếu ID trong token khớp với ID trong URL
        if (req.user.id !== req.params.id) {
            return res.status(403).json({ message: "You can only delete your own account." });
        }

        await User.findByIdAndUpdate(
            req.params.id,
            {
                isDelete: true,
            },
            {
                new: true,
            }
        );
        res.status(200).json({ data: {}, message: 'User has been deleted...', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

// ADMIN
router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...other } = user._doc;
        res.status(200).json({ data: { ...other }, message: 'Success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});


router.get('/', verifyTokenAndAdminOnly, async (req, res) => {
    const query = req.query.new;
    try {
        const users = await User.find()
            .sort({ _id: -1 })
            .limit(query == 'true' ? 10 : 0);
        res.status(200).json({ data: { ...users }, message: 'Success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});
// add cho admin
// router.post('/v1', async (req, res) => {
//     try {
//         // Chuyển đổi ngày sinh từ chuỗi sang Date nếu cần thiết
//         const { first_name, last_name, password, email, phone, address, date_of_birth, sex } = req.body;
//         const formattedDateOfBirth = new Date(date_of_birth);

//         // Tạo người dùng mới
//         const newUser = {
//             first_name,
//             last_name,
//             email,
//             password,
//             phone,
//             address,
//             date_of_birth: formattedDateOfBirth, // Chuyển đổi ngày sinh
//             sex,
//             isDelete: false,
//             role: 'admin',
//             isVerify: true,    // vì là admin nên luôn được verify
//             // role: req.body.role
//         };
//         const emailExists = await User.findOne({ email });
//         // Tạo và lưu người dùng
//         if (emailExists) {
//             return res.status(400).json({ error: 'Email already exists' });
//         }
//         const result = await User.create(newUser);

//         // Trả về kết quả thành công
//         res.status(201).json({ data: result, message: 'User added successfully', status: 201 });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ data: {}, message: error.message, status: 500 });
//     }
// });

//update user


module.exports = router;
