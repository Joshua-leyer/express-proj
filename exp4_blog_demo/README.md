实现了多人博客的项目: 用户注册, 写文章, 文章操作用户权限管理


# 2 搭建项目

npm init

创建app.js 、 router.js 、 public\  、 views\  、models\ 文件


# 3 配置模板引擎

key word : express如何使用模板引擎

Joshua 使用的是 art-template

# 4,5 数据库方便的配置

mongodb 、 mongoose


建立数据集合(表, 类)  Articles.js



# 6 保存文章到mongodb


```js 
router.post('/add', function(req, res) {

    //拿到表单数据 实例化Schema(表)
    let article = new Article({
        title: req.body.title,
        body: req.body.body
    })

    // 拿到前端数据 , 读取后端的数据 进行各种操作
    let user = req.session.user
    article.auther = user._id

    //保存
    article.save(function(err){
        if (err) {
            console.log(err)
            next(err)
        }
        res.redirect('/')
    })
})
```

其实整体核心思路都是前端发数据到后端, 用接口去拿到数据,然后根据数据进行操作, 

# 7 配置静态文件服务, 用 bower 来管理 Bootstrap 和 jQuery 

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


# 8 现实文章内容

因为需要详情页, 每一个文章id 都不一样利用这个当做url　路径,

bug ? > 从mongo里面拿到的数据log出来的每个文章id是字符串不带引号的.而发送到前端,　art 输出的时候就是带双引号的字符串,不知道那一个环节有问题.
```js 
    Article.find({}, function(err, articles) {
        if (err) throw err
        // 输出的所有Article 表的所有文章.
        console.log(articles)
    })
    
```
后端的内容拿到后发给前端模板引擎 , 显示出来就是 : "12sadi902134j"
本来想要的输出是 : 字符串格式就行了,可是一同吧双引号也输出出来了.
```html 
    <h3> {{ $index }} - <a href="article/{{ value._id }}">{{ value.title }}</a> </h3>
```
[别人类似的问题](https://segmentfault.com/a/1190000007818969)
总的来说是mongoose 返回数据类型的问题



深入模板引擎  了解就收数据具体格式

自己用find()函数返回的内容 输出出来发现是一个数组,每个元素是一个对象。怀疑跟这个有关系

自己查到了有两个地方可能出问题, 所以大题就是能从这两个地方解决问题。

done > A :

问了一个人, 他告诉我怎么写, 但是我还没搞明白具体原因
```html
    {{ each articles value }}
    <h4>{{ value._id }} </h4>
    <h3> {{ $index }} - <a href="articles/{{ value._id }}">{{ value.title }} + {{ `${value._id}` }}</a> </h3>
    {{ /each }}
```
{{ `${value.id}` }}  模板引擎写成这样 字符串的双引号就没有了 具体不清楚为什么

还有一种办法 : >
```js
articles.forEach(function(item) {
    item._id = item._id.toString()
    // console.log(typeof item._id)  //不明白为什么拿到的是对象
    console.log(`本次拿到的数据`, item)
})

```
把某一个字段改成字符串类型重新赋值, 应为Mongo拿到的_id数据是 特有的数据类型, 还不是js 的基本数据类型,想办法转换一下数据类型,避免art 模板引擎拿到数据的时候因为数据格式的问题造成的 出现双引号

    {{ article }}
我写到文章更新页面的时候还发生了同样的错误,在服务端解决的办法不行了。我在html页面拿到的数据直接显示到页面
{"_id":"603a6acc844efa08eb44b497","title":"two","body":"two"}
发现它把数据本能的当成字符串来解析


## mongoose 查询

Article.findById(req.params.id, function(err, data) { }


# 9  修改文章内容功能

文章id 会从url 里面传递过来
路由解析的时候用 req.parms  


-关于req.params 的用法
参数在url中时
/path/:id,参数在req.params.id中
/path?id=xx,参数在req.query.id中

用json body 或者form 表单传参时参数在req.body中


-关于textarea 标签的复习
这个标签没有value属性 内容直接写在标签内就行
```html
<textarea name="content" rows="9" cols="60">123</textarea>

```


-关于更新操作
[这里去官网看到一些讲解](http://mongoosejs.net/docs/documents.html)
findByIdAndUpdate()



# 10 删除文章, 
作者采用ajax 请求处理 , 理由是删除操作如果是get请求来完成的话,不安全

app.delete()

-express delete路由的知识点

? > 这里想到一个问题, jquery是如何实现 success 的判断的
```js
$.ajax({
    type: 'delete',
    url: '/article/' + id,
    success: function() {
        alert('Deleted article')
        window.location.href = '/'
    },
    error: function(err) {
        console.log(err)
    }

})

app.js >>>

app.delete('/article/:id', function(req, res) {
    let query = {_id: req.params.id}
    Article.remove(query, function(err) {
        if (err) throw err
        res.send('随便发送过去信息')
    })
})

```


# 11 显示flash

key word : express 添加flash信息

基于 session 来实现跳转页面还能保留一些信息

npm i express-sesion

npm i express-messages   这个库需要 connect-flash 

npm i connect-flash 



# 12 express-validator  来实现表单填写的时候验证功能



# 13 使用路由中间件重构代码

把路由文件放到 routers 文件夹里面


# 14 显示注册用户表单页面


# 15 注册表单页面路由处理功能


# 16 加密保存到数据库

https://github.com/kelektiv/node.bcrypt.js/

bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
        // Store hash in your password DB.
    });
});

对上面代码的理解 > saltRounds 是一个类似密码种子一样, 这个是我们随便设定的, 
根据种子得到一个salt然后根据salt 和我们的明文密码 得到Hash 这个就可以当做最终密码用了
```js
bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) throw err
        user.password = hash
    })
})
```

? > 用户注册要注意一个问题, 就是验证用户唯一性的问题. 如果数据库类型字段写上唯一性. 那如何捕获错误。返回给前端？

#17 登录页面和cookies概念


#18 登录认证 passport工具介绍

? >　不清楚 cookies 和session的关系到底是什么 。 以及token和cookies的关系, 到底应该保存到什么地方



#19 20 passport 功能的实现 , 目前, 自己觉得没必要使用  
作者这里用的这个中间件，自己不想用。

（https://segmentfault.com/a/1190000009663833） 讲的很好的文章了。其他的文章太抽象


express-session ,一直没搞明白好像只需要cookie就能实现保存登录状态,为什么还要session


res.render('login.html', {
    data: JSON.stringify({
        message: 'joshua'
    })
})


今天搞了一天才搞明白到底cookie-parser的关系, 直到这个文章, 感觉才算找到答案. 很简单,就是能让我们更方便的在express 中获取到heards中的cookies 的内容而已。就这么简单。当然也可以设置。就这样一个从req中拿到,一边从res中设置。
done > 刚才查看网页http 信息的时候突然发现知道怎么找到headers 的内容, 明白express-session 其实也用了cookies 了把概念和密码都搞明白了 

[找到一个关于cookie-parser中间件的文章](https://segmentfault.com/a/1190000017161778)
[另一个文章,里面有个实例写的很直观](https://blog.csdn.net/weixin_37823121/article/details/82291371)

```js
router.post('/login', function(req, res) {
    //尝试使用cookie 来实现验证登录
    res.cookie('sessionid', 'joshua', {
        httpOnly: true,
        maxAge: 1000 * 60
    })
    res.redirect('/')
})

关于如何查看是否使用成功的写入了cookie值。 可以从浏览器f12里面找到,如果学习的时候使用了别的工具就更好了。

```

我又接触到了新的 cookie-session 。。。浮球

令我最难理解的是这个东西的使用和 express-session 的使用几乎一样样的。
区别是什么？ (http://m.imooc.com/wenda/detail/355666)

这两个东西不能理解的是 后端种下cookie的 方式都是req.cookie()这种,实在req对象下.感觉很反操作啊。分明后端要写入数据给前端都是res里面操作然后给前端。这怎么就成了在req里面写, 结果res发送响应,前端也是能实现接受到cookie

[有一个medium国外的网站一个写繁体字的文章讲的挺好,虽然还没解决我的问题](https://medium.com/johnny%E7%9A%84%E8%BD%89%E8%81%B7%E5%B7%A5%E7%A8%8B%E5%B8%AB%E7%AD%86%E8%A8%98/node-js-cookie-session%E9%A9%97%E8%AD%89%E5%8E%9F%E7%90%86%E4%BB%A5%E5%8F%8Aexpress-session%E5%A5%97%E4%BB%B6%E4%BD%BF%E7%94%A8-aeafa386837e)





-路由方便的学习 还有个 路由规则




bug > 记录一个 err 问题 > done
Nodejs Error: Can't set headers after they are sent错误解决

在服务器返回响应时用return， 避免出现一次请求后，返回两次响应
在中间件写重定向的时候我直接next() , 忘记return 了 . 应该是return next()
但是我看别的教程以及官网的案例都是没有return . 具体的不清楚了。done...
刚才去看了一下官网,发现官网的中间件案例都挂到服务器上的所以直接next()就可以
而我
```js
function auth(req, res, next) {
    //核心是判断当前是否登录了
    if (req.session.user){
        return next()
    }
    res.redirect('/users/login')
}
```
把一个函数当做中间件,当然要return, 否则可能都不能完成这个函数,出不来。

bug done 

Learnning Log ...........



end .......