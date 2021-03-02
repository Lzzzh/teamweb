<template>
    <div class="login-wrap">
        <div class='login-container'>
            <el-tabs type="border-card" class='card'>
                <el-tab-pane label="登录" class='tab'>
                    <Login></Login>
                </el-tab-pane>
                <el-tab-pane label="注册">
                    <Registry></Registry>
                </el-tab-pane>
            </el-tabs>
        </div>

    </div>
</template>

<script>
import Login from '@/components/page/Login';
import Registry from '@/components/page/Registry';
export default {
    name: 'Index',
    components: { Registry, Login }
};
</script>

<style scoped>

.card{
    position: absolute;
    margin: auto;
    width: 380px;
    height: 300px;
    left: 65%;
    top: 25%;
    border-radius: 4px;
}
.tab{
    border-radius: 3px;
}

</style>
