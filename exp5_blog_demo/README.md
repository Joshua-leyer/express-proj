关于express的学习时写个人博客案例的笔记

# 学习路线笔记

## 2 搭建项目

npm init 

创建文件 app.js 、router.js 、 public\、views\ 、 models\ 

## 3 配置模板引擎

这里主要是用来处理html前端的现实的

key word : express如何使用模板引擎

Joshua 使用的是 art-template

## 4,5 数据库方面的配置

到这里就要单独去学习一下mongodb的知识了。

mongodb 、 mongoose

建立数据集合(表, 类)  Articles.js

## 6 保存文章到mongodb

其实整体核心思路都是前端发数据到后端, 用接口去拿到数据, 然后根据数据进行操作


```js 
例子 > 
router.post('/add', function(req, res) {

    //拿到表单数据 实例化Schema(表)
    let article = new Article({
        title: req.body.title,
        body: req.body.body
    })

    // 拿到前端数据 , 读取后端的数据 进行各种操作
    let user = req.session.user
    article.auther = user._id

    //保存  更多的api  google搜索一下
    article.save(function(err){
        if (err) {
            console.log(err)
            next(err)
        }
        res.redirect('/')
    })
})

```

## 7 配置静态文件服务, 用 bower 来管理 Bootstrap 和 jQuery 

这里的目的就是为了前端页面加载资源使用

因为方便前端页面的库, 要使用静态服务,  

注意文件路径问题

app.use(express.static(path.join(__dirname, 'public')))

验证静态服务是否正确使用了 http://localhost:5000/about.html


bower 如果用的话,需要去学习一下, 不过如果用的资源少, 自己手动放进去一样

前端方面的包, 主要是解决html 前端方面的资源加载问题

类似npm的包, 下载前端方面的库

bower 其实就是类似npm 一样下载包的, 只不过下载的内容偏向于前端的库
使用的时候还要新建一个文件,里面配置一些路径什么的.


## 8 现实文章内容

因为需要详情页, 每一个文章id 都不一样, 可以利用这个当做url　路径,

word key : mongodb　数据查询

这里有个坑 ? > 如果使用了这种:id 的写法。那在这段函数之后(整个代码文件的下面)的简单路由例如 '/mylog' 返回一个html页面.就会报错 具体原因我也不清楚, 只是把简单路由放在前面就没事了。  (https://expressjs.com/zh-cn/guide/routing.html)

`
    Express 使用 path-to-regexp 来匹配路由路径；请参阅 path-to-regexp 文档以了解定义路由路径时所有的可能性。Express Route Tester 是用于测试基本 Express 路由的便捷工具，但是它不支持模式匹配。
`



```js 

word key : express路径

// 查看文章页面
router.get('/:id', function(req, res, next) {
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

        // 根据文章auther 查到用户名字
        User.findById(article.auther, function(err, user) {
            // if (err) throw err
            if (err) next(err)
            res.render('articles/article.html', {
                article: article,
                auther: user.username,
                loginuser: req.session.user
            })
        })

    })
})

```

? >　这里写字人写的时候遇到一个问题, 从mongodb 拿到的数据 然后直接返回给前端 并不真正是个js对象会导致数据格式的一些问题
后端的内容拿到后发给前端模板引擎 , 显示出来就是 : "12sadi902134j" 本来想要的输出是 : 字符串格式就行了,可是一同吧双引号也输出出来了. 
```js 
    Article.find({}, function(err, articles) {
        if (err) throw err
        // 输出的所有Article 表的所有文章.
        console.log(articles)
    })
    
```


## 9  修改文章内容功能

文章id 会从url 里面传递过来

路由解析的时候用 req.parms  



mongodb方面
-关于更新操作
[这里去官网看到一些讲解](http://mongoosejs.net/docs/documents.html)
findByIdAndUpdate()

## 17 登录页面和cookies概念



##　18 登录认证 passport 工具介绍


# Learning Log

### console.log监听端口的
```js

app.listen(3000, () => {
    console.log('server is running: http://127.0.0.1:3000/')
})

let server = app.listen(5000, '127.0.0.1', () => {
    let host = server.address().address
    let port = server.address().port

    log(`应用实例，访问地址为 http://${host}:${port}`)
})

```
### bug ? > 

从mongo里面拿到的数据log出来的每个文章id是字符串不带引号的.而发送到前端,　art 输出的时候就是带双引号的字符串,不知道那一个环节有问题.

[别人类似的问题](https://segmentfault.com/a/1190000007818969)

总的来说是mongoose 返回数据类型的问题

done > 这里有两个解决问题的思路  

1. 前端拿到数据后修改格式  

    {{ `${value.id}` }}  可以去掉双引号的问题

2. 后端从数据库拿到数据后, 修改一下格式

### -关于textarea 标签的复习

这个标签没有value属性 内容直接写在标签内就行

```html
<textarea name="content" rows="9" cols="60">123</textarea>

```

###　路由url解析方面的api

文章id 会从url 里面传递过来

路由解析的时候用 req.parms  


-关于req.params 的用法

参数在url中时

/path/:id,参数在req.params.id中

/path?id=xx,参数在req.query.id中

用json body 或者form 表单传参时参数在req.body中
