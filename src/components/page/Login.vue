<template>
  <div class="login-wrap">
    <div class='login-container'>
      <div class="ms-login">
          <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
              <el-form-item prop="userid">
                  <el-input v-model="param.userid" placeholder="用户名">
                      <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                  </el-input>
              </el-form-item>
              <el-form-item prop="password">
                  <el-input
                      type="password"
                      placeholder="密码"
                      v-model="param.password"
                      @keyup.enter.native="submitForm()">
                      <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                  </el-input>
              </el-form-item>
              <div class="login-btn">
                  <el-button type="primary" @click="submitForm()">登录</el-button>
              </div>
          </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations} from "vuex";
import {Encrypt} from "@/utils/secret"
export default {
    data: function() {
        return {
            param: {
                userid: '',
                password: '',
            },
            rules: {
                userid: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
            responseResult: [],
            userToken: ''
        };
    },
    methods: {
        ...mapMutations(['changeLogin']),
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    this.$axios.post('/login', {
                        userId: this.param.userid,
                        userPassword: Encrypt(this.param.password)
                    }).then(successResponse => {
                        if (successResponse.data.code === 200) {
                            const data = successResponse.data.data;
                            localStorage.setItem('userName', data.userName);
                            localStorage.setItem('authority', data.authority)
                            localStorage.setItem('userId', data.userId);
                            localStorage.setItem('lastLoginTime', data.lastLoginTime);
                            this.userToken = data.token;
                            this.changeLogin({ Authorization: this.userToken });
                            this.$router.push('/');
                            this.$message.success('登录成功');
                        }else {
                            this.$message.error('用户名或密码错误')
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

.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/img/login-bg.jpg);
  background-size: 100%;
}
.login-container{
  margin: auto;
  height: 100%;
}

.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -200px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
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
