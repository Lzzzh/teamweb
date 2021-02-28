<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 发送消息
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class='container'>
      <div class='form-box'>
        <el-form ref='messageForm' :model='messageForm' label-width='80px' :rules='rules'>
          <el-form-item label='消息内容' prop='content'>
            <el-input type="textarea" v-model='messageForm.content'></el-input>
          </el-form-item>
          <el-form-item label="收件人" prop='receiverList'>
            <el-cascader
                :props="{ checkStrictly: false, multiple:true}" clearable :options="userList" :show-all-levels="false"  filterable v-model="messageForm.receiverList"></el-cascader>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="sendMessage">发送</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SendMessage',
  data() {
    return {
      messageForm: {
        senderId: '',
        content: '',
        receiverList: []
      },
      userList: [],
      rules: {
        content: [{ required: true, message: "消息内容不能为空！", trigger: 'blur'}],
        receiverList: [{ required: true, message: "收件人不能为空！", trigger: 'blur'}]
      }
    }
  },
  created() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      this.$axios.get('/getUserList', )
          .then(responseData => {
              const userId = localStorage.getItem('userId');
              const userList = responseData.data.data;
              userList.forEach((item => {
                  const children = item.children;
                  children.forEach((map) => {
                      if (map.value === userId) {
                          const index = children.valueOf(map);
                          children.splice(index, 1);
                      }
                      })
              }))
              this.userList = userList;
      })
    },
    sendMessage(){
      if (this.messageForm.receiverList.length !== 0) {
        this.messageForm.senderId = localStorage.getItem('userId');
        this.$axios.post('/sendMessage', this.messageForm)
            .then(() => {
          this.$refs.messageForm.resetFields();
        });
      }else {
        this.$message.error("收件人不能为空！");
      }
    },
    resetForm() {

    },
  }
};
</script>

<style scoped>

</style>