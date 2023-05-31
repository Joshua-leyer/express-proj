const express = require('express')
const { formatDate } = require('./joshua')

const { Article } = require('../models/article')
const { User } = require('../models/user')

const router = express.Router()

function auth(req, res, next) {
    //核心是判断当前是否登录了
    if (req.session.user){
        return next()
    }
    // if (req.session.user !== false) 
    // 没有登录就重定向让他去登录去
    // learnning log> 发现一个有趣的关于路由的问题, 如果res.redirect('user/login') 实际就会到
    // 当前 中间件或者说环境的那个路由下的路径 也就是 /articles/users/login  所以最前面要加上/
    // 知识点express 路由规则
    res.redirect('/users/login')
}

// 我傻了怎么 添加个这东西就报错了 , 单独放就不报错  
// md 为什么这个路由顺序也会导致不同的错误, 我把这个add 放到下面就报错
router.get('/add', auth, function(req, res) {
    res.render('articles/addarticle.html',{
        title: 'add Article',
        user: req.session.user
    })
})


/*
router.get('/', function(req, res) {
    //方法1 可行,但是方法 2 就不行了，只能在模板渲染的时候解决
    // Article.find().lean(true).exec(function(err, articles){
    //     console.log(articles)
    //     // 这里不起作用
    //     articles.forEach(function(item) {
    //         item._id = item._id.toString()
    //         // console.log(typeof item._id)  //不明白为什么拿到的是对象
    //         console.log(`本次拿到的数据`, item)
    //     })
    //     res.render('index.html',{
    //         articles: articles,
    //         message: 'ok'
    //     })
    // })
    // res.render('index.html')

    //方法2
    Article.find({}, function(err, articles) {
        if (err) throw err
        res.render('index.html',{
            articles: articles,
        })
    })
})

*/


// 所有文章管理页面
router.get('/manage', auth, function(req, res, next) {
    console.log(`当前登录用户是`, req.session.user)
    let user = req.session.user
    
    Article.find({auther: user._id}, function(err, articles) {
        if (err) next(err)
        console.log(articles)
        res.render('users/users_manage.html', {
            articles: articles,
            user: user
        })
    })
})

// 查看文章页面
router.get('/:id', function(req, res, next) {
    let user = req.session.user
    Article.findById(req.params.id, function(err, article) {
        if (err) next(err)
        //这里为什么不存在字符串有双引号的问题。???
        console.log(`查看的文章`, article, `end...`)

        //处理查看文章所需要的数据

        //时间这里不采用 mongodb来自动生成了。麻烦。真不知道Mongodb有什么好的 以后写一个mysql的版本
        // let time = new Date(article.created)
        // console.log(formatDate(time))
        // article.created = formatDate(time) 
        //这里由于mongodb 从数据库里拿到的对象并不是js的对象.多了一层。
        //所以直接修改原内容，会导致意外情况

        // 根据文章 auther 查到用户名字
        User.findById(article.auther, function(err, data) {
            // if (err) throw err
            if (err) next(err)
            res.render('articles/article.html', {
                article: article,
                auther: data.username,
                user: user
            })
        })

    })
})

// 编辑文章页面
router.get('/edit/:id', auth, function(req, res, next) {
    let user = req.session.user
    Article.findById(req.params.id, function(err, data) {
        // 这里这种办法无效了,奇怪,
        // data._id = data._id.toString()
        // console.log(data)
        // auth中间件判断了是否登录,
        if (req.session.user._id !== data.auther) {
            return res.redirect('/')
        }

        res.render('articles/edit.html', {
            title: 'Edit Article',
            article: data,
            user: user
        })
    })
})

//更新文章
router.post('/update/:id', function(req, res, next) {
    let query = {_id: req.params.id}
    console.log(query)

    Article.update(query, req.body, function(err) {
        // if (err) throw err
        if (err) next(err)
        console.log(`更新成功`,)
        res.redirect('/')
    })

    // 方法2  感觉参数太多了。不如update方便
    // Article.findByIdAndUpdate(req.params.id, { body: '前端发过来的数据' }, {new: true}, function(err, data) {
    //     if (err) throw err
    //     console.log(`更新后的数据是`, data)
    //     res.redirect('/')
    // })

})

router.post('/add', function(req, res, next) {
    console.log(`拿到的数据是`, req.body)
    let article = new Article({
        title: req.body.title,
        body: req.body.body
    })
    // 如果传进来的对象和 要存储的对象内容是一致,对应的.
    // 可以直接
    // let article = new Article(req.body)

    // 能添加文章必然是已经登录了, 那session里面必然有user 对象
    let user = req.session.user
    article.auther = user._id

    //这里有 回调的方式来做异步, 我看别的教程有用 async来写 
    article.save(function(err){
        if (err) {
            console.log(err)
            next(err)
        }
        res.redirect('/')
    })
})

// 删除文章
router.delete('/:id', function(req, res, next) {
    if (!req.session.user) {
        return res.status(500).send()
    }
    let query = {_id: req.params.id}
    let userid= req.session.user._id
    Article.findById(query, function(err, article) {
        if (article.auther !== userid) {
            res.status(500).send();
        }
        Article.remove(query, function(err) {
            // if (err) throw err
            if (err) next(err)
            res.send('随便发送过去信息')
        })
    })

})



module.exports = router








