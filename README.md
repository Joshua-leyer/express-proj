



## Mongose 

#### ???? 关于 _id双引号 问题.

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

