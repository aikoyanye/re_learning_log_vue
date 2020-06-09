<template>
    <div style="margin-top: 20px">
        <el-row :gutter="20" style="margin-bottom: 10px">
            <el-col :span="6"><el-button type="primary" style="width: 100%" @click="backToContents">返回列表</el-button></el-col>
            <el-col :span="6"><el-button type="success" style="width: 100%" @click="gotoEdit" :disabled="canEdit">编辑</el-button></el-col>
            <el-col :span="6"><el-button type="info" style="width: 100%" @click="editContent" :disabled="isEdit">修改</el-button></el-col>
            <el-col :span="6"><el-button type="warning" style="width: 100%" @click="delContent">删除文章</el-button></el-col>
        </el-row>
        <el-card :body-style="{ padding: '0px' }" style="margin-bottom: 10px">
            <div style="padding: 14px;">
                <div id="head_div">
                    <span v-show="!showHeadEdit">{{content.Head}}</span>
                    <el-input v-model="content.Head" style="width: 100%" v-show="showHeadEdit"></el-input>
                </div>
                <div class="bottom clearfix">
                    <time class="time">Category：{{content.title}} <br><br>Edit：{{content.created}}</time>
                    <span class="button">Author：{{content.username}}</span>
                </div>
            </div>
        </el-card>
        <tinymce-editor :disabled=isEdit :init="init" v-model="content.Value"></tinymce-editor>
        <el-input placeholder="请输入电子邮箱" v-model="comment.Email" style="margin-top: 20px">
            <template slot="prepend">Email:</template>
        </el-input>
        <el-input
                style="margin-top: 10px"
                type="textarea"
                :rows="2"
                placeholder="请输入评论"
                v-model="comment.Comment">
        </el-input>
        <el-button type="primary" style="margin-top: 10px; width: 100%; margin-bottom: 10px" icon="el-icon-check" @click="commitComment"></el-button>
        <el-card :body-style="{ padding: '0px' }" style="margin-bottom: 10px" v-for="(c, i) in comments">
            <div style="padding: 14px;">
                <span>{{c.Comment}}</span>
                <div class="bottom clearfix">
                    <time class="time">{{c.Created}}</time>
                    <span class="button">{{c.Email}}</span>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    import tinymce from 'tinymce/tinymce'
    import axios from 'axios'
    import Editor from '@tinymce/tinymce-vue'
    import h from '../api/ajax.js'
    import router from "../router";
    import {GetCookie, MsgNotify, CheckDictNil} from "../api/tool.js"
    export default {
        name: 'content',
        data(){
            return{
                showHeadEdit: false,
                comments: [],
                value: '',
                isEdit: true,
                canEdit: true,
                comment: {
                    Email: '',
                    Comment: '',
                    ContentId: ''
                },
                content: {
                    Value: '',
                    created: '',
                    Head: '',
                    username: '',
                    titleId: '',
                    title: '',
                    ContentId: '',
                    UserId: '',
                },
                cId: {
                    ContentId: ''
                },
                init: {
                    language_url: "/js/zh_CN.js",
                    language: "zh_CN",
                    height: 830,
                    plugins:
                        "link lists image code table colorpicker textcolor wordcount contextmenu",
                    toolbar:
                        "bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat",
                    branding: false,
                    images_upload_handler: function (blobInfo, success, failure) {
                        let file = blobInfo.blob();
                        if (file.size > 1048576) {
                            failure('图片请不要大于 亿MB');
                        } else {
                            let data = new FormData();
                            data.append("File", file, "FileName");
                            data.append("Username", GetCookie("Username"));
                            axios.post('http://127.0.0.1:8001/content/uploadPic', data).then(function (response) {
                                alert("图片上传成功");
                                success(response.data['pic']);
                            }).catch(function (error) {
                                failure('图片上传失败');
                            });
                        }
                    }
                }
            }
        },
        components: {
            "tinymce-editor": Editor
        },
        props: ['contentId', 'head'],
        methods: {
            backToContents: function () {
                router.push({name: 'contents', params: {TitleId: this.content.titleId, Title: this.content.title}})
            },
            editContent: function () {
                let _this = this;
                h().post('/content/edit', this.content).then(function (response) {
                    MsgNotify("文章修改成功", _this);
                    _this.isEdit = true;
                    _this.canEdit = false;
                    _this.showHeadEdit = false;
                    _this.content.created = response.data.Created;
                }).catch(function (error) {
                    MsgNotify("更新文章失败，可能是服务器错误", _this)
                });
            },
            delContent: function () {
                let _this = this;
                h().post('/content/del', this.cId).then(function (response) {
                    MsgNotify("删除文章成功，返回上一页", _this);
                    _this.backToContents();
                }).catch(function (error) {
                    MsgNotify("删除文章失败，可能是服务器错误", _this)
                });
            },
            commitComment: function () {
                this.comment.ContentId = this.content.ContentId;
                if(CheckDictNil(this.comment)){
                    MsgNotify("邮箱地址或评论内容不能为空")
                }
                let _this = this;
                h().post('/comment/add', this.comment).then(function (response) {
                    MsgNotify("评论成功", _this);
                    _this.comments.unshift(response.data);
                    _this.comment.Comment = '';
                    _this.comment.Email = '';
                }).catch(function (error) {
                    MsgNotify("评论失败，请稍后再试", _this)
                });
            },
            gotoEdit: function () {
                this.isEdit = false;
                this.canEdit = true;
                this.showHeadEdit = true;
            },
        },
        mounted() {
            let _this = this;
            this.cId.ContentId = this.$route.params.contentId;
            this.content.ContentId = this.$route.params.contentId;
            h().post('/content', this.cId).then(function (response) {
                _this.content.username = response.data['content'].Username;
                _this.content.created = response.data['content'].Created;
                _this.content.Value = response.data['content'].Content;
                _this.content.title = response.data['content'].TitleName;
                _this.content.titleId = response.data['content'].TitleId;
                _this.content.UserId = response.data['content'].UserId;
                _this.comments = response.data['comments'];
                _this.content.Head = response.data['content'].Head;
                if(GetCookie('Id') === _this.content.UserId){
                    _this.canEdit = false;
                }
            }).catch(function (error) {
                MsgNotify("获取文章失败，可能是服务器错误", _this)
            });
        }
    }
</script>

<style>
    .time {
        font-size: 13px;
        color: #999;
    }
    .button {
        padding: 0;
        float: right;
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