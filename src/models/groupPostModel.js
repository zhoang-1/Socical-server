const mongoose = require('mongoose');

const GroupPostSchema = mongoose.Schema(
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
        group_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
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
        }
    },
    { timestamps: true }
);
module.exports = mongoose.model('GroupPost', GroupPostSchema);