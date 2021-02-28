<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 消息中心</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="message">
                <el-tab-pane :label="`未读消息(${unread.length})`" name="first">
                    <el-table :data="unread" :show-header="false" style="width: 100%">
                        <el-table-column>
                            <template slot-scope="scope">
                                <span class="message-title">{{scope.row.content}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop='senderName'>
                            <template slot-scope='scope'>
                              <span>发件人：{{scope.row.senderName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" width="180"></el-table-column>
                        <el-table-column width="120">
                            <template slot-scope="scope">
                                <el-button size="small" @click="handleRead(scope.$index, scope.row)">标为已读</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="handle-row">
                        <el-button type="primary" @click='handleReadAll'>全部标为已读</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="`已读消息(${read.length})`" name="second">
                    <template v-if="message === 'second'">
                        <el-table :data="read" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title">{{scope.row.content}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="createTime" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger" @click='handleDelAll'>删除全部</el-button>
                        </div>
                    </template>
                </el-tab-pane>
                <el-tab-pane :label="`回收站(${recycle.length})`" name="third">
                    <template v-if="message === 'third'">
                        <el-table :data="recycle" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title">{{scope.row.content}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="createTime" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button @click="handleRestore(scope.$index, scope.row)">还原</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger" @click='handleEmpty'>清空回收站</el-button>
                        </div>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'tabs',
        data() {
            return {
                message: 'first',
                showHeader: false,
                messageStatusForm: {
                    userId: '',
                    createTime: '',
                    status: ''
                },
                unread: [],
                read: [],
                recycle: []
            }
        },
        created() {
            this.getMessageList();
        },
        methods: {
            // 标记为已读
            handleRead(index, row) {
                this.messageStatusForm.userId = localStorage.getItem('userId');
                this.messageStatusForm.createTime = row.createTime;
                this.messageStatusForm.status = 1;
                this.$axios.post('/setMessageStatus', this.messageStatusForm)
                    .then(() => {
                        const item = this.unread.splice(index, 1);
                        console.log(item);
                        this.read = item.concat(this.read);
                    })
            },
            // 全部已读
            handleReadAll() {
                if (this.unread.length !== 0) {
                    this.unread.forEach((form) => {
                      this.messageStatusForm.userId = localStorage.getItem('userId');
                      this.messageStatusForm.createTime = form.createTime;
                      this.messageStatusForm.status = 1;
                      this.$axios.post('/setMessageStatus', this.messageStatusForm)
                    })
                    const item = this.unread.splice(0, this.unread.length);
                    console.log(item);
                    this.read = item.concat(this.read);
                }else {
                  this.$message.error("已经清空了")
                }
            },
            // 删除单条
            handleDel(index, row) {
                this.messageStatusForm.userId = localStorage.getItem('userId');
                this.messageStatusForm.createTime = row.createTime;
                this.messageStatusForm.status = 2;
                this.$axios.post('/setMessageStatus', this.messageStatusForm)
                    .then(() => {
                        const item = this.read.splice(index, 1);
                        this.recycle = item.concat(this.recycle);
                    })
            },
            // 删除全部
            handleDelAll() {
                if (this.read.length !== 0) {
                    this.read.forEach((form) => {
                    this.messageStatusForm.userId = localStorage.getItem('userId');
                    this.messageStatusForm.createTime = form.createTime;
                    this.messageStatusForm.status = 2;
                    this.$axios.post('/setMessageStatus', this.messageStatusForm)
                    })
                    const item = this.read.splice(0, this.read.length);
                    console.log(item);
                    this.recycle = item.concat(this.recycle);
                    this.$message.success("删除成功")
                }else {
                    this.$message.error("已经清空了")
                }

            },
            // 还原
            handleRestore(index, row) {
                this.messageStatusForm.userId = localStorage.getItem('userId');
                this.messageStatusForm.createTime = row.createTime;
                this.messageStatusForm.status = 1;
                this.$axios.post('/setMessageStatus', this.messageStatusForm)
                    .then(() => {
                      const item = this.recycle.splice(index, 1);
                      this.read = item.concat(this.read);
                    })
            },
            // 清空回收站
            handleEmpty() {
                if (this.recycle.length !== 0) {
                    this.recycle.forEach((form) => {
                      this.messageStatusForm.userId = localStorage.getItem('userId');
                      this.messageStatusForm.createTime = form.createTime;
                      this.$axios.post('/deleteMessage', this.messageStatusForm)
                    })
                    const item = this.recycle.splice(0, this.read.recycle);
                    this.$message.success("清空成功")
                }else {
                    this.$message.error("已经清空了")
                }
            },
            getMessageList() {
                this.$axios.get('/getMessageList', {
                    params: {
                      'userId': localStorage.getItem('userId')
                    }
                }).then(responseData => {
                    const arr = responseData.data.data;
                    arr.forEach((item, index) => {
                        const msg = {
                            content: item.content,
                            createTime: item.createTime,
                            senderName: item.senderName
                        }
                        if (item.status === 0) {
                            this.unread.push(msg)
                        } else if (item.status === 1) {
                            this.read.push(msg)
                        } else {
                            this.recycle.push(msg)
                        }
                    })
                })
            }
        },
            computed: {
                unreadNum(){
                    return this.unread.length;
                }
            }
    }

</script>

<style>
.message-title{
    cursor: pointer;
}
.handle-row{
    margin-top: 30px;
}
</style>

