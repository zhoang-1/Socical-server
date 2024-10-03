const mongoose = require('mongoose');

const userPostSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        contents: {
            type: String,
            required: true,
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
        }
    },
    { timestamps: true }
);
module.exports = mongoose.model('UserPost', userPostSchema);