<template>
    <div class="app-container">

        <div class="filter-container">
            <el-input prefix-icon="el-icon-search" class="filter-item" v-model="listQuery.name" style="width: 200px" placeholder="接口名称"></el-input>

            <!--<el-button class="filter-item" type="primary" style="margin-left: 20px" v-waves icon="el-icon-search"-->
                       <!--@click="handleFilter">搜索-->
            <!--</el-button>-->

            <el-button class="filter-item" style="float: right" v-waves @click="handleCreate" type="danger"
                       icon="el-icon-edit">添加
            </el-button>
        </div>
        <el-table :data="dataList.filter((data)=> !listQuery.name || data.name.toLowerCase().includes(listQuery.name.toLowerCase()))" v-loading="listLoading" element-loading-text="加载中..." border fit
                  highlight-current-row
                  style="width: 100%">
            <el-table-column align="center" label="序号" width="65">
                <template slot-scope="scope">
                    <span>{{scope.$index+1}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="接口名称">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="URL匹配模式">
                <template slot-scope="scope">
                    <span>{{scope.row.urlPattern}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="接口请求域名">
                <template slot-scope="scope">
                    <span>{{scope.row.domain}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="请求类型">
                <template slot-scope="scope">
                    <el-tag type="success">{{ scope.row.method }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="开关状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 0" type="danger">关闭中</el-tag>
                    <el-tag v-else>正常</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="260">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleShow(scope.row)">查看</el-button>
                    <el-button size="mini" type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

</template>

<script>
    import waves from '~/directive/waves'; // 水波纹指令
    import * as apiApi from '~/api/api';

    const _name = 'apiIndex';

    export default {
        name: _name,
        directives: {
            waves
        },
        data() {
            return {
                listLoading: true,
                dataList: [],
                listQuery: {
                    name: ''
                }
            }
        },
        created() {
            this.getList();
        },
        watch: {
            '$route': function (to, from) {
                if (to.name != _name) {
                    this.$destroy();
                }
            }
        },
        computed: {},
        methods: {

            getList() {
                apiApi.getList().then((data) => {
                    this.updateList(data);
                }).catch(() => {
                    this.listLoading = false;
                });
            },

            updateList(data) {
                this.dataList = data || [];
                this.listLoading = false
            },

            handleFilter() {

            },

            handleCreate() {
                this.$router.push({path: '/api/new'});
            },

            handleShow(item) {
                this.$router.push({path: '/api/show', query: {id: item.id}});
            },

            handleUpdate(item) {
                this.$router.push({path: '/api/edit', query: {id: item.id}});
            },

            handleDelete(item) {
                let id = item.id;
                this.$confirm('是否删除该API？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this._doDeleteItem(id);
                });
            },

            _doDeleteItem(id) {
                if (!id) {
                    return;
                }
                //
                apiApi.deleteItem(id).then((data) => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getList();
                })
            }

        }

    }
</script>

<style scoped>

</style>
