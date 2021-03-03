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
          <el-progress  :percentage='item.progress' :color="setColor(item.progress)" >{{item.projectName}}</el-progress>
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
    },
    setColor(progress) {
        if (progress >= 0 && progress <= 30) {
            return '#F56C6C';
        }else if (progress > 30 && progress <= 70) {
            return '#E6A23C';
        }else {
            return '#42b983';
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