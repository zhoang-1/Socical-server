const mongoose = require('mongoose');

const otpsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'UserProfile', // Reference to the User model
    },
    OTP: {
        type: String,
        required: true,
    },
    expiresAt: { type: Number, default: Date.now() + 3600000 } 
});

const OTP = mongoose.model('OTP', otpsSchema);
module.exports = OTP;
