<template>
    <div style="margin-top: 20px">
        <el-row :gutter="20" style="margin-bottom: 10px">
            <el-col :span="6"><el-button type="primary" style="width: 100%" @click="backToContents()">返回列表</el-button></el-col>
            <el-col :span="6"><el-button type="success" style="width: 100%" @click="isEdit=false" :disabled="!isEdit">编辑</el-button></el-col>
            <el-col :span="6"><el-button type="info" style="width: 100%" @click="editContent" :disabled="isEdit">修改</el-button></el-col>
            <el-col :span="6"><el-button type="warning" style="width: 100%" @click="delContent">删除文章</el-button></el-col>
        </el-row>
        <el-card :body-style="{ padding: '0px' }" style="margin-bottom: 10px">
            <div style="padding: 14px;">
                <span>{{content.head}}</span>
                <div class="bottom clearfix">
                    <time class="time">Category：{{content.title}} <br><br>Edit：{{content.created}}</time>
                    <span class="button">Author：{{content.username}}</span>
                </div>
            </div>
        </el-card>
        <tinymce-editor :disabled=isEdit :init="init" v-model="content.Value"></tinymce-editor>
    </div>
</template>

<script>
    import tinymce from 'tinymce/tinymce'
    import Editor from '@tinymce/tinymce-vue'
    import h from '../api/ajax.js'
    import router from "../router";
    import {GetCookie, MsgNotify} from "../api/tool.js"
    export default {
        name: 'content',
        data(){
            return{
                value: '',
                isEdit: true,
                content: {
                    Value: '',
                    created: '',
                    head: '',
                    username: '',
                    titleId: '',
                    title: '',
                    ContentId: ''
                },
                cId: {
                    ContentId: ''
                },
                init: {
                    language_url: "js/zh_CN.js",
                    language: "zh_CN",
                    height: 830,
                    plugins:
                        "link lists image code table colorpicker textcolor wordcount contextmenu",
                    toolbar:
                        "bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat",
                    branding: false,
                    images_upload_handler: function (blobInfo, success, failure) {
                        var file = blobInfo.blob();
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onloadend = function () {
                            if (file.size > 1048576) {
                                failure('图片请不要大于 1MB');
                            } else {
                                success(reader.result);
                            }
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
                    _this.isEdit=true;
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
            }
        },
        mounted() {
            let _this = this;
            this.content.head = this.$route.params.head;
            this.cId.ContentId = this.$route.params.contentId;
            this.content.ContentId = this.$route.params.contentId;
            h().post('/content', this.cId).then(function (response) {
                _this.content.username = response.data.Username;
                _this.content.created = response.data.Created;
                _this.content.Value = response.data.Content;
                _this.content.title = response.data.TitleName;
                _this.content.titleId = response.data.TitleId;
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