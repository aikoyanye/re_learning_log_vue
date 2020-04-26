<template>
    <div style="margin-top: 20px">
        <el-card :body-style="{ padding: '0px' }" style="margin-bottom: 10px" v-for="(title, i) in titles">
            <div style="padding: 14px;">
                <el-button @click="toContent(title.Id, title.Title)" type="text" >{{title.Title}}</el-button>
                <div class="bottom clearfix">
                    <time class="time">创建时间：{{title.Created}}</time>
                    <span class="button">创建人：{{title.Username}}</span>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    import h from '../api/ajax.js'
    import {GetCookie, MsgNotify} from "../api/tool.js"
    import router from "../router";
    export default {
        name: 'title',
        data(){
            return{
                user: {Id: ''},
                titles: []
            }
        },
        methods: {
            toContent: function (titleId, title) {
                router.push({name: 'contents', params: {TitleId: titleId, Title: title}})
            }
        },
        mounted() {
            let _this = this;
            _this.user.Id = GetCookie('Id');
            h().post('/title', _this.user).then(function (response) {
                _this.titles = response.data
            }).catch(function (error) {
                MsgNotify("获取分类列表失败，可能是服务器错误", _this)
            })
        }
    }
</script>