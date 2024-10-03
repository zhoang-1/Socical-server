const mongoose = require('mongoose');

const messageThreadSchema = mongoose.Schema(
    {
        thread_name: {
            type: String,
            require: true
        },
        is_group: {
            type: Boolean,
            default: false,
            required: true,
        },
        
    },
    { timestamps: true }
);
module.exports = mongoose.model('MessageThread', messageThreadSchema);