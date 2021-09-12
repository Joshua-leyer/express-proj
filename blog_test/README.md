# material




# Codeing...


## 2021年5月17日 19:33:39

解决了ajax flash跳转页面的问题,现在尝试使用 express-message插件

## 2021年5月20日 22:13:26 页面大体完成. 

md 曹丹的mongoose 狗血的 一个查询数据非要搞出来是个什么乱七八糟的格式。_id都是个object
搜索都J的费时。草。也没在官网找到 相关的办法。找了一个ObjectId() 官网给的办法都不行。谁搞这玩意儿谁SB
. 准备换数据库了。


# learning log

$ mongo
$ show dbs;
$ use nodejs-blog
$ db.createCollection('articles')
$ show collections;
$ db.articles.insert({ title: "Article One", author: "rails365", body: "This is article one" });
$ db.articles.find();
$ db.articles.insert({ title: "Article Two", author: "rails365", body: "This is article two" });
$ db.articles.find().pretty();

# Q_A

## 前端使用ajax请求后success 回调函数碰到express后端flash在locals里面挂载变量信息的时候的问题?

  done > 放弃使用 flash .暂且先不用 locals 来拿东西。这块http 传递信息这块缺知识.

# log

找到一些vue node的前后端分离项目教程. 我先跟着看一遍整个流程.

Vue+Node前后端商城项目  https://www.bilibili.com/video/BV1vJ411s7dR?p=148

?? 如果是前后端分离. vue 如何做响应式处理.

?? 实在感觉空缺了一块知识, 自己感觉是webpack方面的, 尝试先过一遍针对webpack为关键词的傻逼教程视频 查一查

（持续更新中）快速掌握Webpack核心概念【Webpack】  https://www.bilibili.com/video/BV12a4y1W76V?from=search&seid=14059220905690217598

找到一个up , 全栈技术专家, 他有一个系列课程  七天个人博客全栈开发（第四集）




















