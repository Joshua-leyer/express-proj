var db = require('../util/db.config');

// 首页
let home = (req, res) => {
  res.send("Welcome to the Cptyun API");
}

// 查询所有评论
let getallcomment = (req,res) => {
  let sql = "SELECT * FROM comments";
  let sqlArr = [];
  let callBack = (err, data) => {
    if (err) {
      res.json(err)
    } else {
      let obj = {
        "code": 200,
        "success": true,
        "msg": "请求成功",
        "data":data        
      }
      res.json(obj)
    }
  }
  db.sqlConnect(sql, sqlArr, callBack);  
}

// 新增一条评论
let postnewcomment = (req,res) => {
  let sql = `INSERT INTO comments(userName,userImg,title,msg,date) VALUES (?,?,?,?,?)`;
  let sqlArr = [req.body.userName,req.body.userImg,req.body.title,req.body.msg,req.body.date];
  // let sqlArr = [req.query.userName,req.query.userImg,req.query.msg,req.query.date];
  let callBack = (err, result) => {
      if (err) {
          res.json(err)
      } else {
          let obj = [{
              "code":200,
              "success":true,
              "msg":"评论成功",
              "data":{
                code:200,
                msg:"评论成功",
              }
          }]
          res.send(obj)
      }
  }
  db.sqlConnect(sql, sqlArr, callBack);
}

// 删除一条评论
let delcomment = (req,res) => {
  let sql = `DELETE FROM comments WHERE userName = '${req.body.userName}' and id = '${req.body.id}'`;
  let sqlArr = [];
  let callBack = (err, result) => {
    if (err) {
        res.json(err)
    } else {
        let obj = [{
            "code":200,
            "success":true,
            "msg":"删除成功",
            "data":{
              code:200,
              msg:"删除成功",
            }
        }]
        res.send(obj)
    }
}
db.sqlConnect(sql, sqlArr, callBack);
}

module.exports = {
  home,
  getallcomment,
  postnewcomment,
  delcomment
}