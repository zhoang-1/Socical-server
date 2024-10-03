const mongoose = require('mongoose')

const postLikeSchema = mongoose.Schema(
    {
        user_post_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserPost',
            require: true
        },
        profile_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserProfile',
            require: true
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model('PostLike', postLikeSchema)