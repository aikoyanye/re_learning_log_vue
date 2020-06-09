<template>
    <div style="margin-top: 20px">
        <el-row style="margin-top: 10px" :gutter="24">
            <el-col :span="4">
                <el-select v-model="content.TitleId" placeholder="选择文章想要添加到的分类">
                    <el-option v-for="t in titles" :key="t.Id" :value="t.Id" :label="t.Title"></el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-radio-group v-model="content.Hidden">
                    <el-radio-button label="0">公开</el-radio-button>
                    <el-radio-button label="1">隐藏</el-radio-button>
                </el-radio-group>
            </el-col>
            <el-col :span="16">
                <el-button type="primary" @click="addContent" style="width: 100%"><i class="el-icon-check"></i></el-button>
            </el-col>
        </el-row>
        <el-input
                type="text"
                v-model="content.Head"
        style="margin-top: 10px;width: 100%;margin-bottom: 10px">
            <template slot="prepend">文章标题</template>
        </el-input>
        <tinymce-editor :disabled=isEdit :init="init" v-model="content.Content"></tinymce-editor>
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
        name: 'AddContent',
        components: {
            "tinymce-editor": Editor
        },
        data(){
            return{
                titles: [],
                title: '',
                userId: {UserId: ''},
                content: {
                    Head: '',
                    Content: '',
                    TitleId: '',
                    Hidden: '0'
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
        methods: {
            addContent: function () {
                if(this.content.Content === '' || this.content.Head === '' || this.content.TitleId === ''){
                    MsgNotify("提交的信息不能为空", this);
                    return
                }
                let _this = this;
                h().post('/content/add', this.content).then(function (response) {
                    MsgNotify("上传文章成功", _this);
                    // router.push({name: 'VueHome', params: {}});
                    router.push({name: 'content', params: {contentId: response.data['ContentId']}})
                }).catch(function (error) {
                    MsgNotify("上传文章失败，请稍后再试", _this)
                });
            }
        },
        mounted() {
            let _this = this;
            this.userId.UserId = GetCookie("Id");
            h().post('/title/Alltitles', this.userId).then(function (response) {
                _this.titles = response.data;
            }).catch(function (error) {
                MsgNotify("初始化失败，请稍后再试", _this)
            });
        }
    }
</script>