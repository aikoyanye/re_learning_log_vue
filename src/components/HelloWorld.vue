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
            <template slot="title">{{userInfo.name}}</template>
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
      <el-footer><el-row type="flex" class="row-bg" justify="center">footer</el-row></el-footer>
    </el-container>
    <AllDialog @loginSuccess="handleLoginSuccess" :loginDialog.sync="showLoginDialog"></AllDialog>
  </div>

</template>

<script>
  import AllDialog from "@/components/AllDialog.vue";
  export default {
    data() {
      return {
        isLogin: false,
        showLoginDialog:false,
        userInfo:{
          name:"",
          id:0
        }
      };
    },
    components:{
      AllDialog
    },
    name: 'HelloWorld',
    props: {
      msg: String,
      username: String,
    },
    methods:{
      handleLoginSuccess:function (userData){
        this.isLogin = true;
        this.userInfo = userData;
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .el-row {
    margin-bottom: 20px;
  &:last-child {
     margin-bottom: 0;
   }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
