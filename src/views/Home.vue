<template>
  <div class="VueHome">
    <el-card :body-style="{ padding: '0px' }" style="margin-top: 20px">
      <img src="../assets/bg.png" class="image">
      <div style="padding: 14px;">
        <h2>{{ notice.content }}</h2>
      </div>
    </el-card>
    <el-card style="margin-top: 20px; margin-bottom: 10px">
      <div>
        <h3>历史更新公布</h3>
      </div>
    </el-card>
    <el-card :body-style="{ padding: '0px' }" style="margin-bottom: 10px" v-for="(u, i) in ulist">
      <div style="padding: 14px;">
        <span>{{u.Content}}</span>
        <div class="bottom clearfix">
          <time class="time">{{u.Created}}</time>
          <span class="button">{{u.Version}}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import h from '../api/ajax.js'
  import store from '../store/index.js'
  export default {
    data(){
      return{
        notice: store.state.notice,
        ulist: store.state.ulist
      }
    },
    name: 'VueHome',
    components: {
    },
    methods: {
    },
    mounted() {
      let _this = this;
      h().post('/home', ).then(function (response) {
        _this.notice.content = response.data.Notice.Content;
        _this.ulist = response.data.UList;
        store.state.ulist = _this.ulist;
      }).catch(function (error) {
      })
    }
  }
</script>

<style>
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>