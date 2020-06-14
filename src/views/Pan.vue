<template>
    <div style="margin-top: 20px">
        <el-row :gutter="20" style="margin-bottom: 10px">
            <el-col :span="6"><el-button type="primary" style="width: 100%" @click="backDir">返回上一级</el-button></el-col>
            <el-col :span="6"><el-button type="success" style="width: 100%" @click="">222</el-button></el-col>
            <el-col :span="6"><el-button type="info" style="width: 100%" @click="">333</el-button></el-col>
            <el-col :span="6"><el-button type="warning" style="width: 100%" @click="">444</el-button></el-col>
        </el-row>
        <el-table
                :data="files"
                stripe
                style="width: 100%">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    label="文件名"
                    width="180">
                <template slot-scope="scope">
                    <el-button type="text" @click="toDir(scope.row.FileName)" v-if="scope.row.FileSize === '文件夹'">{{ scope.row.FileName }}</el-button>
                    <el-button type="text" @click="download(scope.row.FileName)" v-else>{{ scope.row.FileName }}</el-button>
                </template>
            </el-table-column>
            <el-table-column
                    prop="FileSize"
                    label="大小"
                    width="180">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import h from '../api/ajax.js'
    import router from "../router";
    import {GetCookie, MsgNotify, CheckDictNil} from "../api/tool.js"
    export default {
        name: 'pan',
        data(){
            return{
                userId: {Id: ''},
                files: [],
                baseUrl: '',
                currentDir: {CurrentDir: ''},
                rootDir: '',
            }
        },
        methods: {
            download: function (fileName) {
                window.location.href = this.baseUrl + this.currentDir.CurrentDir + fileName;
            },
            toDir: function (dirName) {
                this.currentDir.CurrentDir += '/' + dirName + '/';
                let _this = this;
                h().post('/pan', this.currentDir).then(function (response) {
                    _this.files = response.data['files'];
                }).catch(function (error) {
                    MsgNotify("假盘文件夹获取失败，请稍后再试", _this)
                });
            },
            backDir: function () {
                if(this.currentDir.CurrentDir === this.rootDir){
                    MsgNotify("当前已经是根目录了", this);
                    return
                }
                let dirs = this.currentDir.CurrentDir.split("/");
                dirs.pop();
                dirs.pop();
                this.currentDir.CurrentDir = dirs.join("/");
                let _this = this;
                h().post('/pan', this.currentDir).then(function (response) {
                    _this.files = response.data['files'];
                }).catch(function (error) {
                    MsgNotify("假盘初始化失败，请稍后再试", _this)
                });
            }
        },
        mounted() {
            let _this = this;
            this.baseUrl = 'http://127.0.0.1:8001/pan/';
            this.currentDir.CurrentDir = GetCookie("Id") + '/';
            this.rootDir = this.currentDir.CurrentDir;
            h().post('/pan', this.currentDir).then(function (response) {
                _this.files = response.data['files'];
            }).catch(function (error) {
                MsgNotify("假盘初始化失败，请稍后再试", _this)
            });
        }
    }
</script>