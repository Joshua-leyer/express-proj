const path = require('path')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const router = require('./router')

const server = express()

server.use(express.static(path.join(__dirname, 'public')))
server.use(express.static(path.join(__dirname, 'node_modules')))

// 配置模板引擎
server.engine('html', require('express-art-template'))
server.set('views', path.join(__dirname, './public/views/')) 

// console.log(path.join(__dirname, './public/views/'))

//配置表单的中间件,方便拿数据
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.use(session({
    secret: 'joshua',
    resave: false,
    saveUninitialized: true,
}))



// 这个是我看一个人写的代码和bodyParser的作用一样. 更简单,所以用这个。 
// server.use(express.json())  我用, 不能够获取到表单内容, 不知道为什么

// 把这两个同时写出来, 能感觉到 Router中间件和get这种中间件的关系
// server.get('/', (req, res) => {
//     res.send('joshua ok')
// })

server.use(router)

server.listen(4000, () => {
    console.log('running http://127.0.0.1:4000/')
})

