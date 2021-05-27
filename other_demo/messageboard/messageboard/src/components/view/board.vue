<template>
  <!-- 留言板 -->
  <div class="board">
    <div class="userMsg">
      <div class="warp">
        <div class="user_img">
          <img :src="this.user.userImg==''?require('../../assets/img/default_head.png'):this.user.userImg"/>
        </div>
        <div class="user_msg">
          <div class="no_login" v-if="this.state=='0'?true:false">
            <router-link to="/login" tag="p">登录</router-link>
            <router-link to="/register" tag="p">注册</router-link>
          </div>
          <div class="is_login" v-if="this.state=='0'?false:true">
            <p>{{this.user.userName}}</p>
            <i @click="outLogin">[退出]</i>
          </div>
        </div>
      </div>
    </div>
    <div class="board_panel">
      <h2>留言板</h2>
      <div class="input">
          <input type="text" id="title" placeholder="请输入标题..." minlength="1" @blur="titleBlur" @focus="titleFocus">
          <em class="titleWar">哎呀，是不是标题忘了</em>
          <textarea id="comment" placeholder="请输入高论..." minlength="1" @blur="commentBlur" @focus="commentFocus"></textarea>
          <em class="commentWar">内容不能是空的</em>
          <div class="post_in">
              <input type="text" id="code_in" placeholder="请输入验证码" @input="codeIn">
              <i class="codeStatic"></i>
              <img :src="this.codeImg" alt="图片验证码" title="点击刷新" @click="pushCode">
          </div>
          <div class="post_button">
              <button id="postBtn" @click="postBtn" disabled>提交</button>
          </div>
      </div>
      <div class="out">
          <div class="out_titles">
              <i>{{this.comment}}</i><span>评论</span>
          </div>
          <!-- 评论总 -->
          <div class="comments_list">
              <!-- 评论详细 -->
              <div class="list_details" v-for="item in comments" :key="item.id">
                  <div class="user_head">
                      <img :src="item.userImg">
                  </div>
                  <div class="comment_details">
                      <p>{{item.userName}}<span @click="delComment(item.userName,item.id)">删除</span></p>
                      <div class="text">【{{item.title}}】--{{item.msg}}</div>
                      <!-- 态度 -->
                      <div class="manner">
                          <i>{{item.date}}</i>
                          <!-- <div class="like">
                              <i></i>
                              <span></span>
                          </div>
                          <div class="hate">
                              <i></i>
                              <span></span>
                          </div> -->
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
import url from '../../common/api';

export default {
  data() {
    return {
        state: 0,
        title: 0,
        comment: 0,
        comments: '',
        code: 0,
        codeImg: '',
        codeTime: '',
      user: {
        userId: '',
        userImg: require('../../assets/img/default_head.png'),
        userName: ''
      },
      error: require('../../assets/img/error.png'),
      ok: require('../../assets/img/ok.png')
    };
  },
  methods: {
    //   退出
    outLogin() {
      swal({
        title: "确定要退出吗?",
        icon: "warning",
        // buttons: true,
        buttons: ['取消','确认'],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.$cookies.remove('user_session');
          this.$router.go(0);
          swal("已退出!", {
            icon: "success",
          });
        }
      });
    },

    // 标题检查
    titleFocus(){
      document.getElementsByClassName('titleWar')[0].style.display = 'none';
      this.title = 0;
    },
    titleBlur(){
      if(document.getElementById('title').value==''){
         document.getElementsByClassName('titleWar')[0].style.display = 'block';
      }else{
        this.title = 1;
        if(this.title==1 && this.comment==1 && this.code==1){
          document.getElementById('postBtn').disabled = false;
          document.getElementById('postBtn').style.background = '#00bfff';
          document.getElementById('postBtn').style.cursor = 'pointer';
        }
      }
    },

    // 检查内容
    commentFocus(){
      document.getElementsByClassName('commentWar')[0].style.display = 'none';
      this.comment = 0;
    },
    commentBlur(){
      if(document.getElementById('comment').value==''){
        document.getElementsByClassName('commentWar')[0].style.display = 'block';
      }else{
        this.comment = 1;
        if(this.title==1 && this.comment==1 && this.code==1){
          document.getElementById('postBtn').disabled = false;
          document.getElementById('postBtn').style.background = '#00bfff';
          document.getElementById('postBtn').style.cursor = 'pointer';
        }
      }
    },

    // 刷新验证码
    pushCode(){
      this.codeImg = `${url.code}?${new Date().getTime()}`
    },

    // 输入验证码时
    codeIn(){
      let userCode = (document.getElementById('code_in').value).toLowerCase();
      let sysCode = (this.$cookies.get('captcha')).toLowerCase();
      if(userCode='' || userCode!=sysCode){
        document.getElementsByClassName('codeStatic')[0].style.display = 'inline-block';
        document.getElementsByClassName('codeStatic')[0].style.background = `url('${this.error}') no-repeat`;
        document.getElementsByClassName('codeStatic')[0].style.backgroundSize = '26px';
        this.code = 0;
      }else{
        document.getElementsByClassName('codeStatic')[0].style.display = 'inline-block';
        document.getElementsByClassName('codeStatic')[0].style.background = `url('${this.ok}') no-repeat`;
        document.getElementsByClassName('codeStatic')[0].style.backgroundSize = '26px';
        this.code = 1;
        if(this.title==1 && this.comment==1 && this.code==1){
          document.getElementById('postBtn').disabled = false;
          document.getElementById('postBtn').style.background = '#00bfff';
          document.getElementById('postBtn').style.cursor = 'pointer';
        }
      }
    },
    
    // 提交评论
    postBtn(){
      if(this.state=='0'){
        swal({
          title:'必须登陆后才可以评论',
          icon:'error'
        })
      }else{
        function times(n){ return n>=10?n:'0'+n; }
        let date = `${(new Date()).getFullYear()}-${times((new Date()).getMonth()+1)}-${times((new Date()).getDate())}   ${times((new Date()).getHours())}:${times((new Date()).getMinutes())}:${times((new Date()).getSeconds())}`;
        let postData = { "userName":this.user.userName,"userImg":this.user.userImg,"title":document.getElementById('title').value,"msg":document.getElementById('comment').value,"date":date }      
        axios.post(`${url.postnewcomment}`,postData).then(res => {
          if(res.data[0].code=='200'){
            swal({
              title: "评论成功！",
              icon:"success"
            })
            setTimeout(() => {this.$router.go(0)},1000)
          }
        })
      }
    },

    // 删除评论
    delComment(name,id){
      if(name!=this.user.userName){
        swal({
          title:"抱歉，您无权删除此评论",
          icon: "error"
        })
      }else{
        swal({
          title: "你确定要删除这条评论吗?",
          text: "注意：此操作无法复原!",
          icon: "info",
          buttons: ["取消","确定"]
        })
        .then((willDelete) => {
          if (willDelete) {
            let postData = {"userName":name,"id":id}
            axios.post(`${url.delcomment}`,postData).then(res => {
              if(res.data[0].code=='200'){
                swal({
                  title: "删除成功！",
                  icon: "success",
                  timer: 1000
                })
                setTimeout(() => {
                  this.$router.go(0);
                },1000)
              }
            })
          }
        })
      }
    }
  },
  mounted() {
    // 读取用户信息
    if(this.$cookies.isKey('user_session')==true){
      let users = this.$cookies.get('user_session');
      this.user.userId = users.id;
      this.user.userImg = users.img;
      this.user.userName = users.name;
      this.state = 1;
    }
    // 首次获取图片验证码
    this.codeImg = `${url.code}?${new Date().getTime()}`;
    // 首次获取所有评论
    axios.get(url.getallcomment).then(res => {
      this.comment = res.data.data.length;
      this.comments = (res.data.data).reverse();
    })
  },
};
</script>

<style scoped>
.board {
  width: 1200px;
  height: 60px;
  margin: 20px auto;
}

.board .userMsg {
  width: 1200px;
  height: 60px;
}

.board .userMsg .warp{
    float: right;
}

.board .userMsg .warp .user_img {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 2px solid #c4c4c4;
  border-radius: 50%;
  overflow: hidden;
}

.board .userMsg .warp .user_img > img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.board .userMsg .warp .user_msg {
  display: inline-block;
  font-size: 20px;
  vertical-align: top;
}

.board .userMsg .warp .user_msg .no_login {
  margin: 0 0 0 5px;
}

.board .userMsg .warp .user_msg .no_login > p {
  display: inline-block;
  line-height: 50px;
  margin: 0 10px 0 0;
  cursor: pointer;
}

.board .userMsg .warp .user_msg .no_login > p:hover {
  color: #00bfff;
}

.board .userMsg .warp .user_msg .is_login > p {
  display: inline-block;
  line-height: 50px;
  margin: 0 0 0 10px;
}

.board .userMsg .warp .user_msg .is_login > i {
  display: inline-block;
  color: #00bfff;
  cursor: pointer;
}

.board .board_panel{
    margin: 10px 0;
}

.board .board_panel > h2{
    font-size: 40px;
    font-weight: 600;
    letter-spacing: 20px;
    text-align: center;
}

.board .board_panel .input{
    margin: 20px 0;
}

.board .board_panel .input #title{
    width: 1158px;
}

/*  */
input{
    height: 38px;
    padding: 0 20px;
    font-size: 16px;
    border: 1px solid #c4c4c4;
    border-radius: 5px;
    outline: unset;
}

textarea{
    margin: 20px 0;
    width: 1158px;
    height: 360px;
    padding: 20px;
    font-size: 16px;
    border: 1px solid #c4c4c4;
    border-radius: 5px;
    outline: unset;
    resize: unset;
}

em{
    display: none;
    margin: 10px 0 0;
    padding: 0 20px;
    font-size: 16px;
    color: red;
}

/*  */

.board .board_panel .post_in{
    margin: 20px 0;
}

.board .board_panel .post_in #code_in{
    width: 100px;
}

.board .board_panel .post_in > i{
    display: none;
    width: 26px;
    height: 26px;
    background: url('../../assets/img/error.png') no-repeat;
    background-size: 26px;
    vertical-align: bottom;
    margin: 7px;
}

.board .board_panel .post_in > img{
    width: 100px;
    height: 40px;
    margin: 0 10px;
    vertical-align: bottom;
    cursor: pointer;
}

.board .board_panel .post_button > button{
    width: 200px;
    height: 40px;
    font-size: 22px;
    color: #fff;
    letter-spacing: 10px;
    line-height: 40px;
    text-align: center;
    border: none;
    border-radius: 5px;
    background: #c4c4c4;
    outline: unset;
    cursor: not-allowed;
}

.board .board_panel .out{
    margin: 0;
}

.board .board_panel .out .out_titles{
    width: 1200px;
    padding: 5px 0;
    font-size: 24px;
    border-bottom: 1px solid #999;
}

.board .board_panel .out .out_titles > i{
    margin: 0 10px 0 0;
}

.board .board_panel .out .comments_list{
    width: 1200px;
    height: auto;
    margin: 20px 0;
}

.board .board_panel .out .comments_list .list_details{
  float: left;
    width: 1200px;
    height: auto;
    margin: 20px 0;
}

.board .board_panel .out .comments_list .list_details .user_head{
    float: left;
    width: 70px;
    height: auto;
}

.board .board_panel .out .comments_list .list_details .user_head > img{
    width: 60px;
    height: 60px;
    border-radius: 50%;
}

.board .board_panel .out .comments_list .list_details .comment_details{
    float: left;
}

.board .board_panel .out .comments_list .list_details .comment_details > p{
    font-size: 16px;
    color: #6d757a;
}

.board .board_panel .out .comments_list .list_details .comment_details > p > span{
  font-style: unset;
  font-size: 12px;
  color: #999;
  margin: 0 0 0 8px;
  cursor: pointer;
}

.board .board_panel .out .comments_list .list_details .comment_details .text{
  max-width: 1130px;
    line-height: 20px;
    padding: 2px 0;
    font-size: 14px;
    text-shadow: none;
    overflow: hidden;
    word-wrap: break-word;
    word-break: break-word;
    white-space: pre-wrap;
}

.board .board_panel .out .comments_list .list_details .comment_details .manner{
    display: block;
    color: #99a2aa;
}

.board .board_panel .out .comments_list .list_details .comment_details .manner div{
    display: inline-block;
}

.board .board_panel .out .comments_list .list_details .comment_details .manner > div > i{
    display: inline-block;
    width: 20px;
    height: 20px;
    margin: 0 2px 0 0;
    vertical-align: bottom;
    cursor: pointer;
}

.board .board_panel .out .comments_list .list_details .comment_details .manner .like > i{
    background: url('../../assets/img/default_like.png') no-repeat;
    background-size: 20px;
}

.board .board_panel .out .comments_list .list_details .comment_details .manner .hate > i{
    background: url('../../assets/img/default_hate.png') no-repeat;
    background-size: 20px;
    vertical-align: middle;
}

.board .board_panel .out .comments_list .list_details .comment_details .manner > div > span{
    margin: 0 10px 0 0;
    color: #999;
}
</style>