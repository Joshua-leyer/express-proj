const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const bcrypt = require('bcrypt')

// 这个中间件只是方便我们拿到以及设定 cookie     
const cookieParser = require('cookie-parser') 

mongoose.connect("mongodb://localhost/ex4-demo", {
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
// app.set('views', path.join(__dirname, './views')) // 默认就是 ./views 目录

// app.use(express.json())

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());         //设置中间件


const { Article } = require('./models/article');

var ArticlesRouter = require('./routers/articles')
var UsersRouter = require('./routers/users')

app.use('/article', ArticlesRouter)
app.use('/users', UsersRouter)


app.use(function (err, req, res, next) {
    res.status(500).send(err)
})

app.get('/', function(req, res) {
    console.log(req.session)
    // console.log(`sessionId 这里的值应该和前端cookie值 去调前面的一部分后面的都一样`, req.sessionID)
    Article.find({}, function(err, articles) {
        console.log(`当前session的内容`, req.session)
        if (err) next(err)
        res.render('index.html',{
            articles: articles,
            user: req.session.user
        })
    })
})



app.listen(5000, ()=>{
    console.log('running http://localhost:5000')
})