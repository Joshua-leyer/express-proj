const express = require("express")
const path = require('path')
const bodyParser = require('body-parser')
// const cookieParser = require('cookie-parser')
const session = require('express-session')

const app = express();



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// app.use(cookieParser())

app.use(session({
    secret: 'key',  // 一个 session 签名, 类似钥匙的东西. 我们不可能直接把用户信息当做 cookie 发送给浏览器.
    // name: 'JCookieId', // 默认是 connect.sid
    resave: false,
    //saveUninitialized 属性设置为 true ，这意味着如果客户端请求中没有包含，这意味着如果客户端请求中没有包含 connect.sid cookie，则 express-session 中间件会自动创建一个新的会话，并将新的会话标识符存储在 connect.sid cookie 中，然后将 connect.sid cookie 发送给客户端。
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60,
        secure: false
    }
}))



const testRouter = require("./testRouter.js")
app.use('/test', testRouter)

app.get('/', (req, res) => {
    res.send('hello')
})



const port = 3000

app.listen(port, () => {
    console.log(`running http://localhost:${port}`)
})