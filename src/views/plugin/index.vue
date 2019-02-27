<template>
    <!-- -->
    <div class="app-container">
        <div class="filter-container">
            <el-button class="filter-item" style="float: right" v-waves @click="handleCreate" type="danger"
                       icon="el-icon-edit">添加
            </el-button>
        </div>
        <el-table :data="dataList" v-loading="listLoading" element-loading-text="加载中..." border fit
                  highlight-current-row
                  style="width: 100%">
            <el-table-column label="ID" width="65">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column label="名称">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="作者">
                <template slot-scope="scope">
                    <span>{{scope.row.author}}</span>
                </template>
            </el-table-column>
            <el-table-column label="邮箱">
                <template slot-scope="scope">
                    <span>{{scope.row.email}}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span>{{scope.row.status}}</span>
                </template>
            </el-table-column>
            <el-table-column label="更新时间">
                <template slot-scope="scope">
                    <span>{{scope.row.updateAt}}</span>
                </template>
            </el-table-column>
            <el-table-column label="版本">
                <template slot-scope="scope">
                    <span>{{scope.row.version}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="350">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleShow(scope.row)">查看</el-button>
                    <el-button size="mini" type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import waves from '~/directive/waves'; // 水波纹指令
    import * as pluginApi from '~/api/plugin';


    const _name = 'pluginIndex';

    export default {
        name: _name,
        directives: {
            waves
        },
        data() {

            return {
                listQuery: {
                    page: 1,//
                    size: 10,// 默认值 10 个一页
                },
                listLoading: true,
                dataList: [],
                // 页面信息
                pageInfo: {
                    totalSize: undefined, // 所有个数
                },
            }
        },

        //
        created() {
            this.getList();
        },
        watch: {
            '$route': function (to, from) {
                if (to.name != _name) {
                    this.$destroy();
                }
            },
        },

        //
        methods: {
            getList() {
                this.listLoading = true;
                pluginApi.getList().then((data) => {
                    this.listLoading = false;
                    this.updateList(data);
                }).catch(() => {
                    this.listLoading = false;
                });
            },

            updateList(data) {

            },

            handleCreate() {
                this.$router.push({path: '/plugin/new'});
            },

            handleShow(item) {
                this.$router.push({path: '/plugin/show', query: {id: item.id}});

            },

            handleUpdate(item) {
                this.$router.push({path: '/plugin/edit', query: {id: item.id}});
            },

            //
            handleDelete(item) {

            }


        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
