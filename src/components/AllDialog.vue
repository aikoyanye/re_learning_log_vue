<template>
    <div>
        <el-dialog
                title="登录"
                :visible.sync="isShow"
                width="30%">
            <el-input v-model="loginForm.loginEmail" label=""  aria-placeholder="邮箱"></el-input>
            <span slot="footer" class="dialog-footer">
    <el-button @click="isShow = false">取消</el-button>
    <el-button type="primary" @click="login"><i class="el-icon-check"></i></el-button>
  </span>
        </el-dialog>
    </div>

</template>

<script>
    export default {
        props:["loginDialog"],
        watch:{
            loginDialog:function () {
                this.isShow = this.loginDialog
            },
            isShow:function () {
                this.$emit("update:loginDialog",this.isShow)
            }
        },
        data() {
            return {
                loginForm:{
                    loginEmail: '',
                },
                isShow :false,
            };
        },
        methods:{
            login(){
                this.isShow = false;
                const userData = {
                    name:"aaa",
                    id:1,
                };
                this.$emit("loginSuccess",userData)
            }
        }
    }
</script>