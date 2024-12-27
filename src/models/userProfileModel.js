const { verify } = require('jsonwebtoken');
const mongoose = require('mongoose');

// You can define an address schema if you want structured data for addresses
const addressSchema = mongoose.Schema({
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zip: { type: String, default: '' },
    country: { type: String, default: '' },
});

const userProfileSchema = mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true,
            default: '',
        },
        last_name: {
            type: String,
            required: true,
            default: '',
        },
        username: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            required: true,
            default: '',
        },
        password: {
            type: String,
            default: '',
        },
        phone: {
            type: String,
            default: '',
        },
        address: {
            type: addressSchema,
            default: {},
        },
        date_of_birth: {
            type: Date,
            require: true,
        },
        sex: {
            type: String,
            default: '',
        },
        signup_date: {
            type: Date,
            default: Date.now,
        },
        profile_picture: {
            type: String,
            default: '',
        },
        cover_picture: {
            type: String,
            default: '',
        },
        num_post: {
            type: Number,
            default: 0,
        },
        num_follow: {
            type: Number,
            default: 0,
        },
        num_like: {
            type: Number,
            default: 0,
        },
        friend_array: [{ type: Object, ref: 'UserProfile' }],
        follow_array: [{ type: Object, ref: 'UserProfile' }],
        blockUser_array: [{ type: Object, ref: 'UserProfile' }],
        isVerify: {
            type: Boolean,
            default: false,
        },
        isDelete: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            default: 'viewer',
            required: true,
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model('UserProfile', userProfileSchema);
