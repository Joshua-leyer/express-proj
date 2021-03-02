const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/blogdemo1', {
    useMongoClient: true,
    useCreateIndex: true
})

var Schema = mongoose.Schema

// 用户管理

var UserSchema = new Schema({
    username: {
        type: String,
        required: true, // 必须接受到
        nuique: true  // 唯一性
    },
    password: {
        type: String,
        required: true
    },
    created_time: {
        type: Date,
        default: Date.now
    },
    avatar: {
        type: String,
        default: '/public/imgs/default-avatar.png'
    }
})


// module.exports = mongoose.model('User', userSchema)

const User = mongoose.model('User', UserSchema)
//那边接受的时候可以用解构的方式
module.exports = { User } 
