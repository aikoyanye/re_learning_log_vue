<template>
    <div style="margin-top: 20px">
        <el-row :gutter="20" style="margin-bottom: 10px">
            <el-col :span="6"><el-button type="primary" style="width: 100%" @click="backDir">返回上一级</el-button></el-col>
            <el-col :span="6"><el-button type="success" style="width: 100%" @click="showCreateDirDialog=true">新建文件夹</el-button></el-col>
            <el-col :span="6"><el-button type="info" style="width: 100%" @click="showUploadPanDialog=true">上传文件</el-button></el-col>
            <el-col :span="6"><el-button type="warning" style="width: 100%" @click="deleteFileOrDir">删除所选文件</el-button></el-col>
        </el-row>
        <el-table
                :data="files"
                stripe
                @selection-change="handleSelectionChange"
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
        <el-dialog
                title="新建文件夹"
                :visible.sync="showCreateDirDialog"
                width="30%">
            <el-input
                    type="text"
                    v-model="currentDir.CreateDir">
                <template slot="prepend">文件夹名</template>
            </el-input>
            <span slot="footer" class="dialog-footer">
        <el-button @click="showCreateDirDialog = false">取消</el-button>
        <el-button type="primary" @click="createDir"><i class="el-icon-check"></i></el-button>
  </span>
        </el-dialog>
        <el-dialog
                title="上传文件"
                :visible.sync="showUploadPanDialog"
                width="30%">
            <el-form>
                <el-upload class="upload-box"
                           action="https://aikoyanye.top/api/pan/upload"
                           name="File"
                           accept="*/*"
                           :limit='1'
                           :auto-upload="true"
                           :data="currentDir"
                           :on-success="onUploadSuccess"
                           :before-upload="onBeforeUpload">
                    <el-button slot="trigger"
                               size="small"
                               type="primary">上传文件</el-button>
                    <div slot="tip"
                         class="el-upload__tip">文件大小限制为2M</div>
                </el-upload>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="showUploadPanDialog = false">取消</el-button>
  </span>
        </el-dialog>
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
                currentDir: {CurrentDir: '', CreateDir: '', Selection: []},
                Selection: [],
                rootDir: '',
                showCreateDirDialog: false,
                showUploadPanDialog: false,
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
            },
            createDir: function () {
                if(this.currentDir.CreateDir === ''){
                    MsgNotify('文件夹名不能为空', this);
                    return
                }
                let _this = this;
                h().post('/pan/createDir', this.currentDir).then(function (response) {
                    _this.files = response.data['files'];
                    _this.showCreateDirDialog = false;
                }).catch(function (error) {
                    MsgNotify("创建文件夹失败", _this)
                });
            },
            onUploadSuccess: function () {
                MsgNotify("文件上传成功", this);
                let _this = this;
                h().post('/pan', this.currentDir).then(function (response) {
                    _this.files = response.data['files'];
                }).catch(function (error) {
                    MsgNotify("假盘初始化失败，请稍后再试", _this)
                });
            },
            onBeforeUpload: function (file) {
                if(file.size/1024/1024 > 2){
                    MsgNotify("文件大小超过2M", this);
                    return
                }
            },
            deleteFileOrDir: function () {
                this.currentDir.Selection = [];
                for (let i=0; i<this.Selection.length; i++){
                    this.currentDir.Selection.push(this.Selection[i].FileName)
                }
                let _this = this;
                h().post('/pan/delete', this.currentDir).then(function (response) {
                    MsgNotify("删除文件或文件夹成功", _this);
                    _this.files = response.data['files'];
                }).catch(function (error) {
                    MsgNotify("删除文件或文件夹失败", _this)
                });
            },
            handleSelectionChange: function(val) {
                this.Selection = val;
            }
        },
        mounted() {
            let _this = this;
            this.baseUrl = 'https://aikoyanye.top/pan/';
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