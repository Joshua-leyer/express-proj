const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')

const app = express()

const port = 3000

require('./models/connect.js') // require() 到底做了什么? 这里是node中的module模块知识点

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json()); // for parsing application/json

const router = require('./router')
const { nextTick } = require('process')

app.use(express.static(path.join(__dirname, 'public')))


app.use(session({secret: 'secrety key'}))

//告诉模板所在位置, 但是我用4x 似乎可以不用写 
app.set('views', path.join(__dirname, './views'))

//设定模板的后缀
app.set('view engine', 'html')
//当渲染art用什么模板
app.engine('html', require('express-art-template'))


// 匹配以/admin 开头的路由 , 而不单单是/admin
app.use('/admin', require('./middleware/auth'))


const home = require('./router/home')
const admin = require('./router/admin')

app.use('/home', home)
app.use('/admin', admin)

// err中间件
app.use((err, req, res, next) => {
  res.redirect('./')
})

 
// app.use(router)


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
