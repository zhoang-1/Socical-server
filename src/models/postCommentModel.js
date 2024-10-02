const mongoose = require('mongoose');

const postCommentSchema = mongoose.Schema(
    {
        user_post_id: {

        },
        profile_id: {

        },
        comments_text:{

        },
        publishedAt: {

        },
    },
    { timestamps: true }
);
module.exports = mongoose.model('postComment', postCommentSchema);