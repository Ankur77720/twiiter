const mongoose = require('mongoose')


function connect() {
    mongoose.connect('mongodb://0.0.0.0/twitter').then(() => {
        console.log('connected to db')
    }).catch((err) => {
        console.log('error connecting to db', err)
    })
}


module.exports = connect

