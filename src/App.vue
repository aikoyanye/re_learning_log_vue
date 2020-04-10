<template>
    <div id="app">
        <el-container>
            <el-header>
                <HelloWorld />
            </el-header>
            <el-main>
                <el-row justify="center" type="flex">
                    <el-col :span='20'>
                        <el-alert title="答应我，别乱来好吗" type="warning"></el-alert>
                        <router-view />
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import HelloWorld from '@/components/HelloWorld.vue'
    export default {
        name: 'home',
        components: {
            HelloWorld,
        }
    }
</script>