const express = require('express');
const router = express.Router();
const User = require('../models/userProfileModel');
const mongoose = require('mongoose');
// show nhiều người
router.get('/v1', async (req, res) => {
    try {
        const users = await User.find({
            where: {
                isDelete: false,
            },
        });
        res.status(200).json({ data: users, message: 'Success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});
// Tìm người theo id

// Hiển thị người dùng theo ID
router.get('/v1/user/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        // Kiểm tra xem ID có hợp lệ không
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ data: {}, message: 'Invalid user ID format', status: 400 });
        }

        // Truy vấn tìm người dùng theo ID
        const user = await User.findById(userId);

        // Nếu không tìm thấy người dùng
        if (!user) {
            return res.status(404).json({ data: {}, message: 'User not found', status: 404 });
        }

        // Lọc ra thông tin khác ngoài password
        const { password, ...other } = user._doc;

        // Trả về thông tin người dùng (trừ password)
        res.status(200).json({ data: { ...other }, message: 'Success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

router.post('/v1', async (req, res) => {
    try {
        // Chuyển đổi ngày sinh từ chuỗi sang Date nếu cần thiết
        const { first_name, last_name, password, email, phone, address, date_of_birth, sex } = req.body;
        const formattedDateOfBirth = new Date(date_of_birth);

        // Tạo người dùng mới
        const newUser = {
            first_name,
            last_name,
            email,
            password,
            phone,
            address,
            date_of_birth: formattedDateOfBirth, // Chuyển đổi ngày sinh
            sex,
            isDelete: false,
            // role: req.body.role
        };
        const emailExists = await User.findOne({ email });
        // Tạo và lưu người dùng
        if (emailExists) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const result = await User.create(newUser);

        // Trả về kết quả thành công
        res.status(201).json({ data: result, message: 'User added successfully', status: 201 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

//update user
router.put('/v1/user/:id', async (req, res) => {
    // let query = ;
    try {
        let result = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json({ data: result, message: 'Success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});
//delete user
router.delete('/v1/user/:id', async (req, res) => {
    // let query = ;
    try {
        let result = await User.findByIdAndUpdate(
            req.params.id,
            {
                isDelete: true,
            },
            {
                new: true,
            }
        );
        res.status(200).json({ data: result, message: 'Delete Success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});


module.exports = router;
