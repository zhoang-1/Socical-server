const mongoose = require('mongoose');

const userRoleSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    description: { type: String },
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Roles',
        required: true
    }
});

module.exports = mongoose.model('UserRole', userRoleSchema);
