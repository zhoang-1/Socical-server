const mongoose = require('mongoose');

const messageParticipantSchema = mongoose.Schema(
    {
        thread_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MessageThread',
            require: true
        },
        profile_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserProfile',
            require: true
        },
        
    },
    { timestamps: true }
);
module.exports = mongoose.model('MessageParticipant', messageParticipantSchema);