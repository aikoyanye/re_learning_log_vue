<template>
  <div>
    <el-menu :default-active='"1"' mode="horizontal">
      <el-menu-item><a href="/"><img alt="Logo" src="../assets/icon.png"></a></el-menu-item>
      <el-menu-item index="1" @click="toHome">首页</el-menu-item>
      <el-menu-item index="2">分类</el-menu-item>
      <el-menu-item index="3" v-if="isLogin">3333</el-menu-item>
      <el-menu-item index="4" v-if="isLogin">4444</el-menu-item>
      <el-menu-item index="5" v-if="isLogin">5555</el-menu-item>
      <el-menu-item index="6" v-if="isLogin">6666</el-menu-item>
      <el-submenu index="7" style="float:right" v-if="isLogin">
        <template slot="title">{{userInfo.Username}}</template>
        <el-menu-item index="2-1" @click="logout">注销</el-menu-item>
        <el-menu-item index="2-2" @click="showNoticeDialog = true">更新公告</el-menu-item>
        <el-menu-item index="2-3">选项3</el-menu-item>
      </el-submenu>
      <div v-else>
        <el-menu-item index="8" style="float:right" @click="showLoginDialog = true">登录</el-menu-item>
        <el-menu-item index="9" style="float:right" @click="showSignUpDialog = true">注册</el-menu-item>
      </div>
    </el-menu>
    <el-dialog
            title="登录"
            :visible.sync="showLoginDialog"
            width="30%">
      <el-input v-model="loginForm.Email" placeholder="" minlength="1">
        <template slot="prepend">登录邮箱</template>
      </el-input>
      <div style="margin: 20px;"></div>
      <el-input v-model="loginForm.Password" placeholder="" type="password" minlength="1">
        <template slot="prepend">登录密码</template>
      </el-input>
      <span slot="footer" class="dialog-footer">
    <el-button @click="showLoginDialog = false">取消</el-button>
    <el-button type="primary" @click="login"><i class="el-icon-check"></i></el-button>
  </span>
    </el-dialog>
    <el-dialog
            title="注册"
            :visible.sync="showSignUpDialog"
            width="30%">
      <el-input v-model="signupForm.Email" placeholder="" minlength="1">
        <template slot="prepend">注册邮箱</template>
      </el-input>
      <div style="margin: 20px;"></div>
      <el-input v-model="signupForm.Username" placeholder="" minlength="1">
        <template slot="prepend">用户名</template>
      </el-input>
      <div style="margin: 20px;"></div>
      <el-input v-model="signupForm.OPassword" placeholder="" type="password" minlength="1">
        <template slot="prepend">登录密码</template>
      </el-input>
      <div style="margin: 20px;"></div>
      <el-input v-model="signupForm.Password" placeholder="" type="password" minlength="1">
        <template slot="prepend">重复密码</template>
      </el-input>
      <span slot="footer" class="dialog-footer">
    <el-button @click="showSignUpDialog = false">取消</el-button>
    <el-button type="primary" @click="signup"><i class="el-icon-check"></i></el-button>
  </span>
    </el-dialog>
    <el-dialog
            title="更细公告"
            :visible.sync="showNoticeDialog"
            width="30%">
      <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="notice.content">
      </el-input>
      <span slot="footer" class="dialog-footer">
    <el-button @click="showNoticeDialog = false">取消</el-button>
    <el-button type="primary" @click="addNotice"><i class="el-icon-check"></i></el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import h from '../api/ajax.js'
  import {GetCookie, MsgNotify} from "../api/tool.js"
  import router from "../router/index.js"
  export default {
    data() {
      return {
        isLogin: false,
        showLoginDialog: false,
        showSignUpDialog: false,
        showNoticeDialog: false,
        userInfo: {
          Username:"",
          Id:0
        },loginForm: {
          Email: '',
          Password: ''
        }, signupForm: {
          Email: '',
          OPassword: '',
          Password: '',
          Username: ''
        }, notice: {
          content: '',
        }
      };
    },
    components:{

    },
    name: 'HelloWorld',
    props: {
      msg: String,
      username: String,
    },
    methods:{
      login: function (){
        let _this = this;
        h().post('/user/login', this.loginForm)
                .then(function (response) {
                  _this.isLogin = true;
                  _this.userInfo = response.data;
                  _this.showLoginDialog = false;
                  MsgNotify("欢迎回来，" + _this.userInfo.Username, _this)
                }).catch(function (error) {
          alert(error);
        })
      }, signup: function () {
        if(this.signupForm.OPassword == this.signupForm.Password){
          let _this = this;
          h().post('/user/signup', this.signupForm)
                  .then(function (response) {
                    _this.showSignUpDialog = false;
                    alert("注册成功，现在你可以登录了");
                  }).catch(function (error) {
            alert(error);
          })
        }else{
          alert("两次密码输入不正确");
        }
      }, logout: function () {
        h().post('/user/logout', )
                .then(function (response) {
                  location.reload();
                }).catch(function (error) {
          alert(error);
        })
      }, toHome: function () {
        router.push({name: '', params: {}});
      }, addNotice: function () {
        let _this = this;
        h().post('/home/notice', this.notice)
                .then(function (response) {
                  MsgNotify("更新公告成功", _this);
                  _this.showNoticeDialog = false;
                  router.push({name: '', params: {}});
                }).catch(function (error) {
                  alert(error);
        })
      }
    },mounted(){
      let username = GetCookie("Username");
      if(username !== null && username !== "" && username !== "null" && typeof(username) !== "undefined"
              && username !== false && username !== undefined){
        this.userInfo.Username = GetCookie("Username");
        this.userInfo.Id = GetCookie("Id");
        this.isLogin = true;
      }
    }
  }
</script>
