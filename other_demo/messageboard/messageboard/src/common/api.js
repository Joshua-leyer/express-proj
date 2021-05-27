// 全局请求接口
const url = 'http://127.0.0.1:2345/api/v1';

// 登录
const login = url + '/login';

// 注册
const register = url + '/register';

// 注册时检测用户名是否被占用(如果不允许用户名重复,则应该启用它)
const checkname = url + '/checkname';

// 注册时检测邮箱是否被占用(如果不允许邮箱重复注册,则应该启用它)
const checkmail = url + '/checkmail';

// 获取邮箱验证码
const getMailCode = url + '/getMailCode';

// 验证邮箱验证码是否正确
const check_mailCode = url + '/checkMailCode';

// 找回密码
const findpwd = url + '/findpwd';


// 首次进入加载评论区
const getallcomment = url + '/getallcomment';

// 新增评论
const postnewcomment = url + '/postnewcomment';

// 删除评论
const delcomment = url + '/delcomment';

// 获取图片验证码
const code = url + '/code';


// 将接口抛出
export default{
    login,
    register,
    checkname,
    checkmail,
    getMailCode,
    check_mailCode,
    findpwd,
    getallcomment,
    postnewcomment,
    delcomment,
    code
}
