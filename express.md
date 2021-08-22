
# Learning Log start

```js
    npm init
```

app.js 、 router.js 、 public\  、 views\  、models\  

router官网对中间件讲解(https://expressjs.com/zh-cn/guide/using-middleware.html#middleware.router)

官网对静态文件讲解(https://expressjs.com/zh-cn/starter/static-files.html)

```js
server.use(express.static(path.join(__dirname, 'public')))

使用这种简写的配置静态文件, url那边直接 : http://127.0.0.1:3000/index.html 
```


### express 从http请求中获取到web端传递的参数方法

href [1] : https://segmentfault.com/a/1190000008060014

href [2] : https://blog.csdn.net/zgljl2012/article/details/53032555

```js

    locahhost:3000/?id=424
    let id = req.query.id // 424

```

处理post传递的参数

```js
let username = req.body.username

```

```js

前端Http路径  
'user/:id'

后端获取的方式
let id = req.params.id

```

### 静态服务

三种方式: 
  + app.ues('./public/', express.static('./public/'))   //访问 : /public/**
  + app.use(express.static('./public/'))          //访问 : /** (不写./也可以)
  + app.ues('/a/', express.static('public'))  // 访问时候 : /a/public/**  

### Router 排序的问题

J在写得时候遇到过,但是没能找到准确的文章讲解这一块的.





### 关于 app.render() 方便

Node.js 原生的写法, 大体就是render的功能 

```js 

app.get('/', (req, res) =>{
    fs.readFile('public/views/index.html', (err, data) => {
        if (err) return res.send(`500 服务器发生错误`)
        // Node读取文件的时候都是Buffer的数据是node特有的一种方便他们读写数据更快之类的优势
        // 所以用node拿数据的时候 要转换一下数据 或者readFile 添加一些参数也能做到,
        res.send(toString(data))
    })
})
```


### !!! 关于路径配置的坑  , 相对路径和绝对路径

### 关于模板引擎 art-template 配置  
  
[Express：模板引擎深入研究](https://www.cnblogs.com/chyingp/p/express-render-engine.html)

[~ express ~ 模板引擎的配置与使用](https://www.cnblogs.com/500m/p/10980332.html)


安装 art-template 模板引擎

npm i art-template && express-art-template

配置 >　
``` js
//当渲染的文件是 以.html 后缀名的 使用express-art-template引擎
app.engine('html', require('express-art-template'))
//修改 views默认的存储目录
server.set('views', path.join(__dirname, './public/views/')) 
// 默认就是 ./views 目录

```

+ body-parser 中间件
  

#### 三个常用后端接受前端的数据, req.body req.query req.params

req.body 在express以前的版本需要body-parser中间件才能用, 不过现在似乎使用自带的一个json中间件也行,处理post请求,拿到表单用的.


- `req.query`: 解析后的 url 中的 querystring，如 `?name=haha`，req.query 的值为 `{name: 'haha'}`
- `req.params`: 解析 url 中的占位符，如 `/:name`，访问 /haha，req.params 的值为 `{name: 'haha'}`
- `req.body`: 解析后请求体，需使用相关的模块，如 [body-parser](https://www.npmjs.com/package/body-parser)，请求体为 `{"name": "haha"}`，则 req.body 为 `{name: 'haha'}`




#### 前端使用jquery的发送ajax请求重定向又需要携带一些数据的话,需要express res.进行操作的那种解决办法

后端send href的地址字符串,让前端success 回调函数拿到数据去 window.location.href= url  这样来处理



### 关于session 时候的不理解的问题

看的是黑马的教程,那个傻逼讲错了。草了。我在这硬听,怎么都听不明白。服了这种培训机构,黑马还算做的大的. 中国的环境,没话说

express-session ,一直没搞明白好像只需要cookie就能实现保存登录状态,为什么还要session ------> 后来,明白了，是教程讲的有问题.  验证登录那块不要用session , 太麻烦，还不好理解. 挂载到req对象上面就很狗血.


# res.render() 函数

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

? > 令我最难理解的是这个东西的使用和 express-session 的使用几乎一样样的。
区别是什么？ (http://m.imooc.com/wenda/detail/355666)  没解决我的问题

这两个东西不能理解的是 后端种下cookie的 方式都是req.cookie()这种,实在req对象下.感觉很反操作啊。分明后端要写入数据给前端都是res里面操作然后给前端。这怎么就成了在req里面写, 结果res发送响应,前端也是能实现接受到cookie

[有一个medium国外的网站一个写繁体字的文章讲的挺好,虽然还没解决我的问题](https://medium.com/johnny%E7%9A%84%E8%BD%89%E8%81%B7%E5%B7%A5%E7%A8%8B%E5%B8%AB%E7%AD%86%E8%A8%98/node-js-cookie-session%E9%A9%97%E8%AD%89%E5%8E%9F%E7%90%86%E4%BB%A5%E5%8F%8Aexpress-session%E5%A5%97%E4%BB%B6%E4%BD%BF%E7%94%A8-aeafa386837e)





? > express 中的ues()函数作用
done > 可能需要先理解中间件是什么  ? > znode.md


mongoodb > :

[关于mongodb入手要了解的文章](https://jzleung.github.io/2016/08/13/mongoose-guide/)



session 方面:

https://wiki.jikexueyuan.com/project/node-lessons/cookie-session.html

cookie session token:

https://segmentfault.com/a/1190000039303557?utm_source=sf-related

https://www.cnblogs.com/JamesWang1993/p/8593494.html


? > express 的 app.locals 与res.locals是什么，有什么用？
https://cnodejs.org/topic/579ab34af0d4b46026ba55eb



#### 关于函数何时return 何时直接res.send之类操作,  没人说,但其实实际写的时候就会直接遇到的问题,

#### ？？？ app路由和router路由的区别, 权限级别

done > 一般教程使用router的时候,tmd

直接就是app.use(router); 草了他妈。。本来这个函数还有别功能,他直接这样讲,
等于少了多少知识.草. 

a = app.Router()
a.get('put', function(){ })

看上面的和这样用. app.use('/admin', a)

加上上面的问题， 有没有一点理解. 根本上router确实是官网讲的,中间件.

等于app use使用了router来解析第一个参数的路径

不知道那些b教程为啥从来都不讲.

`
app.use(path,callback)中的callback既可以是router对象又可以是函数

app.get(path,callback)中的callback只能是函数,不能是引入的

`


//注意这种拦截器作用的 中间件的 code的位置很关键.
```js
serve.use('*', function(req, res, next) {
    console.log('use my router middleware')
    res.send('router use ok!')
})
```


#### router方面

/**
 * https://expressjs.com/zh-cn/guide/using-middleware.html
 * 
 * 其实最开始看官网并不能看出其中的妙处.
 * 
 * app.get 可以看做是特殊的app.use() ,因为它的特殊,限定了方法,所以,中间件函数的必须放进去一个函数进去
 * 而不是想use那种可以用一个router实例来接受处理.
 * 
 * 
 */

#### 中间件

app.use('/admin', adminRouter)  
// app.use() 可以用来当做路由拦截一样的东西,门, 当解析到有/admin就走这里面的路由

app.use(function(req, res, next) {
    //注意这里的位置关系.如果我把这里写到被截取的路由后面了.那在解析到这一行之后就已经被别的中间件
    // 拦截了.这一行也不会被执行.
    console.log('* route')
    next()
})



# Bug log..


bug > 记录一个 err 问题 > done

Nodejs Error: Can't set headers after they are sent错误解决

在服务器返回响应时用return， 避免出现一次请求后，返回两次响应, 在中间件写重定向的时候我直接next() , 忘记return 了 . 应该是return next(), 但是我看别的教程以及官网的案例都是没有return . 具体的不清楚了。

done >  刚才去看了一下官网,发现官网的中间件案例都挂到服务器上的所以直接next()就可以

还有一种是使用了多次返回函数,可能会造成这样原因.主要是中间件的嵌套时候可能遇到


```js

function auth(req, res, next) {
    if (req.session.user){
        return next()   //这里要 return 
    }
    res.redirect('/users/login')
}

```

把一个函数当做中间件, 当然要return, 否则可能都不能完成这个函数,出不来。



# Q_A

- ? 假如注册了同名的用户了. 数据校验在mongoose unique来完成。最终数据库的错误如何捕获,并对错误识别.返回给前端.?


#### ???? 在 mongoose 中 关于 _id双引号 问题.

详细见我的一些案例里面会有

从mongo里面拿到的数据log出来的每个文章id是字符串不带引号的.而发送到前端,　art 输出的时候就是带双引号的字符串,不知道那一个环节有问题.

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


