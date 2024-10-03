const mongoose = require('mongoose');

const messageInThreadSchema = mongoose.Schema(
    {
        message_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            require: true
        },
        thread_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MessageThread',
            require: true
        }
    },
    { timestamps: true }
);
module.exports = mongoose.model('MessageInThread', messageInThreadSchema);