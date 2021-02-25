const express = require('express')
const { User } = require('./models') //用解构的语法接收
const jwt = require('jsonwebtoken')

const app = express()

//秘钥
const SECRET = 'joshua'

app.use(express.json())


app.get('/', async (req, res) =>{
    res.send('joshua ok')
})

app.get('/api/users', async (req, res) => {
    const users = await User.find()
    res.send(users)
})

app.post('/api/register', async (req, res) => {
    // console.log(req.body)
    const user = await User.create({
        username: req.body.username,
        password: req.body.password
    })
    //也可以,但是不安全
    // const user = User.create(req.body)
    res.send(user)
    console.log(user)
})

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        username: req.body.username
    })
    //检测用户名
    if (!user) return res.status(424).send({
        message: 'username is not found'
    })

    // 密码验证
    const isPasswordValid = require('bcrypt').compareSync(req.body.password, user.password)
    // res.send(user)
    if (!isPasswordValid) {
        return res.status(424).send({
            message: '密码无效'
        })
    }

    //生成token
    // 写在上面了 const jwt = require('jsonwebtoken')

    const token = jwt.sign({
        _id : String(user._id)
    }, SECRET)

    res.send({
        user,
        token: token
    })
})

const auth = async (req, res, next) => {
    const raw = String(req.headers.authorization).split(' ').pop()
    //verify()验证
    // const tokenData = jwt.verify(raw, SECRET)
    // let id = tokenData._id
        //也可以用解构的方式接受
    const { _id } = jwt.verify(raw, SECRET)
    //最后挂载到req上面
    req.user = await User.findById(_id)
    // console.log(user)
    next()
}

//每次执行这个接口时候就先运行auth中间件函数,然后执行next()的函数,也就会
// 下面 的函数内容 ,本质上讲get 也是个中间件,只不过是最后一个
// 这样写可以增加复用性, 
app.get('/api/profile', auth, async (req, res) => {
    res.send(req.user)
})



app.listen(3000, () => {
    console.log('http://localhost:3000')
})