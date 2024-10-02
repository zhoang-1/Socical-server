const mongoose = require('mongoose');

const roleSchema = mongoose.Schema(
    {
        roleName: {

        },
        isDeleted:{

        }
    },
    { timestamps: true }
);
module.exports = mongoose.model('roles', roleSchema);