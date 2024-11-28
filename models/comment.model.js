const mongoose = require('mongoose')


const commentSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    data: {
        type: String,
        required: true
    },

    tweet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tweet'
    }

})

module.exports = mongoose.model('comment', commentSchema)