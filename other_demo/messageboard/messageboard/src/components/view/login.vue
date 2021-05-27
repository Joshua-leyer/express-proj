<template>
    <div class="login">
        <h5>登录</h5>
        <div class="form">
            <input type="text" id="login_username" placeholder="请输入账号/邮箱" @blur="nameBlur" @focus="nameFocus">
            <i class="nameWar">请输入账号</i>
            <input type="password" id="login_userpwd" placeholder="请输入密码" @blur="pwdBlur" @focus="pwdFocus">
            <i class="pwdWar">请输入密码</i>
            <p>还没有账号?<router-link to="/register" tag="span">去注册</router-link><router-link to="/findPwd" tag="span" style='margin:0 0 0 10px'>找回密码</router-link></p>
            <button type="submit" @click="loginBtn">登录</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import url from '../../common/api';
import swal from 'sweetalert';
export default {
    methods: {
        nameFocus(){
            document.getElementsByClassName('nameWar')[0].style.display = 'none';
        },
        nameBlur(){
            if(document.getElementById('login_username').value==''){
                document.getElementsByClassName('nameWar')[0].style.display = 'block';
            }
        },
        pwdFocus(){
            document.getElementsByClassName('pwdWar')[0].style.display = 'none';
        },
        pwdBlur(){
            if(document.getElementById('login_userpwd').value==''){
                document.getElementsByClassName('pwdWar')[0].style.display = 'block';
            }
        },
        loginBtn(){
            if(document.getElementById('login_username').value==''){
                document.getElementsByClassName('nameWar')[0].style.display = 'block';
                return false;
            }else if(document.getElementById('login_userpwd').value==''){
                document.getElementsByClassName('pwdWar')[0].style.display = 'block';
                return false;
            }else{
                let postData = {'userName':document.getElementById('login_username').value,'userPwd':document.getElementById('login_userpwd').value}
                axios.post(`${url.login}`,postData)
                .then(res => {
                    if(res.data[0].code==200){
                        let userSession = res.data[0].data;
                        this.$cookies.set('user_session',userSession,60*60*24);
                        swal({
                            text: "登录成功，页面即将跳转...",
                            icon: "success",
                            timer: 1000
                        });
                        setTimeout(() => {
                            this.$router.push({ path:'/board' })
                        },1000)
                    }else{
                        swal({
                            title: "登录失败",
                            text: "请检查用户名或密码是否正确再重新登录",
                            icon: "warning"
                        });
                    }
                })
                .catch((err) => {
                    swal({
                            title: "服务器未响应",
                            text: "网络链接失败，服务器可能出现未知错误或请检查网络后再试。",
                            icon: "warning"
                        });
                })
            }
        }
    },
    mounted(){
        if(this.$cookies.isKey('user_session')==true){
            swal({
                text: "已有登录信息，即将跳转",
                icon: "success",
                timer: 1000
            });
            setTimeout(() => {
                this.$router.push({ path:'/board' })
            },1000)
        }
        // document.getElementById('login_username').value='admin';
        // document.getElementById('login_userpwd').value='123456';
    }
}
</script>

<style scoped>
.login{
    width: 800px;
    margin: 100px auto;
}

.login > h5{
    font-size: 40px;
    font-weight: 600;
    text-align: center;
}

.login .form{
    width: 800px;
    overflow: hidden;
}

.login .form > p{
    font-size: 16px;
    text-align: right;
    margin: 30px 150px 30px 0;
}

.login .form > p > span{
    color: #00bfff;
    cursor: pointer;
}

/*  */
input{
    display: block;
    width: 460px;
    height: 40px;
    margin: 30px auto 0;
    border: none;
    outline: none;
    padding: 0 20px;
    border-bottom: 2px solid #c4c4c4;
    font-size: 18px;
}

button{
    display: block;
    width: 500px;
    height: 50px;
    margin: 0 auto;
    background: #00bfff;
    color: #fff;
    font-size: 24px;
    border: none;
    outline: none;
    border-radius: 5px;
}

i{
    display: none;
    color: red;
    font-size: 16px;
    margin: 5px 150px 20px;
    padding: 0 20px;
}
</style>