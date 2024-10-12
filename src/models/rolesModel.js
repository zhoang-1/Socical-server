const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
    roleName: {
        type: String,
        required: true
    },
    permissions: {
        type: [String], // Mảng chứa danh sách quyền (vd: ['view', 'edit', 'delete'])
        required: true
    }
});

module.exports = mongoose.model('Roles', roleSchema);
