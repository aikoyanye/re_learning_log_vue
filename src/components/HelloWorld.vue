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
            <template slot="title">{{userInfo.username}}</template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
            <el-menu-item index="2-3">选项3</el-menu-item>
          </el-submenu>
          <div v-else>
            <el-menu-item index="8" style="float:right" @click="showLoginDialog= true">登录</el-menu-item>
            <el-menu-item index="9" style="float:right">注册</el-menu-item>
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
  </div>

</template>

<script>
  import h from '../api/ajax.js'
  export default {
    data() {
      return {
        isLogin: false,
        showLoginDialog:false,
        userInfo: {
          username:"",
          id:0
        },
        loginForm: {
          Email: '',
          Password: ''
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
      login:function (){
        let _this = this;
        // 预编译语句可以防注入
        h().post('/user/login', this.loginForm)
                .then(function (response) {
                  _this.isLogin = true;
                  _this.userInfo = response.data;
                  alert(response.data['username'])
                }).catch(function (error) {
                  alert(error);
        })
      }
    }
  }

</script>
