var express = require('express');
var router = express.Router();

const data = require('../controllers/controller');
const user = require('../controllers/user');
const verification = require('../controllers/code');

/* GET page. */
// 首页
router.get('/',data.home);

// 图片验证码
router.get('/code',verification.code);
// 邮件验证码
router.get('/getMailCode',verification.getMailCode);
// 检查邮件验证码
// router.get('/checkMailCode',verification.checkMailCode);

// 评论区操作
router.get('/getallcomment',data.getallcomment);
router.post('/postnewcomment',data.postnewcomment);
router.post('/delcomment',data.delcomment);

// 用户操作
router.post('/login',user.login);
router.post('/register',user.register);
router.post('/findpwd',user.findpwd);

// 注册信息检查
router.get('/checkname',user.checkName);
router.get('/checkmail',user.checkMail);

module.exports = router;
