const mongoose = require('mongoose');

const userPostSchema = mongoose.Schema(
    {
        
        contents: {
            type: String,
            required: true,
        },
        images: {
            type: [String], // Mảng lưu nhiều ảnh
            default: [],
        },
        video: {
            type: String, // Lưu video
            default: '',
        },
        profile_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserProfile',
            require: true
        },
        isDelete: {
            type: Boolean,
            default: false,
            required: true,
        },
        idPublic:{
            type: Boolean,
            default: false,
            required: true,
        },
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Roles',
            require: true
        },
        views: {
            type: Number,
            default: 0, // Số lượt xem bắt đầu từ 0
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ], // Lưu những người đã like bài viết
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment',
            },
        ], // Lưu các bình luận của bài viết
    },
    { timestamps: true }
);
module.exports = mongoose.model('UserPost', userPostSchema);