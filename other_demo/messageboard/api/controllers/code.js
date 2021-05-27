// 生成验证码
const BMP24 = require('gd-bmp').BMP24;
const nodemailer = require('nodemailer');
var msg = require('../util/msg.config');

let NewCode = '';

// 邮件验证码
    // 验证码
function createCode(){
    let str = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890';
    let arr = '';
    for(let i = 0;i < 6;i++){
        arr += str.charAt(Math.random() * str.length | 0);
    }
    return newCode = arr;
}

let getMailCode = (req,res) => {
    // let userMail = JSON.parse(JSON.stringify(req.query.userMail)).userMail;
    let userMail = req.query.userMail;
    createCode();
    // 建立smtp链接
    let tranSports = nodemailer.createTransport({
        host : msg.mailAdd,
        secureConnection : false,
        auth: {
            user : msg.mailUser,
            pass : msg.mailPwd
        }
    })

    // 相关参数
    let options = {
        from : msg.mailUser,
        to : userMail,
        subject : '请接收您的验证码',
        html : `<div style='width:600px;margin:30px auto'><h1 style='text-align:center'>欢迎注册概念云传媒MCN账户</h1><p style='font-size:24px'>此次验证码如下:</p><strong style='font-size:20px;display:block;text-align:center;color:red'>${newCode}</strong><p>验证码十分钟内有效，请及时输入</p><i style='color:#00bfff'>此邮件为系统自动发送，请勿回复！若您没有进行过注册请忽略。</i><p style='text-align:right'>--概念云传媒(MCN)</p></div>`,
    };
    tranSports.sendMail(options,(err,msg) => {
        if(err){
            console.log(err)
        }else{
            let obj = [{
                "code":200,
                "success":true,
                "msg":"验证码已下发",
                "data":{
                    "code":newCode
                }
            }]
            res.send(obj)
            res.end();
            transporter.close();
        }
    })
}

// 检查邮件验证码
// let checkMailCode = (req,res) => {
//     let userCode = req.query;
//     console.log(userCode)
// }


let code = (req,res) => {
    // 生成随机数
    function rand(min,max){
        return Math.random()*(max-min+1)+min | 0
    }

    // 制造验证码图片
    function capcha(){
        let img = new BMP24(100,40)
        // 背景颜色
        img.fillRect(0,0,100,40,0xffffff)
        // 画曲线
        let w = img.w/2;
        let h = img.h;
        let color = rand(0,0xffffff);
        let y1 = rand(-5,5);
        let w2 = rand(10,15);
        let h3 = rand(3,5);
        let bl = rand(1,5);
        for(let i = -w;i < w;i += 0.1){
            let y = Math.floor(h/h3*Math.sin(i/w2)+h/2+y1)
            let x = Math.floor(i+w)
            for(let j = 0;j < bl;j++){
                img.drawPoint(x,y+j,color)
            }
        }
        // 生成字符
        let p = 'ABCDEFGHKMNPQRSTUVWXYZ1234567890';
        var str = '';
        for(let i = 0;i < 4;i++){
            str += p.charAt(Math.random()*p.length | 0);
        }
        // str
        req.session = str.toLowerCase();
        res.cookie('captcha',req.session);

        const fonts = [BMP24.font12x24,BMP24.font16x32];
        let x = 15;
        for(let i = 0;i < str.length;i++){
            let f = fonts[Math.random()*fonts.length | 0];
            y = 8 + rand(-10,10);
            img.drawChar(str[i],x,y,f,rand(0,0xffffff));
            x += f.w + rand(2,8);
        }
        return img;
    }
    let img = capcha();
    res.setHeader('Content-Type','image/bmp');
    let obj = img.getFileData();
    res.send(obj);
}

// 备用方案
// const svgCaptcha = require('svg-captcha');

// let code = (req,res) => {
// // 获取验证码
//     var captcha = svgCaptcha.create({  
//       // 翻转颜色  
//       inverse: false,  
//       // 字体大小  
//       fontSize: 40,  
//       // 噪声线条数  
//       noise: 2,  
//       // 宽度  
//       width: 140,  
//       // 高度  
//       height: 60,  
//     });  
//     // 保存到session,忽略大小写  
//     req.session = captcha.text.toLowerCase(); 
//     console.log(req.session); //0xtg 生成的验证码
//     //保存到cookie 方便前端调用验证
//     res.cookie('captcha', req.session); 
//     res.setHeader('Content-Type', 'image/svg+xml');
//     res.write(String(captcha.data));
//     res.end();
// }



module.exports = {
    code,
    getMailCode,
    // checkMailCode
};