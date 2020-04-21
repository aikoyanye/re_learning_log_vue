<template>
    <div style="margin-top: 20px">
        <el-card :body-style="{ padding: '0px' }" style="margin-bottom: 10px" v-for="(title, i) in titles">
            <div style="padding: 14px;">
                <span>{{title.Title}}</span>
                <div class="bottom clearfix">
                    <time class="time">{{title.Created}}</time>
                    <span class="button">{{title.Username}}</span>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    import h from '../api/ajax.js'
    import {GetCookie, MsgNotify, CheckDictNil} from "../api/tool.js"
    export default {
        name: 'title',
        data(){
            return{
                user: {Id: ''},
                titles: []
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