<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 阅读论文
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='container'>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <el-table-column prop="fileName" label="论文名称" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type='text'
                            icon='el-icon-more'
                            @click='handlePreview(scope.row)'
                        >预览</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleDownload(scope.row)"
                        >下载</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            style='color: red'
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
    </div>
</template>

<script>
import request from '@/utils/request';
import file from '@/utils/file';
export const fetchData = query => {
    const userId = localStorage.getItem("userId");
    return request({
        url: '/getPaperList',
        method: 'post',
        data: {
            "userId": userId,
            "pageIndex": query.pageIndex,
            "pageSize": query.pageSize
        }
    })
};
export default {
    name: 'ReadPaper',
    data() {
        return {
            query: {
                paperName: '',
                pageIndex: 1,
                pageSize: 10,
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible: false,
            detailVisible: false,
            pageTotal: 0,
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getData();
    },
    methods: {
        //获取table数据
        getData() {
            fetchData(this.query).then(res => {
                console.log(res);
                this.tableData = res.data.records;
                this.pageTotal = res.data.total;
            });
        },
        // 删除操作
        handleDelete(index, row) {
            const userId = localStorage.getItem('userId');
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    file('/deletePaper', {
                        method: 'post',
                        data: {
                            'userId': userId,
                            'fileName': row.fileName
                        }
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
        // 分页导航
        handlePageChange(val) {
            this.query.pageIndex = val;
            this.getData();
        },
        //下载论文
        handleDownload(row) {
            const userId = localStorage.getItem('userId');
            file('/downloadPaper',
                {
                    method: 'post',
                    responseType: 'blob',    //接收类型设置，否者返回字符型
                    data: {
                        'userId': userId,
                        'fileName': row.fileName
                    }}).then(res => {
                        const blob = res
                        const reader = new FileReader()
                        reader.readAsDataURL(blob)
                        reader.onload = (e) => {
                            const a = document.createElement('a')
                            a.download = row.fileName
                            a.href = e.target.result
                            document.body.appendChild(a)
                            a.click()
                            document.body.removeChild(a)
                    }
                })
        },
        //预览论文
        handlePreview(row){
            const userId = localStorage.getItem('userId');
            file('/downloadPaper',
                {
                    method: 'post',
                    responseType: 'blob',    //接收类型设置，否者返回字符型
                    data: {
                        userId: userId,
                        fileName: row.fileName
                    }}).then(blob => {
                        let url = window.URL.createObjectURL(new Blob([blob], {type: blob.type}));
                        let html = "<embed width='100%' height='100%' name='plugin' id='plugin' type='application/pdf' src='" + url + "'>";
                        let newwindow = window.open('','_blank','');
                        newwindow.document.write(html);
                })
        }

    }
};
</script>

<style scoped>

</style>