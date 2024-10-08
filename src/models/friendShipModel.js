const mongoose =require('mongoose')

const orderStatus = {
    state: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'UNFRIEND', 'FOLLOW', 'UNFOLLOW'],
        required: true,
    },
    pendingDate: {
        type: Date,
        required: false, // Không bắt buộc
        default: null, // Giá trị mặc định
    },
    acceptedDate: {
        type: Date,
        required: false, // Không bắt buộc
        default: null, // Giá trị mặc định
    },
    rejectedDate: {
        type: Date,
        required: false, // Không bắt buộc
        default: null, // Giá trị mặc định
    },
    unfriendDate:{
        type: Date,
        required: false, // Không bắt buộc
        default: null, // Giá trị mặc định
    },
    followDate:{
        type: Date,
        required: false, // Không bắt buộc
        default: null, // Giá trị mặc định
    },
    unfollowDate:{
        type: Date,
        required: false, // Không bắt buộc
        default: null, // Giá trị mặc định
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
            default: true, // Có thể được cập nhật thành false khi bị từ chối
        }
    },
    { timestamps: true }
);
module.exports = mongoose.model('FriendShip', friendShipSchema)