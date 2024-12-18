const mongoose =require('mongoose')

const orderStatus = {
    state: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'UNFRIEND', 'BLOCK', 'UNBLOCK'],
        required: true,
    },
    pendingDate: {
        type: Date,
        required: false, 
        default: null, 
    },
    acceptedDate: {
        type: Date,
        required: false, 
        default: null, 
    },
    rejectedDate: {
        type: Date,
        required: false, 
        default: null, 
    },
    unFriendDate:{
        type: Date,
        required: false, 
        default: null, 
    },
    blockDate:{
        type: Date,
        required: false, 
        default: null, 
    },
    unBlockDate: {
        type: Date,
        require: false,
        default: null
    }
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
        },
        isActive: {
            type: Boolean,
            default: true, 
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model('FriendShip', friendShipSchema)