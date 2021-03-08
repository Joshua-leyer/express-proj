const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const bcrypt = require('bcrypt')



mongoose.connect("mongodb://localhost/ex5-demo", {
    useNewUrlParser: true,
    useUnifiedTopology: true 
})

let db = mongoose.connection

db.once('open', function(){
    console.log('connected successed')
})

db.on('error', function(err) {
    console.log(err)
})



const app = express()

app.use(session({
    secret: 'joshua',
    name: 'express-cookie',
    resave: false,
    saveUninitialized: true
}))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'node_modules')))

app.engine('html', require('express-art-template'))

// app.use(express.json())

app.use(bodyParser.urlencoded({ extended: false }));


const { Article } = require('./models/article');



// 使用路由
var ArticlesRouter = require('./routers/articles')
var UsersRouter = require('./routers/users')
var AdminRouter = require('./routers/admin')

app.use('/article', ArticlesRouter)
app.use('/users', UsersRouter)
// app.use('/admin', AdminRouter)

app.use(function (err, req, res, next) {
    res.status(500).send(err)
})

app.get('/', function(req, res, next) {
    // console.log(req.session)
    // console.log(`sessionId 这里的值应该和前端cookie值 去调前面的一部分后面的都一样`, req.sessionID)
    Article.find({}, function(err, articles) {
        // console.log(`当前session的内容`, req.session)
        if (err) next(err)

        //文章节选内容, 个人发现js 拿到mongodb里面的内容后对内容修改是真的TM的恶心

        // articles.body = articles.body.substring(0, 1)
        res.render('index.html',{
            articles: articles,
            user: req.session.user
        })
    })
})


app.listen(5000, ()=>{
    console.log('running http://localhost:5000')
})