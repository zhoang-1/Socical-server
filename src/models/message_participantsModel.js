const mongoose = require('mongoose');

const messageParticipantSchema = mongoose.Schema(
    {
        thread_id: {

        },
        profile_id: {

        },
        
    },
    { timestamps: true }
);
module.exports = mongoose.model('messageParticipant', userPostSchema);