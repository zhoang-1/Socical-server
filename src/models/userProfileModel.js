const mongoose =require('mongoose')

const userProfileSchema = mongoose.Schema(
    {
        first_name:{
            type: String,
            required: true,
        },
        last_name:{
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
        },
        password: {
            type: String,
        },
        phone: {
            type: String,
            required: false,
            default: '',
        },
        address: {
            type: Object,
            required: false,
            default: {},
        },
        date_of_birth:{
            type: Date,
            required: true,
        },
        sex: {
            type: String,
            required: false,
            default: '',
        },
        signup_date:{
            type: Date,
            required: true,
        },
        profile_picture: {
            type: String,
            required: true,
        },
        cover_picture:{
            type: String,
            required: true,
        },
        num_post: {
            type: Number,
            required: true,
        },
        num_follow:{
            type: Number,
            required: true,
        },
        num_like: {
            type: Number,
            required: true,
        },
        friend_array: {
            type: Array,
            required: true,
        },
        is_friend:{
            type: String,
            default: false,
            required: true,
        },
        isDelete: {
            type: Boolean,
            default: false,
            required: true,
        },
        role: {
            type: String,
            default: 'user',
            required: true,
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model('UserProfile',userProfileSchema);