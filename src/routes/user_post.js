const express = require('express');
const router = express.Router();
const User = require('../models/userProfileModel');
const UserPost = require('../models/userPostModel');
const mongoose = require('mongoose');
//hiển thị bài post theo userId
router.get('/v1/:id', async (req, res) => {
    const profile_id = req.params.id; // Correctly get userId from URL params
    try {
        // Find the user by ID
        const userPosts = await UserPost.find({ profile_id });
        if (!userPosts) {
            return res.status(404).json({ data: {}, message: 'User post not found', status: 404 });
        }
        // Destructure other user data and return the response
        if (!userPosts || userPosts.length === 0) {
            return res.status(404).json({ data: {}, message: 'User posts not found', status: 404 });
        }
        res.status(200).json({ data: userPosts, message: 'Success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

router.post('/v1', async (req, res) => {
    const userId = req.body;
    try {
        // Chuyển đổi ngày sinh từ chuỗi sang Date nếu cần thiết
        const { title, contents, roleId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ data: {}, message: 'User post not found', status: 404 });
        }
        // Tạo người dùng mới
        const newPostProfile = {
            profile_id: user._id,
            title,
            contents,
            isDelete: false,
            idPublic: false,
            roleId,
            // role: req.body.role
        };
        // Tạo và lưu người dùng
        const result = await UserPost.create(newPostProfile);

        // Trả về kết quả thành công
        res.status(200).json({ data: result, message: 'User added successfully', status: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

//UPDATE
router.put('/v1/:profile_id/:post_id', async (req, res) => {
    const { profile_id, post_id } = req.params;
    try {
        // Check if any posts were updated
        console.log(profile_id)
        if(!profile_id){
            return res.status(404).json({ data: {}, message: 'Not found User', status: 404 });
        }
        let result = await UserPost.findByIdAndUpdate(
            { _id: post_id, profile_id },
            {
                $set: req.body,
            },
            { new: true }
        );
        // Check if any posts were updated
        if (!result) {
            return res.status(404).json({ data: {}, message: 'No posts updated', status: 404 });
        }
        res.status(200).json({ data: result, message: 'Success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});
//delete user
router.delete('/v1/:profile_id/:post_id', async (req, res) => {
    const { profile_id, post_id } = req.params;
    try {
        // Check if any posts were updated
        // console.log(profile_id)
        if(!profile_id){
            return res.status(404).json({ data: {}, message: 'Not found User', status: 404 });
        }
        let result = await UserPost.findByIdAndUpdate(
            { _id: post_id, profile_id },
            {
                isDelete: true,
            },
            { new: true }
        );
        // Check if any posts were updated
        if (!result) {
            return res.status(404).json({ data: {}, message: 'No posts updated', status: 404 });
        }
        res.status(200).json({ data: result, message: 'Success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});
module.exports = router;
