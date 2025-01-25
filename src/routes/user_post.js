const express = require('express');
const router = express.Router();
const User = require('../models/userProfileModel');
const UserPost = require('../models/userPostModel');
const FriendShip = require('../models/friendShipModel');
const upload = require('../utils/upload');
const mongoose = require('mongoose');
const {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndUserOnly,
    verifyTokenAndAdminOnly,
} = require('../middleware/verifyToken');

// USER

//hiển thị bài post của user ở tất cả chế độ (công khai or riêng tư)
router.get('/v1/showPost/user', verifyTokenAndAdmin, async (req, res) => {
    try {
        const userId = req.user.id; // Lấy ID từ token

        const posts = await UserPost.find({
            $or: [
                { idPublic: true, isDelete: false }, // Bài viết công khai
                { profile_id: userId, isDelete: false }, // Bài viết riêng tư của chính họ
            ],
        }).populate('profile_id', 'first_name last_name');

        if (!posts || posts.length === 0) {
            return res.status(404).json({
                data: {},
                message: 'No posts found',
                status: 404,
            });
        }

        res.status(200).json({
            data: posts,
            message: 'Success',
            status: 200,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            data: {},
            message: error.message,
            status: 500,
        });
    }
});

router.post(
    '/v1/post',
    verifyTokenAndUserOnly, // Middleware xác thực token
    upload.fields([
        { name: 'images', maxCount: 5 },
        { name: 'video', maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            // Lấy thông tin từ token đã giải mã (có thể đã được gán vào req.user từ middleware)
            const userId = req.user.id; // ID của người dùng
            const roleId = req.user.roleId; // Role ID lấy từ token

            // Dữ liệu từ request
            const { contents } = req.body;

            // Kiểm tra người dùng có tồn tại không
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ data: {}, message: 'User not found', status: 404 });
            }

            // Xử lý hình ảnh tải lên
            let imageUrls = [];
            if (req.files['images']) {
                imageUrls = req.files['images'].map(file => `/uploads/${file.filename}`);
            }

            let videoUrl = '';
            if (req.files['video'] && req.files['video'].length > 0) {
                videoUrl = `/uploads/${req.files['video'][0].filename}`;
            }


            // Tạo bài viết mới
            const newPostProfile = {
                profile_id: user._id,
                contents,
                isDelete: false,
                idPublic: true,
                roleId, // Lấy role từ token, không cần truyền từ client
                images: imageUrls,
                video: videoUrl,
            };

            // Lưu bài viết vào database
            const result = await UserPost.create(newPostProfile);

            // Tăng số bài viết
            user.num_post += 1;
            await user.save();

            // Phản hồi thành công
            res.status(201).json({ data: result, message: 'Post created successfully', status: 201 });
        } catch (error) {
            console.error(error);
            res.status(500).json({ data: {}, message: error.message, status: 500 });
        }
    }
);

//UPDATE
router.put(
    '/v1/update-post/:id',
    verifyTokenAndUserOnly,
    upload.fields([
        { name: 'images', maxCount: 5 },
        { name: 'video', maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            const postId = req.params.id;
            const {  contents } = req.body;
            const userId = req.user.id; // Lấy user ID từ token

            // Tìm bài viết
            const post = await UserPost.findById(postId);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            // Kiểm tra quyền chỉnh sửa
            if (post.profile_id.toString() !== userId) {
                return res.status(403).json({ message: 'Permission denied' });
            }

            // Cập nhật thông tin bài viết
           
            if (contents) post.contents = contents;

            // Cập nhật hình ảnh
            if (req.files['images']) {
                const imageUrls = req.files['images'].map(file => `/uploads/${file.filename}`);
                post.images = imageUrls;
            }

            // Cập nhật video
            if (req.files['video']) {
                post.video = `/uploads/${req.files['video'][0].filename}`;
            }

            await post.save();

            res.status(200).json({ message: 'Post updated successfully', data: post });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

//delete user
router.delete('/v1/delete-post/:id', verifyTokenAndUserOnly, async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id; // Lấy user ID từ token

        // Tìm bài viết
        const post = await UserPost.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Kiểm tra quyền xóa bài viết
        if (post.profile_id.toString() !== userId) {
            return res.status(403).json({ message: 'Permission denied' });
        }

        // Đánh dấu bài viết là đã xóa (Soft Delete)
        post.isDelete = true; // Chỉ đánh dấu là đã xóa
        await post.save();

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// QUYỀN 
router.put('/v1/post/:id/public', verifyTokenAndUserOnly, async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id; // Lấy ID người dùng từ token

        // Kiểm tra ID hợp lệ
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid Post ID' });
        }

        // Tìm bài viết
        const post = await UserPost.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Kiểm tra quyền chỉnh sửa (chỉ cho phép chủ bài viết thay đổi)
        if (post.profile_id.toString() !== userId) {
            return res.status(403).json({ message: 'Permission denied' });
        }

        // Cập nhật chế độ công khai (có thể là true hoặc false)
        const { idPublic } = req.body;
        if (typeof idPublic !== 'boolean') {
            return res.status(400).json({ message: 'idPublic must be a boolean' });
        }

        // Cập nhật chế độ công khai
        post.idPublic = idPublic;

        // Lưu thay đổi vào cơ sở dữ liệu
        await post.save();

        // Trả về thông báo thành công
        res.status(200).json({ message: 'Post visibility updated successfully', data: post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', status: 500 });
    }
});
router.put('/v1/post/:id/public', verifyTokenAndUserOnly, async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id; // Lấy ID người dùng từ token

        // Kiểm tra ID hợp lệ
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid Post ID' });
        }

        // Tìm bài viết
        const post = await UserPost.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Kiểm tra quyền chỉnh sửa (chỉ cho phép chủ bài viết thay đổi)
        if (post.profile_id.toString() !== userId) {
            return res.status(403).json({ message: 'Permission denied' });
        }

        // Cập nhật chế độ công khai (có thể là true hoặc false)
        const { idPublic } = req.body;
        if (typeof idPublic !== 'boolean') {
            return res.status(400).json({ message: 'idPublic must be a boolean' });
        }

        // Cập nhật chế độ công khai
        post.idPublic = idPublic;

        // Lưu thay đổi vào cơ sở dữ liệu
        await post.save();

        // Trả về thông báo thành công
        res.status(200).json({ message: 'Post visibility updated successfully', data: post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', status: 500 });
    }
});


// EVERYBODY

// Hiển thị một bài viết theo ID
router.get('/v1/posts/:postId', async (req, res) => {
    try {
        // Tìm bài viết theo ID
        const post = await UserPost.findById(req.params.postId)
            .populate('profile_id', 'first_name last_name'); // Lấy thông tin người viết bài


        // Kiểm tra xem bài viết có tồn tại không
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Trả về bài viết
        res.status(200).json({ data: post, message: 'Post fetched successfully', status: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// Phân tích chuyên sâu để hiển thị lên trang home
router.get('/v1/showPost', async (req, res) => {
    try {
        // Lấy thời gian hiện tại
        const now = new Date();
        // Tính thời gian 15 phút trước
        const fifteenMinutesAgo = new Date(now - 15 * 60 * 1000);

        // Lọc bài viết không bị xóa và công khai
        let AllPost = await UserPost.find({
            isDelete: false,   // Lọc bài viết không bị xóa
            idPublic: true      // Lọc bài viết công khai
        }).populate('profile_id', 'first_name last_name'); // Lấy thông tin người đăng

        // Kiểm tra nếu không có bài viết nào
        if (!AllPost || AllPost.length === 0) {
            return res.status(404).json({
                data: {},
                message: 'No public posts found',
                status: 404,
            });
        }

        // Chia bài viết thành hai nhóm: một nhóm là những bài trong vòng 15 phút, nhóm còn lại là những bài sau 15 phút
        const recentPosts = AllPost.filter(post => new Date(post.createdAt) >= fifteenMinutesAgo);
        const olderPosts = AllPost.filter(post => new Date(post.createdAt) < fifteenMinutesAgo);

        // Sắp xếp bài viết trong vòng 15 phút theo thời gian đăng (mới nhất lên đầu)
        recentPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Trộn bài viết đã sắp xếp với bài viết còn lại (lấy ngẫu nhiên)
        const mixedPosts = [...recentPosts, ...olderPosts.sort(() => Math.random() - 0.5)];

        // Trả về dữ liệu bài viết sau khi đã xử lý
        res.status(200).json({
            data: mixedPosts,
            message: 'Success',
            status: 200,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            data: {},
            message: error.message,
            status: 500,
        });
    }
});


// ADMIN
//hiển thị bài post theo admin
router.get('/v1/viewPost', verifyToken, async (req, res) => {
    const profile_id = req.user.id; // Lấy id từ token đã xác thực
    try {
        const userPosts = await UserPost.find({ profile_id });
        if (!userPosts || userPosts.length === 0) {
            return res.status(404).json({ data: {}, message: 'User posts not found', status: 404 });
        }

        // Tăng số lượt xem
        userPosts.forEach(async post => {
            post.views += 1;
            await post.save();
        });

        res.status(200).json({ data: userPosts, message: 'Success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});



module.exports = router;
