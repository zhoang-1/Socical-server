const mongoose = require('mongoose');

const userPostSchema = mongoose.Schema(
    {
        profile_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userProfile',
            require: true
        },
        group_name: {
            type: String,
            required: true,
        },
        group_rules: {

        },
        group_content: {
            type: String,
            required: true,
        },
        publishedAt: {

        },
        isDeleted:{

        },
        idPublic:{

        },
    },
    { timestamps: true }
);
module.exports = mongoose.model('userPost', userPostSchema);