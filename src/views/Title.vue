<template>
    <div style="margin-top: 20px">
        <el-card :body-style="{ padding: '0px' }" style="margin-bottom: 10px" v-for="(title, i) in titles">
            <div style="padding: 14px;">
                <div class="bottom clearfix">
                    <el-button @click="toContents(title.Id, title.Title)" type="text">{{title.Title}}</el-button>
                    <el-button class="button" @click="showEditTitle(title.Id, title.Title)" type="text">编辑</el-button>
                </div>
                <div class="bottom clearfix">
                    <time class="time">创建时间：{{title.Created}}</time>
                    <span class="button">创建人：{{title.Username}}</span>
                </div>
            </div>
        </el-card>
        <el-dialog
                title="修改分类"
                :visible.sync="showEditTitleDialog"
                width="30%">
            <el-input type="text" v-model="editTitle.Title">
                <template slot="prepend">Title</template>
            </el-input>
            <span slot="footer" class="dialog-footer">
        <el-button @click="showEditTitleDialog = false">取消</el-button>
        <el-button type="danger" @click="delTitleFunc">删除</el-button>
        <el-button type="primary" @click="editTitleFunc"><i class="el-icon-check"></i></el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import h from '../api/ajax.js'
    import {GetCookie, MsgNotify} from "../api/tool.js"
    import router from "../router";
    export default {
        name: 'title',
        data(){
            return {
                user: {Id: ''},
                titles: [],
                editTitle: {
                    Title: '',
                    TitleId: ''
                },
                showEditTitleDialog: false,
            }
        },
        methods: {
            toContents: function (titleId, title) {
                router.push({name: 'contents', params: {TitleId: titleId, Title: title}})
            },
            showEditTitle: function (titleId, title) {
                this.editTitle.Title = title;
                this.editTitle.TitleId = titleId;
                this.showEditTitleDialog = true;
            },
            editTitleFunc: function () {
                if(this.editTitle.Title === ''){
                    MsgNotify("输入框不能为空", this);
                    return
                }
                let _this = this;
                h().post('/title/edit', _this.editTitle).then(function (response) {
                    _this.showEditTitleDialog = false;
                    MsgNotify("修改分类成功", _this);
                    _this.updateTitleList();
                }).catch(function (error) {
                    MsgNotify("修改分类失败", _this)
                });
            },
            delTitleFunc: function () {
                let _this = this;
                h().post('/title/del', _this.editTitle).then(function (response) {
                    _this.showEditTitleDialog = false;
                    MsgNotify("删除分类成功", _this);
                    _this.updateTitleList();
                }).catch(function (error) {
                    MsgNotify("删除分类成功", _this)
                });
            },
            updateTitleList: function () {
                let _this = this;
                h().post('/title', _this.user).then(function (response) {
                    _this.titles = response.data
                }).catch(function (error) {
                    MsgNotify("获取分类列表失败，可能是服务器错误", _this)
                })
            }
        },
        mounted() {
            this.user.Id = GetCookie('Id');
            this.updateTitleList();
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