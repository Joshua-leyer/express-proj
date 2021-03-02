// 专门测试 json中间件 md  一个bug搞了我一万年

? > 为什么 app.use(express.json()) 官网提供的中间件失效了? 


const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()

// app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'node_modules')))

// 配置模板引擎
app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './public/views/')) 


//配置表单的中间件,方便拿数据
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('index.html')
})

app.get('/registerPage', function(req, res) {
    //再次确定不是form表单的问题 , 我TM 了. 怎么就拿不到前端的数据呢？
    res.render('register.html')
})

app.post('/register', (req, res) => {
    // 在服务器，可以使用 req.body 这个属性，来接收客户端发送过来的请求体数据
    // 默认情况下，如果不配置解析表单数据中间件，则 req.body 默认等于 undefined
    console.log(req.body)
    res.send('ok')
})

app.listen(4000, () => {
    console.log('running http://127.0.0.1:4000/')
})
