const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: String,

    tweets: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tweet'
    } ]
})



const User = mongoose.model('user', userSchema)


module.exports = User