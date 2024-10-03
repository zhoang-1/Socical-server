const mongoose =require('mongoose')

const orderStatus = {
    state: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
        required: true,
    },
    pendingDate: {
        type: Date,
        required: true,
    },
    acceptedDate: {
        type: Date,
        required: true,
    },
    rejectedDate: {
        type: Date,
        required: true,
    },
};

const friendShipSchema = mongoose.Schema(
    {
        profile_require_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserProfile',
            require: true
        },
        profile_accept_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserProfile',
            require: true
        },
        status:{
            type: orderStatus,
            required: true,
        }
    },
    { timestamps: true }
);
module.exports = mongoose.model('FriendShip', friendShipSchema)