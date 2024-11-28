const mongoose = require('mongoose')


const tweetSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },

    username: {
        type: String,
        required: true,
    },

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],

    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comment'
        }
    ]
},
    {
        timestamps: true
    }
)

const Tweet = mongoose.model('tweet', tweetSchema)

module.exports = Tweet