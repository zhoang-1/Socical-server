const mongoose = require('mongoose')

const postLikeSchema = mongoose.Schema(
    {
        user_post_id: {

        },
        profile_id:{

        },
        publishedAt:{

        },
    },
    { timestamps: true }
);
module.exports = mongoose.model('postLike', postLikeSchema)