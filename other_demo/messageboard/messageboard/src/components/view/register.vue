<template>
    <div class="register">
        <h5>注册</h5>
        <div class="form">
            <input type="text" id="reg_username" placeholder="请输入用户名" maxlength="16" @blur="nameBlur" @focus="nameFocus">
            <i class="nameWar">请输入用户名</i>
            <input type="text" id="reg_usermail" placeholder="请输入邮箱" @blur="mailBlur" @focus="mailFocus">
            <i class="mailWar">请输入邮箱</i>
            <input type="password" id="reg_userpwd" placeholder="请输入密码" maxlength="26" minlength="6" @blur="pwdBlur" @focus="pwdFocus">
            <i class="pwdWar">请输入密码</i>
            <div class="code">
                <input type="text" id="reg_codein" placeholder="请输入验证码" @blur="codeBlur" @focus="codeFocus" @input="checkNow">
                <em class="codetip"></em>
                <button class="getCodeBtn" disabled @click="getMailCode">获取验证码</button>
                <i class="codeWar">请输入验证码</i>
            </div>
            <p>已有账号?<router-link to="/login" tag="span">去登录</router-link></p>
            <button type="submit" @click="regBtn">注册</button>
        </div>
    </div>
</template>

<script>
import url from '../../common/api';
import axios from 'axios';
import swal from 'sweetalert';
export default {
    data(){
        return {
            state:{
                name: 1,
                mail: 1,
                pwd: 1,
                code: 1
            },
            error: require('../../assets/img/error.png'),
            ok: require('../../assets/img/ok.png')
        }
    },
    methods: {
        nameFocus(){
            document.getElementsByClassName('nameWar')[0].style.display = 'none';
            this.state.name = 1;
        },
        nameBlur(){
            if(document.getElementById('reg_username').value==''){
                document.getElementsByClassName('nameWar')[0].style.display = 'block';
                        document.getElementsByClassName('nameWar')[0].style.color = 'red';
                        document.getElementsByClassName('nameWar')[0].innerHTML = "请输入用户名";
                        this.state.name = 1;
            }else{
                axios.get(`${url.checkname}?userName=${document.getElementById('reg_username').value}`).then(res => {
                    if(res.data[0].data.code=="0"){
                        document.getElementsByClassName('nameWar')[0].style.display = 'block';
                        document.getElementsByClassName('nameWar')[0].style.color = '#29e629';
                        document.getElementsByClassName('nameWar')[0].innerHTML = res.data[0].data.msg;
                        this.state.name = 0;
                        if(this.state.name==0 && this.state.pwd==0 && this.state.mail==0){
                            document.getElementsByClassName('getCodeBtn')[0].style.backgroundColor = '#00bfff';
                            document.getElementsByClassName('getCodeBtn')[0].style.cursor = 'pointer';
                            document.getElementsByClassName('getCodeBtn')[0].disabled = false;
                        }

                    }else if(res.data[0].data.code=="1"){
                        document.getElementsByClassName('nameWar')[0].style.display = 'block';
                        document.getElementsByClassName('nameWar')[0].style.color = 'red';
                        document.getElementsByClassName('nameWar')[0].innerHTML = res.data[0].data.msg;
                        document.getElementsByClassName('getCodeBtn')[0].style.backgroundColor = '#c4c4c4';
                        document.getElementsByClassName('getCodeBtn')[0].style.cursor = 'not-allowed';
                        document.getElementsByClassName('getCodeBtn')[0].disabled = true;
                        this.state.name = 1;
                    }
                })
            }
        },
        mailFocus(){
            document.getElementsByClassName('mailWar')[0].style.display = 'none';
            this.state.mail = 1;
        },
        mailBlur(){
            if(document.getElementById('reg_usermail').value==''){
                document.getElementsByClassName('mailWar')[0].style.display = 'block';
                document.getElementsByClassName('mailWar')[0].style.color = 'red';
                document.getElementsByClassName('mailWar')[0].innerHTML = "请输入邮箱";
                this.state.mail = 1;
            }else{
                let mailValue = document.getElementById('reg_usermail').value;
                let reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
                if(reg.test(mailValue)==false){
                    document.getElementsByClassName('mailWar')[0].style.display = 'block';
                    document.getElementsByClassName('mailWar')[0].style.color = 'red';
                    document.getElementsByClassName('mailWar')[0].innerHTML = "邮箱格式错误";
                    this.state.mail = 1;
                }else if(reg.test(mailValue)==true){
                   axios.get(`${url.checkmail}?userMail=${document.getElementById('reg_usermail').value}`).then(res => {
                        if(res.data[0].data.code=="0"){
                            document.getElementsByClassName('mailWar')[0].style.display = 'block';
                            document.getElementsByClassName('mailWar')[0].style.color = '#29e629';
                            document.getElementsByClassName('mailWar')[0].innerHTML = res.data[0].data.msg;
                            this.state.mail = 0;
                            if(this.state.name==0 && this.state.pwd==0 && this.state.mail==0){
                                document.getElementsByClassName('getCodeBtn')[0].style.backgroundColor = '#00bfff';
                                document.getElementsByClassName('getCodeBtn')[0].style.cursor = 'pointer';
                                document.getElementsByClassName('getCodeBtn')[0].disabled = false;
                            }
                        }else if(res.data[0].data.code=="1"){
                            document.getElementsByClassName('mailWar')[0].style.display = 'block';
                            document.getElementsByClassName('mailWar')[0].style.color = 'red';
                            document.getElementsByClassName('mailWar')[0].innerHTML = res.data[0].data.msg;
                            document.getElementsByClassName('getCodeBtn')[0].style.backgroundColor = '#c4c4c4';
                            document.getElementsByClassName('getCodeBtn')[0].style.cursor = 'not-allowed';
                            document.getElementsByClassName('getCodeBtn')[0].disabled = true;
                            this.state.mail = 1;
                        }
                    }) 
                }
            }
        },
        pwdFocus(){
            document.getElementsByClassName('pwdWar')[0].style.display = 'none';
            this.state.pwd = 1;
        },
        pwdBlur(){
            if(document.getElementById('reg_userpwd').value==''){
                document.getElementsByClassName('pwdWar')[0].style.display = 'block';
                document.getElementsByClassName('pwdWar')[0].style.color = 'red';
                document.getElementsByClassName('pwdWar')[0].innerHTML = "请输入密码";
                this.state.pwd = 1;
            }else{
                this.state.pwd = 0;
                if(this.state.name==0 && this.state.pwd==0 && this.state.mail==0){
                    document.getElementsByClassName('getCodeBtn')[0].style.backgroundColor = '#00bfff';
                    document.getElementsByClassName('getCodeBtn')[0].style.cursor = 'pointer';
                    document.getElementsByClassName('getCodeBtn')[0].disabled = false;
                }
            }
        },
        codeFocus(){
            document.getElementsByClassName('codeWar')[0].style.display = 'none';
            document.getElementsByClassName('codetip')[0].style.display = 'inline-block';
        },
        codeBlur(){
            if(document.getElementById('reg_codein').value==''){
                document.getElementsByClassName('codeWar')[0].style.display = 'inline-block';
                // document.getElementsByClassName('codeWar')[0].innerHTML = '请输入验证码';
            }
        },
        getMailCode(){
            if(this.state.name==0 && this.state.pwd==0 && this.state.mail==0){
                let timer = new Date().getTime();
                let countDown = 120;
                axios.get(`${url.getMailCode}?userMail=${document.getElementById('reg_usermail').value}&${timer}`).then(res => {
                    let newCode = res.data[0].data.code;
                    this.$cookies.set('mailCode',newCode,60*10*1);
                    setInterval(() => {
                        countDown -= 1;
                        document.getElementsByClassName('getCodeBtn')[0].disabled = true;
                        document.getElementsByClassName('getCodeBtn')[0].style.backgroundColor = '#c4c4c4';
                        document.getElementsByClassName('getCodeBtn')[0].style.cursor = 'not-allowed';
                        document.getElementsByClassName('getCodeBtn')[0].innerHTML = `已发送。（${countDown}）秒后再试`;
                        if(countDown <=0){
                            document.getElementsByClassName('getCodeBtn')[0].disabled = false;
                            document.getElementsByClassName('getCodeBtn')[0].style.backgroundColor = '#00bfff';
                            document.getElementsByClassName('getCodeBtn')[0].style.cursor = 'pointer';
                            document.getElementsByClassName('getCodeBtn')[0].innerHTML = `获取验证码`;
                        }
                    },1000)
                    setTimeout(() => {
                        this.$cookies.remove('mailCode');
                    },600000)
                })
            }
        },
        checkNow(){
            let nowValue = (document.getElementById('reg_codein').value).toLowerCase();
            let cookieValue = (this.$cookies.get('mailCode')).toLowerCase();
            if(nowValue!=cookieValue){
                document.getElementsByClassName('codetip')[0].style.display = 'inline-block';
                document.getElementsByClassName('codetip')[0].style.background = `url('${this.error}') no-repeat`;
                document.getElementsByClassName('codetip')[0].style.backgroundSize = '26px';
            }else{
                document.getElementsByClassName('codetip')[0].style.display = 'inline-block';
                document.getElementsByClassName('codetip')[0].style.background = `url('${this.ok}') no-repeat`;
                document.getElementsByClassName('codetip')[0].style.backgroundSize = '26px';
                this.state.code = 0;
            }
        },
        regBtn(){
            if(document.getElementById('reg_username').value==''){
                document.getElementsByClassName('nameWar')[0].style.display = 'block';
                return false;
            }else if(document.getElementById('reg_userpwd').value==''){
                document.getElementsByClassName('pwdWar')[0].style.display = 'block';
                return false;
            }else{
                let postData = {'userName':document.getElementById('reg_username').value,'userPwd':document.getElementById('reg_userpwd').value,'userMail':document.getElementById('reg_usermail').value}
                axios.post(`${url.register}`,postData)
                .then(res => {
                    if(res.data[0].code==200){
                        let userSession = res.data[0].data;
                        this.$cookies.set('user_session',userSession,60*60*24);
                        swal({
                            text: "注册成功，页面即将跳转...",
                            icon: "success",
                            timer: 1000
                        });
                        setTimeout(() => {
                            this.$router.go(-1);
                            axios.get(`${url.login}?userName=${username}&userPwd=${userpwd}`).then(res => {
                                let userSession = res.data[0].data;
                                this.$cookies.set('user_session',userSession,60*60*24);
                            })
                        },1000)
                    }else{
                        swal({
                            title: "注册失败",
                            text: "请检查用户名或密码是否正确再重新登录",
                            icon: "warning"
                        });
                    }
                })
            }
        }
    }
}
</script>

<style scoped>
.register{
    width: 800px;
    margin: 100px auto;
}

.register > h5{
    font-size: 40px;
    font-weight: 600;
    text-align: center;
}

.register .form{
    width: 800px;
    overflow: hidden;
}

.register .form > p{
    font-size: 16px;
    text-align: right;
    margin: 30px 150px 30px 0;
}

.register .form > p > span{
    color: #00bfff;
    cursor: pointer;
}

.register .code{
    margin: 30px 150px 0;
}

.register .code #reg_codein{
    width: 200px;
    margin: 0;
    display: inline-block;
}

.register .code > em{
    display: none;
    width: 26px;
    height: 26px;
    background: url('../../assets/img/error.png') no-repeat;
    background-size: 26px;
    vertical-align: bottom;
    margin: 7px 12px;
}

.register .code > button{
    display: inline-block;
    width: 200px;
    height: 40px;
    font-size: 16px;
    text-align: center;
    line-height: 40px;
    color: #fff;
    background: #c4c4c4;
    border-radius: 5px;
    vertical-align: top;
    cursor: not-allowed;
}

.register .code .codeWar{
    margin: 5px 0 0;
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
    margin: 5px 150px 0;
    padding: 0 20px;
}
</style>