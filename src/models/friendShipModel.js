const mongoose =require('mongoose')

const orderStatus = {
    state: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'UNFRIEND', 'BLOCK', 'UNBLOCK'],
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
    unFriendDate:{
        type: Date,
        required: false, // Không bắt buộc
        default: null, // Giá trị mặc định
    },
    blockDate:{
        type: Date,
        required: false, // Không bắt buộc
        default: null, // Giá trị mặc định
    },
    unBlockDate: {
        type: Date,
        require: false,
        default: null
    }
};
// const orderFollowStatus = {
//     state: {
//         type: String,
//         enum: ['FOLLOW', 'UNFOLLOW'],
//         required: true,
//     },
//     followDate:{
//         type: Date,
//         required: false, // Không bắt buộc
//         default: null, // Giá trị mặc định
//     },
//     unFollowDate:{
//         type: Date,
//         required: false, // Không bắt buộc
//         default: null, // Giá trị mặc định
//     }
// };

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
        // followStatus: {
        //     type:orderFollowStatus,
        //     require:true
        // },
        isActive: {
            type: Boolean,
            default: true, // Có thể được cập nhật thành false khi bị từ chối
        },
        // isFollowActive:{
        //     type: Boolean,
        //     default: true
        // }
    },
    { timestamps: true }
);
module.exports = mongoose.model('FriendShip', friendShipSchema)