<template>
    <div>
        <el-card style="margin-top: 20px; margin-bottom: 10px">
            <div>
                <h3>您当前在此：{{ this.$route.params.Title }}</h3>
                <el-button @click="toTitle" type="text">点击返回分类列表</el-button>
            </div>
        </el-card>
        <el-row>
            <el-col :span="6" v-for="(content, index) in contents" :key="content" :offset="index % 3 !== 0 ? 3 : 0">
                <el-card :body-style="{ padding: '0px'}" style="margin-bottom: 10px" >
                    <img src="../assets/content.png" class="image">
                    <div style="padding: 14px;">
                        <el-button @click="toContent(content.Id)" type="text">{{content.Head}}</el-button>
                        <div class="bottom clearfix">
                            <time class="time">{{content.Created}}</time>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import h from '../api/ajax.js'
    import {GetCookie, MsgNotify} from "../api/tool.js"
    import router from "../router/index.js"
    export default {
        name: 'contents',
        data(){
            return{
                info: {UserId: '', TitleId: ''},
                contents: [],
            }
        },
        props: ['TitleId', 'Title'],
        methods: {
            toTitle : function () {
                router.push({name: 'title', params: {}})
            }, toContent: function (id) {
                router.push({name: 'content', params: {contentId: id}})
            }
        },
        mounted() {
            let _this = this;
            _this.info.UserId = GetCookie('Id');
            _this.info.TitleId = this.$route.params.TitleId;
            h().post('/contents', _this.info).then(function (response) {
                _this.contents = response.data
            }).catch(function (error) {
                MsgNotify("获取文章列表失败，可能是服务器错误", _this)
            })
        },
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