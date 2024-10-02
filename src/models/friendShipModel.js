const mongoose =require('mongoose')

const orderStatus = {
    state: {
        type: String,
        enum: ['PENDING', 'PACKAGE', 'DELIVERING', 'COMPLETE', 'CANCEL'],
        required: true,
    },
    pendingDate: {
        type: Date,
        required: true,
    },
    packageDate: {
        type: Date,
        required: true,
    },
    deliveringDate: {
        type: Date,
        required: true,
    },
    completeDate: {
        type: Date,
        required: true,
    },
    cancelDate: {
        type: Date,
        required: true,
    },
};

const friendShipSchema = mongoose.Schema(
    {
        profile_require_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userProfile',
            require: true
        },
        profile_accept_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userProfile',
            require: true
        },
        status:{
            type: orderStatus,
            required: true,
        }
    },
    { timestamps: true }
);
module.exports = mongoose.model('friendShip', friendShipSchema)