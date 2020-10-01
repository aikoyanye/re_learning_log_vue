<template>
  <div>
    <el-menu :default-active='"1"' mode="horizontal">
      <el-menu-item><a href="/"><img alt="Logo" src="../assets/icon.png"></a></el-menu-item>
      <el-menu-item index="1" @click="toHome">首页</el-menu-item>
      <el-menu-item index="2" @click="toTitle">分类</el-menu-item>
      <el-menu-item index="3" @click="showAddTitleDialog = true" v-if="isLogin">添加分类</el-menu-item>
      <el-menu-item index="4" @click="toAddContent" v-if="isLogin">添加文章</el-menu-item>
      <el-menu-item index="5" @click="toPan" v-if="isLogin">假盘</el-menu-item>
      <el-submenu index="7" style="float:right" v-if="isLogin">
        <template slot="title">{{userInfo.Username}}</template>
        <el-menu-item index="2-1" @click="logout">注销</el-menu-item>
        <el-menu-item index="2-5" @click="showChangeUserInfoDialog = true">修改信息</el-menu-item>
        <el-menu-item index="2-2" @click="showNoticeDialog = true" v-if="userInfo.Type == 'admin'">更新公告</el-menu-item>
        <el-menu-item index="2-3" @click="showUpdateDialog = true" v-if="userInfo.Type == 'admin'">添加更新事件</el-menu-item>
        <el-menu-item index="2-4" @click="showChangeBgImgDialog = true" v-if="userInfo.Type == 'admin'">更换首页图片</el-menu-item>
        <el-menu-item index="2-6" @click="showBanIpDialog = true" v-if="userInfo.Type == 'admin'">添加BanIp</el-menu-item>
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
              v-model="local_notice.content">
      </el-input>
      <span slot="footer" class="dialog-footer">
    <el-button @click="showNoticeDialog = false">取消</el-button>
    <el-button type="primary" @click="addNotice"><i class="el-icon-check"></i></el-button>
  </span>
    </el-dialog>
    <el-dialog
            title="添加更新事件"
            :visible.sync="showUpdateDialog"
            width="30%">
      <el-input
              type="text"
              placeholder="请输入版本：vx.xx"
              v-model="updateList.version">
        <template slot="prepend">版本号</template>
      </el-input>
      <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="updateList.content"
              style="margin-top: 20px">
      </el-input>
      <span slot="footer" class="dialog-footer">
    <el-button @click="showUpdateDialog = false">取消</el-button>
    <el-button type="primary" @click="addUpdate"><i class="el-icon-check"></i></el-button>
  </span>
    </el-dialog>
    <el-dialog
            title="更换首页图片"
            :visible.sync="showChangeBgImgDialog"
            width="30%">
      <el-form>
        <el-upload class="upload-box"
                   action="http://127.0.0.1:8001/home/bg"
                   name="BgImg"
                   accept="image/png"
                   :limit='1'
                   :auto-upload="true"
                   :on-success="changeBgImgOnSuccess">
          <el-button slot="trigger"
                     size="small"
                     type="primary">上传png首页图片</el-button>
          <div slot="tip"
               class="el-upload__tip">仅支持png格式图片，宽度建议：226px、高度建议：1649px</div>
        </el-upload>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="showChangeBgImgDialog = false">取消</el-button>
  </span>
    </el-dialog>
    <el-dialog
            title="修改用户信息"
            :visible.sync="showChangeUserInfoDialog"
            width="30%">
      <el-input
              type="text"
              v-model="changeUserInfo.Username">
        <template slot="prepend">用户名</template>
      </el-input>
      <el-input
              type="password"
              v-model="changeUserInfo.OPassword"
              style="margin-top: 20px">
        <template slot="prepend">旧密码</template>
      </el-input>
      <el-input
              type="password"
              v-model="changeUserInfo.NPassword"
              style="margin-top: 20px">
        <template slot="prepend">新密码</template>
      </el-input>
      <el-input
              type="password"
              v-model="changeUserInfo.ANPassword"
              style="margin-top: 20px">
        <template slot="prepend">重复密码</template>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showChangeUserInfoDialog = false">取消</el-button>
        <el-button type="primary" @click="changeUserInfoFunc"><i class="el-icon-check"></i></el-button>
  </span>
    </el-dialog>
    <el-dialog
            title="添加BanIp"
            :visible.sync="showBanIpDialog"
            width="30%">
      <el-input
              type="text"
              v-model="banIp.BanIp">
        <template slot="prepend">BanIp</template>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showBanIpDialog = false">取消</el-button>
        <el-button type="primary" @click="addBanIp"><i class="el-icon-check"></i></el-button>
  </span>
    </el-dialog>
    <el-dialog
            title="添加分类"
            :visible.sync="showAddTitleDialog"
            width="30%">
      <el-input
              type="text"
              v-model="title.Title">
        <template slot="prepend">Title</template>
      </el-input>
      <el-radio-group v-model="title.Hidden" style="margin-top: 10px">
        <el-radio-button label="0">公开</el-radio-button>
        <el-radio-button label="1">隐藏</el-radio-button>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddTitleDialog = false">取消</el-button>
        <el-button type="primary" @click="addTitle"><i class="el-icon-check"></i></el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import h from '../api/ajax.js'
  import {GetCookie, MsgNotify, CheckDictNil} from "../api/tool.js"
  import router from "../router/index.js"
  import store from '../store/index.js'
  export default {
    data() {
      return {
        ulist: store.state.ulist,
        isLogin: false,
        showLoginDialog: false,
        showSignUpDialog: false,
        showNoticeDialog: false,
        showUpdateDialog: false,
        showChangeBgImgDialog: false,
        showChangeUserInfoDialog: false,
        showBanIpDialog: false,
        showAddTitleDialog: false,
        banIp: {BanIp: ''},
        title: {Title: '', Hidden: '0', UserId: ''},
        titles: [],
        userInfo: {
          Username: '',
          Id: 0,
          Type: ''
        },loginForm: {
          Email: '',
          Password: ''
        }, signupForm: {
          Email: '',
          OPassword: '',
          Password: '',
          Username: ''
        },
        notice: store.state.notice,
        local_notice: {
          content: '',
        }, updateList: {
          version: '',
          content: ''
        }, changeUserInfo: {
          Id: '',
          Username: '',
          OPassword: '',
          NPassword: '',
          ANPassword: '',
          CSRF: ''
        }
      };
    },
    name: 'HelloWorld',
    props: {
      msg: String,
      username: String,
    },
    methods:{
      login: function (){
        if(CheckDictNil(this.loginForm)){
          MsgNotify("输入框内容不允许为空", this);
          return
        }
        let _this = this;
        h().post('/user/login', this.loginForm)
                .then(function (response) {
                  _this.isLogin = true;
                  _this.userInfo = response.data;
                  _this.showLoginDialog = false;
                  _this.changeUserInfo.Username = _this.userInfo.Username;
                  _this.changeUserInfo.Id = _this.userInfo.Id;
                  MsgNotify("欢迎回来，" + _this.userInfo.Username, _this);
                  router.push({name: 'VueHome', params: {}});
                }).catch(function (error) {
                  MsgNotify("登录失败，不知道为啥，可能是密码错误:" + error, _this);
        })
      }, signup: function () {
        if(CheckDictNil(this.signupForm)){
          MsgNotify("输入框内容不允许为空", this);
          return
        }
        if(this.signupForm.OPassword == this.signupForm.Password){
          let _this = this;
          h().post('/user/signup', this.signupForm)
                  .then(function (response) {
                    _this.showSignUpDialog = false;
                    MsgNotify("注册成功，现在你可以登录了", _this);
                  }).catch(function (error) {
          })
        }else{
          alert("两次密码输入不正确");
        }
      }, logout: function () {
        let _this = this;
        h().post('/user/logout', )
                .then(function (response) {
                  MsgNotify("您已注销", _this);
                  router.push({name: 'VueHome', params: {}});
                  location.reload();
                }).catch(function (error) {
        })
      }, toHome: function () {
        router.push({name: 'VueHome', params: {}});
      }, toTitle: function () {
        router.push({name: 'title', params: {}});
      },addNotice: function () {
        if(CheckDictNil(this.local_notice)){
          MsgNotify("输入框内容不允许为空", this);
          return
        }
        let _this = this;
        h().post('/home/notice', this.local_notice)
                .then(function (response) {
                  MsgNotify("更新公告成功", _this);
                  _this.showNoticeDialog = false;
                  store.state.notice.content = _this.local_notice.content
                }).catch(function (error) {
        });
      }, addUpdate: function () {
        if(CheckDictNil(this.updateList)){
          MsgNotify("输入框内容不允许为空", this);
          return
        }
        let _this = this;
        h().post('/home/ulist', this.updateList)
                .then(function (response) {
                  MsgNotify("添加更新事件成功", _this);
                  _this.showUpdateDialog = false;
                  store.state.ulist.unshift(response.data['ulist'][0]);
                }).catch(function (error) {
        });
      }, changeBgImgOnSuccess: function () {
        this.showChangeBgImgDialog = false;
        MsgNotify('更新首页图片成功，刷新生效', this)
      }, changeUserInfoFunc: function () {
        this.changeUserInfo.CSRF = GetCookie('_CSRF');
        if(CheckDictNil(this.changeUserInfo)){
          MsgNotify("输入框内容不允许为空", this);
          return
        }
        if(this.changeUserInfo.NPassword !== this.changeUserInfo.ANPassword){
          MsgNotify("两次密码不一致", this);
          return
        }
        let _this = this;
        h().post("/user/changeInfo", this.changeUserInfo)
                .then(function (response) {
                  _this.showChangeUserInfoDialog = false;
                  _this.userInfo.Username = _this.changeUserInfo.Username;
                  MsgNotify("修改信息成功", _this);
                }).catch(function (error) {
                  MsgNotify("修改信息失败，稍后重试", _this);
        })
      }, addBanIp: function () {
        let _this = this;
        if(CheckDictNil(this.BanIp)){
          MsgNotify("输入框内容不允许为空", this);
          return
        }
        h().post("/banip", this.banIp)
                .then(function (response) {
                  _this.showBanIpDialog = false;
                  MsgNotify("添加成功", _this);
                }).catch(function (error) {
                  MsgNotify("添加失败", _this);
        })
      }, addTitle: function () {
        this.title.UserId = GetCookie("Id");
        if(CheckDictNil(this.title)) {
          MsgNotify("信息不能为空", this);
          return
        }
        let _this = this;
        h().post("/title/add", this.title)
                .then(function (response) {
                  _this.showAddTitleDialog = false;
                  MsgNotify("添加分类成功，请重新进入分类页面", _this);
                }).catch(function (error) {
                  MsgNotify("添加分类失败", _this);
        })
      }, toAddContent: function () {
        router.push({name: 'addContent', params: {}});
      }, toPan: function () {
        router.push({name: 'pan', params: {}});
      }
    },mounted(){
      let username = GetCookie("Username");
      if(username !== null && username !== "" && username !== "null" && typeof(username) !== "undefined"
              && username !== false && username !== undefined){
        this.userInfo.Username = GetCookie("Username");
        this.userInfo.Id = GetCookie("Id");
        this.userInfo.Type = GetCookie("Type");
        this.changeUserInfo.Username = this.userInfo.Username;
        this.changeUserInfo.Id = this.userInfo.Id;
        this.isLogin = true;
      }
    }
  }
</script>
