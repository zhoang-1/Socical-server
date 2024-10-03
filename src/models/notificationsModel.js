const mongoose =require('mongoose')

const orderNotification = {
    state: {
        type: String,
        enum: ['LIKE', 'COMMENT', 'POST', 'OTHER'],
        required: true,
        default: 'PENDING',
    },
    likeDate: {
        type: Date,
        required: true,
    },
    commentDate: {
        type: Date,
        required: true,
    },
    postDate: {
        type: Date,
        required: true,
    },
    otherDate: {
        type: Date,
        required: true,
    },
};

const notificationSchema = mongoose.Schema(
    {
        receiver_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserProfile',
            require: true
        },
        sender_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserProfile',
            require: true
        },
        post_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserPost',
            require: true
        },
        notification_type: {
            type: orderNotification,
            required: true,
        },
        notification_text: {
            type: String,
            required: true
        },
        is_read:{
            type: String,
            default: false,
            required: true,
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model('Notification',notificationSchema);