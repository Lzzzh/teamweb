<template>
  <div>
    <div slot="header" class="clearfix" >
      <span>项目进度预警</span>
    </div>
    <div class='progresslist'>
      <el-row v-for='item in progressData' :gutter='20' class='el-row'>
        <el-col>
          {{item.projectName}}
        </el-col>
        <el-col>
          <el-progress  :percentage='item.progress' color="#42b983" >{{item.projectName}}</el-progress>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Progress',
  data() {
    return {
        progressData: []
    }
  },
  created() {
    this.getProgress()
  },
  methods: {
    getProgress() {
      const authority = localStorage.getItem('authority')
      const userId = localStorage.getItem('userId')
      if (authority == 0) {
        this.$axios.get('/studentProgress', {
          params: {
            'userId': userId
          }
        }).then((responseData) => {
          this.progressData = responseData.data.data;
        })
      }else if (authority == 1) {
        this.$axios.get('/teacherProgress', {
          params: {
            'userId': userId
          }
        }).then((responseData) => {
          this.progressData = responseData.data.data;
        })
      }
    }
  }
};
</script>

<style scoped>

.el-row {
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap
}
.clearfix{
  margin-bottom: 20px;
  flex-wrap: wrap;
}
</style>