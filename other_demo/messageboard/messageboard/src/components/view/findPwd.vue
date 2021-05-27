<template>
    <div class="findPwd">
        <h5>找回密码</h5>
        <div class="warp">
            <div class="checkMail activeNow">
                <input type="text" placeholder="请输入注册时填写的邮箱" id="mailInput" @blur="mailBulr" @focus="mailFocus">
                <i class="mailWar">请输入邮箱</i>
                <button class="checkMailBtn" disabled @click="checkMailBtn">下一步</button>
            </div>
            <div class="mailCodeIn active">
                <input type="text" placeholder="请输入您获得的验证码" id="codeInput" @blur="codeBlur" @focus="codeFocus" @input="nowCheckCode">
                <i class="codeWar">请输入验证码</i>
                <button class="mailCodeInBtn" disabled @click="mailCodeInBtn">下一步</button>
            </div>
            <div class="changePwd active">
                <input type="text" placeholder="请输入新密码" id="changePwdOne">
                <input type="text" placeholder="请再次输入新密码" id="changePwdTwo" @blur="changePwdTwoBlur" @focus="changePwdTwoFocus" @input="changeInput" style="margin:40px auto 0">
                <i class="changeWar">两次密码不一致</i>
                <button class="changePwdBtn" disabled @click="changePwdBtn">确定</button>
            </div>
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
            userMail : ''
        }
    },
    methods: {
        // 第一步
        mailFocus(){
            document.getElementsByClassName('mailWar')[0].style.display = 'none';
            document.getElementsByClassName('checkMailBtn')[0].dispaly = true;
            document.getElementsByClassName('checkMailBtn')[0].style.backgroundColor = '#c4c4c4';
            document.getElementsByClassName('checkMailBtn')[0].style.cursor = 'not-allowed';
        },
        mailBulr(){
            if(document.getElementById('mailInput').value==''){
                document.getElementsByClassName('mailWar')[0].style.display = 'block';
                document.getElementsByClassName('mailWar')[0].style.color = 'red';
                document.getElementsByClassName('mailWar')[0].innerHTML = '请输入邮箱';
            }else if((/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/).test(document.getElementById('mailInput').value)==false){
                document.getElementsByClassName('mailWar')[0].style.display = 'block';
                document.getElementsByClassName('mailWar')[0].style.color = 'red';
                document.getElementsByClassName('mailWar')[0].innerHTML = '邮箱格式错误';
            }else{
                axios.get(`${url.checkmail}?userMail=${document.getElementById('mailInput').value}`).then(res => {
                    if(res.data[0].data.code=='1'){
                        document.getElementsByClassName('mailWar')[0].style.display = 'block';
                        document.getElementsByClassName('mailWar')[0].style.color = '#29e629';
                        document.getElementsByClassName('mailWar')[0].innerHTML = '请点击下一步以获取邮箱验证码';
                        document.getElementsByClassName('checkMailBtn')[0].disabled = false;
                        document.getElementsByClassName('checkMailBtn')[0].style.backgroundColor = '#00bfff';
                        document.getElementsByClassName('checkMailBtn')[0].style.cursor = 'pointer';
                    }else if(res.data[0].data.code=='0'){
                        document.getElementsByClassName('mailWar')[0].style.display = 'block';
                        document.getElementsByClassName('mailWar')[0].style.color = 'red';
                        document.getElementsByClassName('mailWar')[0].innerHTML = '未查询到用户信息';
                        document.getElementsByClassName('checkMailBtn')[0].disabled = true;
                        document.getElementsByClassName('checkMailBtn')[0].style.backgroundColor = '#c4c4c4';
                        document.getElementsByClassName('checkMailBtn')[0].style.cursor = 'not-allowed';
                    }
                })
                
            }
        },
        checkMailBtn(){
            axios.get(`${url.getMailCode}?userMail=${document.getElementById('mailInput').value}`).then(res => {
                swal({
                    text: "验证码已发送，请于十分钟内完成验证",
                    icon: "success"
                });
                let newCode = res.data[0].data.code;
                this.$cookies.set('mailCode_f',newCode,60*10*1);
                setTimeout(() => {
                    this.$cookies.remove('mailCode_f');
                },600000)
                document.getElementsByClassName('checkMail')[0].className = 'checkMail active';
                document.getElementsByClassName('mailCodeIn')[0].className = 'mailCodeIn activeNow';
                document.getElementsByClassName('changePwd')[0].className = 'changePwd active';
            })
        },
        // 第二步
        codeFocus(){
            document.getElementsByClassName('codeWar')[0].style.display = 'none';
            document.getElementsByClassName('mailCodeInBtn')[0].dispaly = true;
            document.getElementsByClassName('mailCodeInBtn')[0].style.backgroundColor = '#c4c4c4';
            document.getElementsByClassName('mailCodeInBtn')[0].style.cursor = 'not-allowed';
        },
        codeBlur(){
            if(document.getElementById('codeInput').value==''){
                document.getElementsByClassName('codeWar')[0].style.display = 'block';
                document.getElementsByClassName('codeWar')[0].style.color = 'red';
                document.getElementsByClassName('codeWar')[0].innerHTML = '请输入验证码';
            }else if(this.$cookies.isKey('mailCode_f')==false){
                swal({
                    text: "验证码已失效，请重新获取！3秒后自动返回...",
                    icon: "error",
                    timer: 3000
                });
                setTimeout(() => {
                    this.$router.go(0);
                },3000)
            }
        },
        nowCheckCode(){
            let codeInput = (document.getElementById('codeInput').value).toLowerCase();
            let mailCode = (this.$cookies.get('mailCode_f').toLowerCase());
            if(codeInput!=mailCode){
                document.getElementsByClassName('codeWar')[0].style.display = 'block';
                document.getElementsByClassName('codeWar')[0].style.color = 'red';
                document.getElementsByClassName('codeWar')[0].innerHTML = '验证码错误';
            }else{
                document.getElementsByClassName('codeWar')[0].style.display = 'block';
                document.getElementsByClassName('codeWar')[0].style.color = '#29e629';
                document.getElementsByClassName('codeWar')[0].innerHTML = '请点击下一步继续';
                document.getElementsByClassName('mailCodeInBtn')[0].disabled = false;
                document.getElementsByClassName('mailCodeInBtn')[0].style.backgroundColor = '#00bfff';
                document.getElementsByClassName('mailCodeInBtn')[0].style.cursor = 'pointer';
            }
        },
        mailCodeInBtn(){
            this.userMail = document.getElementById('mailInput').value;
            document.getElementsByClassName('checkMail')[0].className = 'checkMail active';
            document.getElementsByClassName('mailCodeIn')[0].className = 'mailCodeIn active';
            document.getElementsByClassName('changePwd')[0].className = 'changePwd activeNow';
        },
        // 第三步
        changePwdTwoFocus(){
            document.getElementsByClassName('changeWar')[0].style.display = 'none';
            document.getElementsByClassName('changePwdBtn')[0].dispaly = true;
            document.getElementsByClassName('changePwdBtn')[0].style.backgroundColor = '#c4c4c4';
            document.getElementsByClassName('changePwdBtn')[0].style.cursor = 'not-allowed';
        },
        changePwdTwoBlur(){
            if(document.getElementById('changePwdOne').value==''){
                document.getElementsByClassName('changeWar')[0].style.display = 'block';
                document.getElementsByClassName('changeWar')[0].style.color = 'red';
                document.getElementsByClassName('changeWar')[0].innerHTML = '请输入密码';
            }else if(document.getElementById('changePwdTwo').value==''){
                document.getElementsByClassName('changeWar')[0].style.display = 'block';
                document.getElementsByClassName('changeWar')[0].style.color = 'red';
                document.getElementsByClassName('changeWar')[0].innerHTML = '请再次输入密码';
            }else if(document.getElementById('changePwdOne').value!=document.getElementById('changePwdTwo').value){
                document.getElementsByClassName('changeWar')[0].style.display = 'block';
                document.getElementsByClassName('changeWar')[0].style.color = 'red';
                document.getElementsByClassName('changeWar')[0].innerHTML = '两次输入密码不一致';
            }
        },
        changeInput(){
            if(document.getElementById('changePwdOne').value!=document.getElementById('changePwdTwo').value){
                document.getElementsByClassName('changeWar')[0].style.display = 'block';
                document.getElementsByClassName('changeWar')[0].style.color = 'red';
                document.getElementsByClassName('changeWar')[0].innerHTML = '两次输入密码不一致';
            }else{
                document.getElementsByClassName('changeWar')[0].style.display = 'block';
                document.getElementsByClassName('changeWar')[0].style.color = '#29e629';
                document.getElementsByClassName('changeWar')[0].innerHTML = '点击确定以完成密码修改';
                document.getElementsByClassName('changePwdBtn')[0].disabled = false;
                document.getElementsByClassName('changePwdBtn')[0].style.backgroundColor = '#00bfff';
                document.getElementsByClassName('changePwdBtn')[0].style.cursor = 'pointer';
            }
        },
        changePwdBtn(){
            let postData = {'userPwd':document.getElementById('changePwdTwo').value,'userMail':this.userMail}
            axios.post(`${url.findpwd}`,postData).then(res => {
                console.log(res.data[0].code)
                if(res.data[0].code=='200'){
                   swal({
                        text: "密码修改成功！即将返回登录页面",
                        icon: "success",
                        timer: 1000
                    }); 
                    setTimeout(() => {
                        this.$router.push({ path:'/login' })
                    },3000)
                }
            })
            .catch(err => {
                swal({
                        text: "修改失败，参数不合法或服务器没有响应",
                        icon: "error",
                        timer: 3000
                    }); 
            })
        }
    }
}
</script>

<style scoped>
/*  */
input{
    display: block;
    width: 460px;
    height: 40px;
    margin: 100px auto 0;
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
    margin: 50px auto;
    background: #c4c4c4;
    color: #fff;
    font-size: 24px;
    border: none;
    outline: none;
    border-radius: 5px;
    cursor: not-allowed;
}

i{
    display: none;
    margin: 10px 150px 0;
    padding: 0 20px;
    font-size: 16px;
    color: red;
}

.active{display: none;}
.activeNow{display: block;}
/*  */
.findPwd{
    width: 800px;
    margin: 100px auto;
}

.findPwd > h5{
    font-size: 40px;
    font-weight: 600;
    text-align: center;
}

.findPwd .warp{
    width: 800px;
    height: 500px;
    margin: 30px 0;
}
</style>