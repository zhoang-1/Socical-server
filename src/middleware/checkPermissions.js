const { request } = require("express");

const User = require('../models/userRolesModel')
const Roles = require('../models/rolesModel')
const checkPermissions = async (req, res, next) => {
    try{
        const userId = req.userId; // Giả sử bạn đã có userId từ JWT hoặc session
        const postId = req.params.id;

        // Tìm người dùng theo ID
        const user = await User.findById(userId).populate('roleId'); // Nạp vai trò của người dùng
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Tìm bài đăng theo ID
        const post = await UserPost.findById(postId).populate('roleId'); // Nạp vai trò của bài đăng
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Kiểm tra quyền 'view' dựa trên vai trò của người dùng
        const userRole = user.roleId;
        const postRole = post.roleId;

        if (userRole.permissions.includes('view') || userRole._id.equals(postRole._id)) {
            // Người dùng có quyền 'view' hoặc cùng vai trò với người tạo bài đăng
            return next();
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports = checkPermissions;