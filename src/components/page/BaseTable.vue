<template >
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 项目列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container" >
            <div class="handle-box">
<!--                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>-->
                <el-input v-model.trim="query.projectName" placeholder="项目名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button icon='el-icon-plus' v-if='query.show' @click='addVisible = true'>新增项目</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"

                @selection-change="handleSelectionChange">

                <el-table-column type="selection" width="55" align="center"></el-table-column>
<!--                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>-->
                <el-table-column prop="projectId" label="项目ID" align="center"></el-table-column>
                <el-table-column prop="projectName" label="项目名称" align="center"></el-table-column>
<!--                <el-table-column label="头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.thumb"
                            :preview-src-list="[scope.row.thumb]"
                        ></el-image>
                    </template>
                </el-table-column>-->
                <el-table-column prop="teacherName" label="指导老师" align="center"></el-table-column>
                <el-table-column prop="progress" label="项目进度 (百分比)" align="center">
<!--                    <template slot-scope="scope">-->
<!--                        <el-tag-->
<!--                            :type="scope.row.state==='成功'?'success':(scope.row.state==='失败'?'danger':'')"-->
<!--                        >{{scope.row.state}}</el-tag>-->
<!--                    </template>-->
                </el-table-column>

                <el-table-column prop="createTime" label="立项时间" align="center"></el-table-column>
                <el-table-column v-if='query.show' label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type='text'
                            icon='el-icon-more'
                            @click='handleDetail(scope.row)'
                        >详情</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="项目名称" prop='projectName'>
                    <el-input v-model="form.project.projectName" ></el-input>
                </el-form-item>
                <el-form-item label="项目进度" prop='progress'>
                    <el-input v-model="form.project.progress"></el-input>
                </el-form-item>
                <el-form-item label="学生列表" prop='studentList'>
                    <el-cascader
                        :props="{ checkStrictly: false, multiple:true}" clearable :options="studentListData"  :show-all-levels="false"  filterable v-model="form.studentList"></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false;">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

<!--        新增弹出框-->
        <el-dialog title='新增' :visible.sync='addVisible' width='30%'>
            <el-form ref='form' :model='form' label-width='80px' :rules='rules'>
                <el-form-item label='项目名称' prop='projectName'>
                    <el-input v-model='form.project.projectName'></el-input>
                </el-form-item>
                <el-form-item label="立项时间" style='width: 100%' prop='createTime'>
                    <el-date-picker
                        type="date"
                        placeholder="选择日期"
                        v-model="form.project.createTime"
                        value-format="yyyy-MM-dd"
                        style="width: 100%;"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label='项目进度' prop='progress'>
                    <el-input v-model.trim='form.project.progress'></el-input>
                </el-form-item>
                <el-form-item label="学生列表" prop='studentList'>
                    <el-cascader
                        :props="{ checkStrictly: false, multiple:true}" clearable :options="studentListData" :show-all-levels="false"  filterable v-model="form.studentList"></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAdd">确 定</el-button>
            </span>
        </el-dialog>
<!--        项目详情框-->
        <el-dialog title='学生列表' :visible.sync='detailVisible' width='30%'>
            <el-table
                :data='studentProjectList'
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="studentId" label="学号" align="center"></el-table-column>
                <el-table-column prop="studentName" label="学生姓名" align="center"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="detailVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import request from '@/utils/request';
export const fetchData = query => {
    const userId = localStorage.getItem("userId");
    const authority = localStorage.getItem("authority")
    if (authority == 0) {
        query.show = false;
        return request({
            url: '/studentProjectList',
            method: 'post',
            data: {
            "userId": userId,
            "searchText": query.projectName,
            "pageIndex": query.pageIndex,
            "pageSize": query.pageSize
            }
        })
    }else if (authority == 1) {
        return request({
            url: '/teacherProjectList',
            method: 'post',
            data: {
            "userId": userId,
            "searchText": query.projectName,
            "pageIndex": query.pageIndex,
            "pageSize": query.pageSize
            }
        })
    }else {
        return request({
            url: '/adminProjectList',
            method: 'post',
            data: {
                "searchText": query.projectName,
                "pageIndex": query.pageIndex,
                "pageSize": query.pageSize
            }
        })
    }
};
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                projectName: '',
                pageIndex: 1,
                pageSize: 10,
                show: true
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible: false,
            detailVisible: false,
            pageTotal: 0,
            // 发请求统一提交表单格式
            form: {
                project: {
                    projectId: '',
                    projectName: '',
                    progress: '',
                    createTime: '',
                    teacherId: ''
                },
                //传输的学生列表
                studentList: []
            },
            /*// 编辑框专用form，用于placeholder
            editForm: {
                project: {
                    projectId: '',
                    projectName: '',
                    progress: '',
                    createTime: '',
                    teacherId: ''
                },
                //传输的学生列表
                studentList: []
            },*/
            //展示的学生列表
            studentListData: [],
            //项目相关的学生列表
            studentProjectList: [],
            idx: -1,
            id: -1,
            rules: {
              projectName: [{required: true, message: "项目名不能为空", trigger: 'blur'}],
              createTime: [{required: true, message: "立项时间不能为空", trigger: 'blur'}],
              progress: [{ required: true, message: "项目进度不能为空", trigger: 'blur', min: 0, max: 100, type: 'number'}],
              studentList: [{ required: true, message: "学生列表不能为空", trigger: 'blur' }]
            }
        };
    },
    created() {
        this.getData();
        this.getStudent();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            fetchData(this.query).then(res => {
                console.log(res);
                this.tableData = res.data.records;
                this.pageTotal = res.data.total;
            });
        },
        resetFrom(formName) {
          this.$refs[formName].resetFields();
        },
        getStudent() {
            this.$axios.get('/studentList')
                .then(responseData =>{
                    this.studentListData = responseData.data.data;
                }
            )
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 项目的学生列表详情
        handleDetail(row){
            this.$axios.get('/studentListByProject', {
                params: {
                    'projectId': row.projectId
                }
            }).then(responseData => {
                this.studentProjectList = responseData.data.data;
            })
            this.detailVisible = true;
        },
        // 新增操作
        handleAdd(){
            this.form.project.teacherId = localStorage.getItem('userId');
            this.$axios.post('/addProject', this.form)
                .then(() => {
                    this.$set(this.query, 'pageIndex', 1);
                    this.getData();
                    this.addVisible = false;
                });
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$axios.post('/deleteProject', {
                        'projectId': row.projectId
                    })}).then(() => {
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                    this.pageTotal -= 1;
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            this.editVisible = true;
            this.idx = index;
            this.form.project.projectId = row.projectId;
            this.form.project.projectName = row.projectName;
            this.form.project.progress = row.progress;
            this.form.project.teacherId = row.teacherId;
            this.form.studentList = this.studentProjectList;
        },
        // 保存编辑
        saveEdit() {
            this.$axios.post('/updateProject', this.form)
                .then(() => {
                    this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                    this.editVisible = false;
                    // this.$set(this.tableData, this.idx, this.form);
                    this.getData();
                    this.resetFrom('form');
                })
        },
        // 分页导航
        handlePageChange(val) {
            this.query.pageIndex = val;
            this.getData();
        },

    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
