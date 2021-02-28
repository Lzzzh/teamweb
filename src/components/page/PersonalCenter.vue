<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class='el-icon-user-solid'></i>个人中心
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box">
        <el-form ref='userForm' :model="userForm" :rules='rules' label-width="80px" >
          <el-form-item prop="userPassword" label="修改密码"  style='width: 50%' >
            <el-input v-model.trim="userForm.userPassword" type='password' ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" style='width: 50%' prop="userPasswordConfirm">
            <el-input type='password' v-model.trim='userForm.userPasswordConfirm' ></el-input>
          </el-form-item>
          <el-form-item label="个人电话" style='width: 50%' prop='userTel'>
            <el-input v-model.trim='userForm.userTel'></el-input>
          </el-form-item>
          <el-form-item label="个人邮箱" style='width: 50%' prop='userEmail'>
            <el-input v-model.trim='userForm.userEmail'></el-input>
          </el-form-item>
<!--          <el-form-item label='个人头像'>
            <el-upload
                class="upload-demo"
                drag
                action="http://127.0.0.1/api/userPhoto"
                multiple>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button @click='resetForm'>清空</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%">
      <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;height:300px;"></vue-cropper>
      <span slot="footer" class="dialog-footer">
          <el-button @click="cancelCrop">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VueCropper from 'vue-cropperjs';
export default {
    name: 'PersonalCenter',
    data () {
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.userForm.userPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        defaultSrc: '',
        fileList: [],
        imgSrc: '',
        dialogVisible: false,
        userForm: {
          userId: '',
          userPassword: '',
          userPasswordConfirm: '',
          userTel: '',
          userEmail: '',
          photo: ''
        },
        rules: {
          // userPassword: [{ trigger: 'blur', validator: validatePass}],
          userPasswordConfirm: [{ trigger: 'blur', validator: validatePass2 }]
        }
      };
    },
  components: {
    VueCropper
  },
  methods: {
    onSubmit() {
      this.userForm.userId = localStorage.getItem("userId");
      if (this.userForm.userPassword === this.userForm.userPasswordConfirm) {
        this.$axios.post('/updateUser', this.userForm)
        this.$message.success('提交成功！');
      }else{
        this.$message.error('两次输入的密码不一致！');
        this.$refs.userForm.resetFields();
      }

    },
    resetForm() {
      this.$refs.userForm.resetFields();
      this.$message.success('已清空所有空格');
    },
    setImage(e){
      const file = e.target.files[0];
      if (!file.type.includes('image/')) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        this.dialogVisible = true;
        this.imgSrc = event.target.result;
        this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
      };
      reader.readAsDataURL(file);
    },
    cropImage () {
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
    },
    cancelCrop(){
      this.dialogVisible = false;
      this.cropImg = this.defaultSrc;
    },
    imageuploaded(res) {
      console.log(res)
    },
    handleError(){
      this.$notify.error({
        title: '上传失败',
        message: '图片上传接口上传失败，可更改为自己的服务器接口'
      });
    }
  }

};
</script>

<style scoped>
.content-title{
  font-weight: 400;
  line-height: 50px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}
.pre-img{
  width: 100px;
  height: 100px;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 5px;
}
.crop-demo{
  display: flex;
  align-items: flex-end;
}
.crop-demo-btn{
  position: relative;
  width: 100px;
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  margin-left: 30px;
  background-color: #409eff;
  color: #fff;
  font-size: 14px;
  border-radius: 4px;
  box-sizing: border-box;
}
.crop-input{
  position: absolute;
  width: 100px;
  height: 40px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
</style>