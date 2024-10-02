const mongoose = require('mongoose');

const messageThreadSchema = mongoose.Schema(
    {
        thread_name: {

        },
        is_group: {

        },
        
    },
    { timestamps: true }
);
module.exports = mongoose.model('messageThread', messageThreadSchema);