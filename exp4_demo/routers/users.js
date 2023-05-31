const express = require('express')
// const cookieParser = require('cookie-parser') 

const { User } = require('../models/user')
const bcrypt = require('bcrypt')



let router = express.Router()

//查看所有用户
router.get('/allusers', function(req, res) {
    User.find({}, function(err, data) {
        // if (err) throw err
        if (err) next(err)
        // console.log(data)
        // res.send(`${data}`)
        res.status(200).json(data)
    })
})

//登录页面
router.get('/register', function(req, res) {
    res.render('users/register.html')
})

//注册用户
router.post('/register', function(req, res) {
    let user = new User(req.body)

    //这个写法可真麻烦 , 能一行就解决的最好了 . 
    bcrypt.genSalt(10, function(err, salt) {
        if (err) throw err
        bcrypt.hash(user.password, salt, function(err, hash) {
            // if (err) throw err
            if (err) next(err)
            user.password = hash
            user.save(function(err) {
                // if (err) throw err
                if (err) next(err)
                // console.log(`用户创建成功`, user)
                res.redirect('/')
            })
        })
    })
})

//登录
router.get('/login', function(req, res) {
    res.render('users/login.html')
})

//退出
router.get('/logout', function(req, res) {
    console.log(`退出登录前的seeion内容`, req.session.user)
    req.session.user = null
    res.redirect('/')
})

//使用cookie-parser 来最简单的写  但是,我没理解,要是有了　express-session.还用这个干吗嘛.
/*
router.post('/login', function(req, res) {
    //尝试使用cookie 来实现验证登录
    res.cookie('sessionid', 'joshua', {
        httpOnly: true,
        maxAge: 1000 * 60
    })

    res.redirect('/')
})
*/

//使用 express-session 来写
router.post('/login', function(req, res) {
    console.log(req.body)
    const { username, password } = req.body
    // 这里就是核心的语句, 就是在session对象下面自定义 user(自定义一个键值对) , 但是这里还没有把任何内容放到前端里面去,
    // 没看懂  > 看了一个文章可算了解了。flag > 写个文章

    //下面的写法有一个Bug 就是其实 用户名错误和 服务器那边电脑出错的区分都 可能被当做err抛出。暂且就这样
    User.findOne({
        username: username,
    }, function(err, user) {
        if (err) throw err
        let passwordHash = user.password
        bcrypt.compare(req.body.password, passwordHash, function(err, result) {
            // if (err) throw err
            if (err) next(err)
            if (result) {
                console.log(`登录成功...`, result)
                req.session.user = user 
                res.redirect('/')
            }
        })

        // // next()
        // console.log(`搜索到的数据库对应的信息`, user)
        // if (user.password !== password) {
        //     return res.status(424).send({
        //         message: '密码错误'
        //     })
        // }
        // // 用户名, 密码正确
        // req.session.user = username 
        // res.redirect('/')
    })
})


module.exports = router