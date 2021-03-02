<template>
    <div style='height: 100%'>
        <el-row :gutter="20" style='height: 80%'>
            <el-col :span="8" style='height: 100%'>
                  <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                      <img src="../../assets/img/img.jpg" class="user-avator" alt />
                      <div class="user-info-cont">
                        <div class="user-info-name">{{userName}}</div>
                        <div>{{role}}</div>
                      </div>
                    </div>
                    <div class="user-info-list">
                      上次登录时间：
                      <span>{{lastLoginTime}}</span>
                    </div>
                  </el-card>
                  <div style='height: 80%'>
                    <el-card shadow="hover" style='height: 100%; overflow:auto;'>
                      <Progress></Progress>
                    </el-card>
                  </div>
            </el-col>
            <el-col :span="16" style='height: 100%'>
                <el-row :gutter="20" class="mgb20" >
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">1234</div>
                                    <div>用户访问量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">321</div>
                                    <div>系统消息</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">5000</div>
                                    <div>数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-row style='height: 105%;'>
                  <el-card shadow="hover" style="height: 100%; overflow:auto;">
                    <div slot="header" class="clearfix">
                      <span>待办事项</span>
                      <el-button style="float: right; padding: 3px 5px 0" type="text" @click='handleAdd'>添加</el-button>
                      <el-button style="float: right; padding: 3px 5px 0" type="text" @click='onSubmit'>提交</el-button>
                    </div>
                    <el-form :model='form' ref='form' :rules='rules'>
                      <el-table :show-header="false" :data="form.todoList" style="width:100%;">
                        <el-table-column width="40">
                          <template slot-scope="scope">
                            <el-form-item :prop="'todoList.' + scope.$index + 'status'">
                              <el-checkbox v-model="scope.row.status"></el-checkbox>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column>
                          <template slot-scope="scope">
                            <div v-if='!scope.row.show'
                                class="todo-item"
                                :class="{'todo-item-del': scope.row.status}"
                            >{{scope.row.content}}
                            </div>
                            <el-form-item v-if='scope.row.show' :prop="'todoList.' + scope.$index + '.content'">
                              <el-input v-model='scope.row.content'></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column width="60">
                          <template>
                            <i class="el-icon-delete"></i>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form>
                  </el-card>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Schart from 'vue-schart';
import Progress from '@/components/page/Progress';
import bus from '../common/bus';
export default {
    name: 'dashboard',
    data() {
        return {
            userName: localStorage.getItem('userName'),
            authority: localStorage.getItem('authority'),
            lastLoginTime: localStorage.getItem('lastLoginTime'),
            rules: {
                content: [{required: true, message: '内容不能为空！', trigger: 'blur'}]
            },
            form: {
              todoList: [
                {
                  content: '',
                  status: false,
                  show: false
                }
              ]
            },

        };
    },
    components: {
        Schart,
        Progress
    },
    computed: {
        role() {
            if (this.authority == 0) {
                return '学生'
            }else if (this.authority == 1) {
                return '老师'
            }else {
                return '管理员'
            }
        }
    },
    // created() {
    //     this.handleListener();
    //     this.changeDate();
    // },
    // activated() {
    //     this.handleListener();
    // },
    // deactivated() {
    //     window.removeEventListener('resize', this.renderChart);
    //     bus.$off('collapse', this.handleBus);
    // },
  created() {
      this.getTodoList();
  },
  methods: {
        changeDate() {
            const now = new Date().getTime();
            this.data.forEach((item, index) => {
                const date = new Date(now - (6 - index) * 86400000);
                item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            });
        },
        getTodoList() {
            this.$axios.get('/getTodoList', {
                params: {
                    'userId': localStorage.getItem('userId')
                }
            }).then((responseData) => {
                this.form.todoList = responseData.data.data;
            })
        },
        onSubmit() {
            this.$axios.post('/updateTodoList', this.form.todoList)
                .then(() => {
                    this.getTodoList();
                })
        },
        handleAdd() {
            let obj = {
                userId: localStorage.getItem('userId'),
                content: '',
                status: false,
                show: true
            };
            this.form.todoList.push(obj);
        },
        handleDelete() {

        }
        // handleListener() {
        //     bus.$on('collapse', this.handleBus);
        //     // 调用renderChart方法对图表进行重新渲染
        //     window.addEventListener('resize', this.renderChart);
        // },
        // handleBus(msg) {
        //     setTimeout(() => {
        //         this.renderChart();
        //     }, 200);
        // },
        // renderChart() {
        //     this.$refs.bar.renderChart();
        //     this.$refs.line.renderChart();
        // }
    }
};
</script>


<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 18px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 18px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}
</style>
