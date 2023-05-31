const express = require('express');
const router = express.Router();

const log = console.log.bind(console);

router.post('/login', async(req, res) => {
    const {username, password} = req.body
    let userInfo = {
        username: username,
        password: password
    }
    // 用户登录成功以后就对当前 http 请求的 req 对象, 下 session 添加一个 userInfo 存储到本地会话中.
    req.session.userInfo = userInfo;

    res.send({
        username: username,
        password: password
    })
})

router.get('/mylog', async (req, res) => {
    // 判断是否携带 cookie ,既是否登录了.
    log(`查看是否有cookie`, req.headers.cookie)
    if (!req.session.userInfo) {
        res.send('no login')
    } else {
        res.send({
            data: req.cookies
        })
    }

})

module.exports = router