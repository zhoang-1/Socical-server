const express = require('express');
const router = express.Router();
const User = require('../../models/userProfileModel');
const UserPost = require('../../models/userPostModel');
const Comment =require('../../models/postCommentModel')
const mongoose = require('mongoose');
const {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndUserOnly,
    verifyTokenAndAdminOnly,
} = require('../../middleware/verifyToken');
// LIKE SHARE COMMENT

// Like bài viết
router.post('/:postId/like', verifyToken, async (req, res) => {
    try {
        // Tìm bài viết
        const post = await UserPost.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        console.log('Post Likes:', post.likes);
        console.log('User ID:', req.user.id);

        // So sánh ID ở cùng kiểu dữ liệu
        if (post.likes.some(id => id.toString() === req.user.id)) {
            return res.status(400).json({ message: 'You have already liked this post' });
        }

        // Thêm like
        post.likes.push(req.user.id);
        await post.save();

        res.status(200).json({ message: 'Post liked successfully', data: post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// Bỏ like bài viết
router.post('/:postId/unlike', verifyToken, async (req, res) => {
    try {
        // Tìm bài viết theo ID
        const post = await UserPost.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Kiểm tra xem người dùng đã like bài viết này chưa
        if (!post.likes.includes(req.user.id)) {
            return res.status(400).json({ message: 'You have not liked this post' });
        }

        // Xóa ID người dùng khỏi mảng likes
        post.likes.pull(req.user.id);

        // Lưu lại bài viết sau khi thay đổi
        await post.save();
        
        // Trả về bài viết đã được cập nhật
        res.status(200).json({ message: 'Post unliked successfully', data: post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});


// Share bài viết (không cần xác thực người dùng)
router.post('/:postId/share', async (req, res) => {
    try {
        const post = await UserPost.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Tạo đường dẫn chia sẻ
        const shareLink = `${req.protocol}://${req.get('host')}/api/userpost/v1/posts/${post._id}`;
        
        res.status(200).json({ message: 'Post shared successfully', shareLink });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// Thêm bình luận vào bài viết
router.post('/:postId/comment', verifyTokenAndUserOnly, async (req, res) => {
    try {
        const { content } = req.body;
        const post = await UserPost.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Tạo bình luận mới
        const newComment = await Comment.create({
            content,
            post_id: post._id,
            user_id: req.user.id,
        });

        // Thêm bình luận vào bài viết
        post.comments.push(newComment._id);
        await post.save();

        res.status(200).json({ message: 'Comment added successfully', data: newComment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.put('/:postId/comments/:commentId', verifyTokenAndUserOnly, async (req, res) => {
    try {
        const { content } = req.body; // Lấy nội dung mới từ yêu cầu
        const { postId, commentId } = req.params;

        // Tìm bài viết chứa bình luận
        const post = await UserPost.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Tìm bình luận trong database
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Kiểm tra xem người dùng hiện tại có phải chủ sở hữu bình luận không
        if (comment.user_id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not allowed to edit this comment' });
        }

        // Cập nhật nội dung bình luận
        comment.content = content;
        await comment.save(); // Lưu vào database

        res.status(200).json({
            message: 'Comment updated successfully',
            data: comment,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
router.delete('/:postId/comments/:commentId', verifyTokenAndUserOnly, async (req, res) => {
    try {
        const { postId, commentId } = req.params;

        // Tìm bài viết
        const post = await UserPost.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Tìm bình luận trong database
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Kiểm tra quyền xóa bình luận
        if (comment.user_id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not allowed to delete this comment' });
        }

        // Xóa bình luận
        await Comment.findByIdAndDelete(commentId);

        // Cập nhật danh sách bình luận trong bài viết
        post.comments = post.comments.filter(
            (id) => id.toString() !== commentId
        );
        await post.save();

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});


module.exports = router