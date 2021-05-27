// 用户注册 登录 找回
const db = require('../util/db.config');
const crypto = require('crypto');

// HMAC数据加密
function hmac(data){
    let hmac = crypto.createHmac('md5','cptyun');
    return hmac.update(data).digest('base64');
}

// 登录
let login = (req, res) => {
    let pwd = hmac(req.body.userPwd);
    let sql = "select * from users where mail = '"+req.body.userName+"' and pwd = '"+pwd+"'";
    let sqlArr = [];
    let callBack = (err, result) => {
        if (err) {
            console.log(err.message)
        } else {
            if(result==''){
                let obj = [{
                    "code":10010,
                    "success":true,
                    "msg":"登录失败，用户不存在！"
                }]
                res.send(obj)
            }else{
                let obj = [{
                    "code":200,
                    "success":true,
                    "msg":"登录成功！",
                    "data": {
                        id:result[0].id,
                        name:result[0].name,
                        mail:result[0].mail,
                        img:result[0].img
                    }
                }]
                res.send(obj)
            }
        }
    }
    db.sqlConnect(sql, sqlArr, callBack);
}

// 检查用户名是否注册
let checkName = (req,res) => {
    let sql = "select * from users where name ='"+req.query.userName+"'";
    let sqlArr = [];
    let callBack = (err, result) => {
        if (err) {
            console.log(err.message)
        } else {
            if(result==''){
                let obj = [{
                    "code":200,
                    "success":true,
                    "data":{
                        "code": 0,
                        "msg":"可以使用的用户名"
                    }
                }]
                res.send(obj)
            }else{
                let obj = [{
                    "code":400,
                    "success":false,
                    "data": {
                        "code": 1,
                        "msg":"用户名已存在"
                    }
                }]
                console.log(result)
                res.send(obj)
            }
        }
    }
    db.sqlConnect(sql, sqlArr, callBack);
}

// 检查邮箱是否注册
let checkMail = (req,res) => {
    let sql = "select * from users where mail ='"+req.query.userMail+"'";
    let sqlArr = [];
    let callBack = (err, result) => {
        if (err) {
            console.log(err.message)
        } else {
            if(result==''){
                let obj = [{
                    "code":200,
                    "success":true,
                    "data":{
                        "code": 0,
                        "msg":"可以使用的邮箱"
                    }
                }]
                res.send(obj)
            }else{
                let obj = [{
                    "code":400,
                    "success":false,
                    "data": {
                        "code": 1,
                        "msg":"该邮箱已被注册"
                    }
                }]
                console.log(result)
                res.send(obj)
            }
        }
    }
    db.sqlConnect(sql, sqlArr, callBack);
}

// 注册
let register = (req, res) => {
    let pwd = hmac(req.body.userPwd);
    let sql = `INSERT INTO users(name,pwd,mail) VALUES (?,?,?)`;
    let sqlArr = [req.body.userName,pwd,req.body.userMail];
    console.log(sqlArr)
    let callBack = (err, result) => {
        if (err) {
            res.json(err)
        } else {
            let obj = [{
                "code":200,
                "success":true,
                "msg":"注册成功",
                "data":{}
            }]
            res.send(obj)
        }
    }
    db.sqlConnect(sql, sqlArr, callBack);
}

// 找回密码
let findpwd = (req, res) => {
    let pwd = hmac(req.body.userPwd);
    let sql = 'UPDATE users SET pwd = ? WHERE mail = ?';
    let sqlArr = [pwd,req.body.userMail];
    console.log(sqlArr)
    let callBack = (err, result) => {
        if (err) {
            res.json(err)
        } else {
            let obj = [{
                "code":200,
                "success":true,
                "msg":"修改成功",
                "data":{}
            }]
            res.send(obj)
        }
    }
    db.sqlConnect(sql, sqlArr, callBack);
}


module.exports = {
    login,
    register,
    findpwd,
    checkName,
    checkMail
}