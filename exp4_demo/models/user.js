const mongoose = require('mongoose')

let Schema = mongoose.Schema


const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model('User', UserSchema)

module.exports = { User }