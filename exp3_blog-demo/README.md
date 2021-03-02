2021年2月25日 16:41:31


```
npm init 
```

尝试按照7day的教程实现基本路由



- 其中 * express路由中间件 *

[官网提供的Router 件](https://expressjs.com/zh-cn/guide/using-middleware.html#middleware.router)
没有太多的讲解了。看router.js 


- 配置静态文件 * express.static *

[官网](https://expressjs.com/zh-cn/starter/static-files.html)

```js
server.use(express.static(path.join(__dirname, 'public')))
使用这种简写的配置静态文件, url那边直接 : http://127.0.0.1:3000/index.html 
就可以访问到页面

```

? > * app.render(view, [locals], callback) * 知识点

后端发往前端的数据本质全部都是字符串, 在不使用静态资源功能的情况下直接使用最原始的 node 的fs模块
拿到html文件,解析出来的是字符串,发送给前端的是html格式的字符串.但是这样代码写起来很麻烦
```js 
app.get('/', (req, res) =>{
    fs.readFile('public/views/index.html', (err, data) => {
        if (err) return res.send(`500 服务器发生错误`)
        // Node读取文件的时候都是Buffer的数据是node特有的一种方便他们读写数据更快之类的优势
        // 所以用node拿数据的时候 要转换一下数据 或者readFile 添加一些参数也能做到,
        res.send(toString(data))
    })
})

而且这种 读取文件的操作还会出现异步 同步的问题, 7day 黑马教程有讲

```

? > done > 这里有个坑, 是node 读取文件的时候凡是路径, 大概会遇到绝对路径和相对路径的坑,和app.js运行的时候cmd当前的路径有关系(似乎).解决办法就是使用绝对路径 path模块 

- 配置模板引擎

如何配置模板引擎  黑马day7 教程中04天讲

? > done > 需要配置模板引擎才能用 app.render() , 否则就没有render这个函数来使用

[别人的文章](https://www.cnblogs.com/chyingp/p/express-render-engine.html)

[别人关于模板引擎的文章](https://www.cnblogs.com/500m/p/10980332.html)

安装art-template模板引擎

npm i art-template && express-art-template

配置 >　
``` js
//当渲染的文件是 以.html 后缀名的 使用express-art-template引擎
app.engine('html', require('express-art-template'))
//修改 views默认的存储目录
server.set('views', path.join(__dirname, './public/views/')) 
// 默认就是 ./views 目录

```

- 使用　body-parser 方便拿到表单数据



- 根据需求设计路由

express 提供了一个Router中间件

- 学习mongoose的知识 构建数据模型表


? >  mongoose方面如何实例化Schema (类), 保存

```js 
有一个是这样写的. 
app.post('/api/register', async (req, res) => {
    console.log(req.body)
    const user = await User.create({
        username: req.body.username,
        password: req.body.password
    })
    // 也可以,但是不安全
    // const user = User.create(req.body)
    res.send(user)
    console.log(user)
})

另外一个人这样
router.post('/register', function (req, res, next) {
  // 1. 获取表单提交的数据
  //    req.body
  // 2. 操作数据库
  //    判断改用户是否存在
  //    如果已存在，不允许注册
  //    如果不存在，注册新建用户
  // 3. 发送响应
  var body = req.body
  User.findOne({
    $or: [{
        email: body.email
      },
      {
        nickname: body.nickname
      }
    ]
  }, function (err, data) {
    if (err) {
      // return res.status(500).json({
      //   success: false,
      //   message: '服务端错误'
      // })
      return next(err)
    }
    // console.log(data)
    if (data) {
      // 邮箱或者昵称已存在
      return res.status(200).json({
        err_code: 1,
        message: 'Email or nickname aleady exists.'
      })
      return res.send(`邮箱或者密码已存在，请重试`)
    }

    // 对密码进行 md5 重复加密
    body.password = md5(md5(body.password))

    new User(body).save(function (err, user) {
      if (err) {
        return next(err)
      }

      // 注册成功，使用 Session 记录用户的登陆状态
      req.session.user = user

      // Express 提供了一个响应方法：json
      // 该方法接收一个对象作为参数，它会自动帮你把对象转为字符串再发送给浏览器
      res.status(200).json({
        err_code: 0,
        message: 'OK'
      })

      // 服务端重定向只针对同步请求才有效，异步请求无效
      // res.redirect('/')
    })
  })
})

```


- 每个路由页面的处理, 写完后, 添加登录功能,
 
学习 关键词 , express 登录验证机制 ,

这里涉及到一些概念要了解, 接触了几个中间件, 用了不少时间

Joshua 用的是 express-session



```js
router.post('/login', async (req, res) => {
    console.log(req.body)
    var user = await User.findOne({
        username: req.body.username
    })
    if (!user) {
        return res.status(422).send({
            message: 'username is not found'
        })
    }
})

```



# ??? Log >>>>

- app.use(express.json()) 失效的bug

app2.js 测试失效问题, 没解决,最后用了中间件 require('body-parser')





??? Log end >>>>

# Learning Log  >>>>>>



Learning Log end >>>>>>