const mongoose = require('mongoose');

const groupSchema = mongoose.Schema(
    {
        profile_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserProfile',
            require: true
        },
        group_name: {
            type: String,
            required: true,
        },
        group_rules: {
            type: String,
            required: true,
        },
        group_content: {
            type: String,
            required: true,
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
    },
    { timestamps: true }
);
module.exports = mongoose.model('Group', groupSchema);