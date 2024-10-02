const mongoose = require('mongoose');

const messageInThreadSchema = mongoose.Schema(
    {
        message_id: {

        },
        thread_id: {

        }
    },
    { timestamps: true }
);
module.exports = mongoose.model('messageInThread', messageInThreadSchema);