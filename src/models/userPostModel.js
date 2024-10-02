const mongoose = require('mongoose');

const userPostSchema = mongoose.Schema(
    {
        title: {

        },
        contents: {

        },
        profile_id: {

        },
        publishedAt: {

        },
        isDeleted:{

        },
        idPublic:{

        },
        roleId: {

        }
    },
    { timestamps: true }
);
module.exports = mongoose.model('userPost', userPostSchema);