<template>
    <div class="ms-login">
        <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
            <el-form-item prop="userid">
                <el-input v-model="param.userid" placeholder="学号">
                    <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item prop="username">
                <el-input v-model="param.username" placeholder="姓名">
                    <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input
                    type="password"
                    placeholder="密码"
                    v-model="param.password"
                    @keyup.enter.native="submitForm()"
                >
                    <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                </el-input>
            </el-form-item>
            <div class="login-btn">
                <el-button type="primary" @click="submitForm()">注册</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'Registry',
    data: function() {
        return {
            param: {
                userid: '',
                username: '',
                password: '',
            },
            rules: {
                userid: [{ required: true, message: '请输入学号', trigger: 'blur'}],
                username: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
            responseResult: [],
        };
    },
    methods: {
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    this.$axios.post('/login', {
                        userId: this.param.username,
                        userPassword: this.param.password
                    }).then(successResponse => {
                        if (successResponse.data.code === 200) {
                            this.$message.success('登录成功');
                            const userName = successResponse.data.data.userName;
                            localStorage.setItem('userName', userName);
                            this.$router.push('/');
                        }else {
                            this.$message.error('登录失败！')
                        }
                    })
                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
}
</script>

<style scoped>
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    /*position: absolute;*/
    /*left: 50%;*/
    /*top: 50%;*/
    width: 350px;
    /*margin: -200px 0 0 -175px;*/
    border-radius: 5px;
    /*background: rgba(255, 255, 255, 0.3);*/
    /*overflow: hidden;*/
}
.ms-content {
    padding: 20px 20px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>
