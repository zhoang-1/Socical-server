const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
    {
        sender_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserProfile',
            require: true
        },
        receiver_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserProfile',
            require: true
        },
        message_content: {
            type: String,
            required: true,
        },
        sent_at: {
            type: Date,
            require: true
        },
        is_read:{
            type: Boolean,
            default: false,
            required: true,
        },
        isDelete: {
            type: Boolean,
            default: false,
            required: true,
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model('Message', messageSchema);