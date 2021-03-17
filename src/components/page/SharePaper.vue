<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 论文分享
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='container'>
            <el-form ref='pageForm' :model='pageForm'>
                <el-form-item label='上传文件'>
                    <el-upload
                        :headers='headers'
                        :data='pageForm'
                        style='width: 50%'
                        class="upload-demo"
                        accept='.pdf'
                        ref="upload"
                        action="http://localhost:8093/file/sharePaper"
                        :file-list="fileList"
                        :before-upload='beforeUpload'
                        :on-change='handleChange'
                        :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传pdf文件，不能超过10M</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="收件人" prop='receiverList'>
                    <el-cascader
                        :props="{ checkStrictly: false, multiple:true}" clearable :options="userList" :show-all-levels="false"  filterable v-model="pageForm.receiverList">
                    </el-cascader>
                </el-form-item>
                <el-form-item>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SharePaper',
    data() {
        return {
            userList: [],
            fileList: [],
            pageForm: {
                receiverList: [],
            },
            headers: {
                Authorization: localStorage.getItem('Authorization')
            }
        }
    },
    created() {
        this.getUserList();
    },
    methods: {
        //获取收件人列表
        getUserList() {
            this.$axios.get('/getUserList')
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
        //上传论文
        submitUpload() {
            const listLen = this.$refs.pageForm.model.receiverList.length;
            const fileLen = this.$refs.upload.uploadFiles.length;
            if (listLen !== 0 && fileLen !== 0) {
                const receiverList = this.pageForm.receiverList;
                const list = [];
                receiverList.forEach(item => {
                    list.push(item[1]);
                })
                this.pageForm.receiverList = list;
                this.$refs.upload.submit();
                this.$refs['pageForm'].resetFields();
                this.$refs.upload.clearFiles();
            }else if (listLen === 0){
                this.$message.error("收件人不能为空！");
            }else {
                this.$message.error("文件不能为空！");
            }
        },
        //限制大小
        beforeUpload(file) {
            const size = file.size / 1024 / 1024;
            if (size > 10) {
                this.$message.error("文件大小不能超过10M！");
                return false;
            }else {
                this.$message.success("上传成功！");
                return file;
            }
        }
    }
};
</script>

<style scoped>

</style>