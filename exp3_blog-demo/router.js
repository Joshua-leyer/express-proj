const express = require('express')
const { User } = require('./models/user')

//使用express提供的路由
const router = express.Router()


// index.html
router.get('/', function (req, res) {
    // res.send('/index 路径 joshua ok,  此处 index.thml　页面')
    res.render('index.html')
})

// 登录页面
router.get('/loginPage', function(req, res) {
    res.render('login.html')
})

//查看所有users 
router.get('/users', async function(req, res) {
    // 基本所有读写的操作都要注意异步问题
    var users = await User.find()
    res.send(users)
})


// 注册页面
router.get('/registerPage', function(req, res) {
    res.render('register.html')
})

router.post('/register', async (req, res) => {
    console.log(req.body)
    const user = await User.create({
        username: req.body.username,
        password: req.body.password
    })
    res.send(user)
    console.log(user)
})


// router.post('/login', async (req, res) => {
//     console.log(req.body)
//     var user = await User.findOne({
//         username: req.body.username
//     })
//     if (!user) {
//         return res.status(422).send({
//             message: 'username is not found'
//         })
//     }
// })

router.post('/login' , async (req, res) => {
    // console.log(req.body)
    // 接受信息
    const {username, password} = req.body
    //去mongo查询,验证是否一致
    let user = await User.findOne({
        username: req.body.username
    })
    console.log(`mongo 查到的 user`, user)
    //检测用户名
    if (!user) {
        return res.status(424).send({
            message: 'username is not found'
        })
    }
    //验证一下密码
    // let isPasswordValid = require('bcrypt')
    //密码错误的处理
    // if (!isPasswordValid) {
    //     return res.status(424).send({
    //         message: 'password err'
    //     })
    // }
    if (password == user.password){
        //能执行到这一步就是登录成功了,　开始返回给前端内容
        req.session.username = user.username

        // res.send(`登录成功`, req.body)  自己多次写发现一个send()接受参数时候的问题
        // 其实想想,也必须这样,send() 传递参数进去一定只能有字符串 ,
        res.status(200).send(`登录成功`)
    }
    res.status(500).send('password error')
})



const auth = async (req, res, next) => {
    console.log(req,headers)
    // var raw = String(req.headers.)
}

//检验登录成功的页面用的
router.get('/profile', auth, async (req, res) =>{
    res.send(req,user)
})





// 注册页的表单, 申请路径
// router.post('/register', function (req, res) {
//     // console.log(`用户注册的信息>>`)
//     console.log(req.body)
//     // var user = User.create({
//         // username: req.body.usern
//     // })
//     res.status(200).json({
//         err_code: -1
//     })
//     // res.send()
// })

module.exports = router