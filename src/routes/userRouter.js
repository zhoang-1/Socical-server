const express = require('express');
const router = express.Router();
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const User = require('../models/userProfileModel');
const mongoose = require('mongoose');
const upload = require('../utils/upload');
const { verifyToken,verifyTokenAndUserOnly, verifyTokenAndAdmin, verifyTokenAndAdminOnly } = require('../middleware/verifyToken');


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


// UPDATE
// update Thông tin cơ bản
router.put('/:id', verifyTokenAndUserOnly, async (req, res) => {
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

// API cập nhật chỉ ảnh đại diện
router.put('/:id/profile-picture', verifyTokenAndUserOnly, upload.single('profile_picture'), async (req, res) => {
    try {
        const userId = req.params.id;

        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Cập nhật ảnh đại diện mới nếu có
        if (req.file) {
            user.profile_picture = `uploads/${req.file.filename}`; // Lưu đường dẫn ảnh vào cơ sở dữ liệu
        }

        // Lưu lại người dùng với ảnh mới
        await user.save();

        // Trả về kết quả thành công
        res.status(200).json({ message: 'Profile picture updated successfully', data: user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// API cập nhật chỉ ảnh bìa
router.put('/:id/cover-picture', verifyTokenAndAdmin, upload.single('cover_picture'), async (req, res) => {
    try {
        const userId = req.params.id;

        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Cập nhật ảnh bìa mới nếu có
        if (req.file) {
            user.cover_picture = `uploads/${req.file.filename}`; // Lưu đường dẫn ảnh vào cơ sở dữ liệu
        }

        // Lưu lại người dùng với ảnh bìa mới
        await user.save();

        // Trả về kết quả thành công
        res.status(200).json({ message: 'Cover picture updated successfully', data: user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
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
