<template>
    <div>
        {{ TitleId }}
    </div>
</template>

<script>
    import h from '../api/ajax.js'
    import {GetCookie, MsgNotify} from "../api/tool.js"
    export default {
        name: 'contents',
        data(){
            return{
                info: {UserId: '', TitleId: ''},
                contents: []
            }
        },
        props: ['TitleId'],
        methods: {

        },
        mounted() {
            let _this = this;
            _this.info.UserId = GetCookie('Id');
            _this.info.TitleId = this.$route.params.TitleId;
            h().post('/content', _this.info).then(function (response) {
                _this.contents = response.data
            }).catch(function (error) {
                MsgNotify("获取文章列表失败，可能是服务器错误", _this)
            })
        }
    }
</script>