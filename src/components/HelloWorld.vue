<template>
  <div>
    <el-container>
      <el-header>
        <el-menu :default-active='"1"' mode="horizontal">
          <el-menu-item><a href="/"><img alt="Logo" src="../assets/icon.png"></a></el-menu-item>
          <el-menu-item index="1">1111</el-menu-item>
          <el-menu-item index="2">2222</el-menu-item>
          <el-menu-item index="3">3333</el-menu-item>
          <el-menu-item index="4">4444</el-menu-item>
          <el-menu-item index="5">5555</el-menu-item>
          <el-menu-item index="6">6666</el-menu-item>
          <el-submenu index="7" style="float:right" v-if="isLogin">
            <template slot="title">{{userInfo.Username}}</template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
            <el-menu-item index="2-3">选项3</el-menu-item>
          </el-submenu>
          <div v-else>
            <el-menu-item index="8" style="float:right" @click="showLoginDialog= true">登录</el-menu-item>
            <el-menu-item index="9" style="float:right" @click="showSignUpDialog = true">注册</el-menu-item>
          </div>
        </el-menu>
      </el-header>
      <el-main>

      </el-main>
      <el-footer></el-footer>
    </el-container>
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
  </div>

</template>

<script>
  import h from '../api/ajax.js'
  import {GetCookie} from "../api/tool.js"
  export default {
    data() {
      return {
        isLogin: false,
        showLoginDialog: false,
        showSignUpDialog: false,
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
        // 预编译语句可以防注入
        h().post('/user/login', this.loginForm)
                .then(function (response) {
                  _this.isLogin = true;
                  _this.userInfo = response.data;
                  _this.showLoginDialog = false;
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
      }
    },mounted(){
      if(document.cookie.length > 0){
        this.userInfo.Username = GetCookie("Username");
        this.userInfo.Id = GetCookie("Id");
        this.isLogin = true;
      }
    }
  }
</script>
