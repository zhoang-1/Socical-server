const mongoose = require('mongoose');

const roleSchema = mongoose.Schema(
    {
        roleName: {
            type: String,
            required: true,
        },
        isDelete: {
            type: Boolean,
            default: false,
            required: true,
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model('Roles', roleSchema);