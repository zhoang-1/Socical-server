const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
    {
        sender_id: {

        },
        receiver_id: {

        },
        message_content: {

        },
        sent_at: {

        },
        is_read:{

        },
        isDeleted:{

        }
    },
    { timestamps: true }
);
module.exports = mongoose.model('message', messageSchema);