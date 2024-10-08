const mongoose =require('mongoose')

const userProfileSchema = mongoose.Schema(
    {
        first_name:{
            type: String,
            required: true,
            default: ''
        },
        last_name:{
            type: String,
            required: true,
            default: ''
        },
        email:{
            type: String,
            required: true,
            default: ''
        },
        password: {
            type: String,
            default: ''
        },
        phone: {
            type: String,
            default: ''
        },
        address: {
            type: Object,
            default: {}
        },
        date_of_birth:{
            type: Date,
            require:true
        },
        sex: {
            type: String,
            default: ''
        },
        signup_date:{
            type: Date,
            default: Date.now
        },
        profile_picture: {
            type: String,
            default: ''
        },
        cover_picture:{
            type: String,
            default: ''
        },
        num_post: {
            type: Number,
            default: 0
        },
        num_follow:{
            type: Number,
            default: 0
        },
        num_like: {
            type: Number,
            default: 0
        },
        friend_array: [{ type: Object, ref: 'UserProfile' }],
        is_friend:{
            type: String,
            default: 'false'
        },
        isDelete: {
            type: Boolean,
            default: false
        },
        role: {
            type: String,
            default: 'user'
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model('UserProfile',userProfileSchema);