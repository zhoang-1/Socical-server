const mongoose = require('mongoose');

const userPostSchema = mongoose.Schema(
    {
        title: {

        },
        contents: {

        },
        profile_id: {

        },
        group_id:{

        },
        publishedAt: {

        },
        isDeleted:{

        },
        idPublic:{

        }
    },
    { timestamps: true }
);
module.exports = mongoose.model('userPost', userPostSchema);