const mongoose = require('mongoose');

const postCommentSchema = mongoose.Schema(
    {
        user_post_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserPost',
            require: true
        },
        profile_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserProfile',
            require: true
        },
        comments_text:{
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model('PostComment', postCommentSchema);