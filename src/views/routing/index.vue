<template>
    <div class="app-container">

        <div class="filter-container">
            <el-input prefix-icon="el-icon-search" style="width: 200px" v-model="listQuery.name"
                      placeholder="名称" clearable></el-input>

            <el-select filterable v-model.number="listQuery.clusterId" placeholder="请选择cluster">
                <el-option :label="'请选择cluster'" :value="-1" :key="-1"></el-option>
                <el-option v-for="(item2,index2) in clustersList" :label="item2.name"
                           :value="item2.id" :key="item2.id"></el-option>
            </el-select>

            <el-select filterable v-model.number="listQuery.apiId" placeholder="请选择api">
                <el-option :label="'请选择api'" :value="-1" :key="-1"></el-option>
                <el-option v-for="(item2,index2) in apiList" :label="item2.name"
                           :value="item2.id" :key="item2.id"></el-option>
            </el-select>

            <el-button style="margin-left: 10px" :loading="listLoading" type="primary"
                       @click="getList">刷新
            </el-button>


            <el-tooltip class="item" effect="dark" content="请先添加Cluster或者API" placement="top-start"
                        v-if="clustersList.length === 0 || apiList.length ===0">
                <div style="float: right">
                    <el-button :disabled="true" class="filter-item" type="danger" icon="el-icon-edit">添加</el-button>
                </div>
            </el-tooltip>

            <el-button v-else class="filter-item" style="float: right" v-waves @click="handleCreate" type="danger"
                       icon="el-icon-edit">添加
            </el-button>
        </div>
        <el-table :data="showList" v-loading="listLoading" element-loading-text="加载中..." border fit
                  highlight-current-row
                  style="width: 100%">
            <el-table-column align="center" label="ID" width="65">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column label="名称">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="cluster">
                <template slot-scope="scope">
                    <span>{{scope.row.clusterName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="API">
                <template slot-scope="scope">
                    <span>{{scope.row.apiName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="路由策略">
                <template slot-scope="scope">
                    <span>{{scope.row.strategy | strategyFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column label="路由流量比例">
                <template slot-scope="scope">
                    <span>{{scope.row.trafficRate}}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <template v-if="scope.row.status">
                        <el-tag type="success">生效</el-tag>
                    </template>
                    <template v-else>
                        <el-tag type="danger">失效</el-tag>
                    </template>
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

        <!--page footer-->
        <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]"
                           :page-size="listQuery.size"
                           layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.totalSize">
            </el-pagination>
        </div>
    </div>
</template>

<script>

    import waves from '~/directive/waves'; // 水波纹指令
    const _name = 'routingIndex';
    import * as routingApi from '~/api/routing';
    import * as clusterApi from '~/api/cluster';
    import * as apiApi from '~/api/api';
    import {getItemById, clone, searchInclude} from "~/utils/index";


    export default {
        name: _name,
        directives: {
            waves
        },

        data() {
            return {
                listQuery: {
                    name: undefined,
                    clusterId: -1,
                    apiId: -1,
                    page: 1,//
                    size: 10,// 默认值 10 个一页
                },
                listLoading: true,
                dataList: [],
                showList: [],
                clustersList: [],
                apiList: [],
                // 页面信息
                pageInfo: {
                    totalSize: undefined, // 所有个数
                },
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
            },

            'listQuery.name': function () {
                this.handleFilter();
            },

            'listQuery.clusterId': function () {
                this.handleFilter();
            },

            'listQuery.apiId': function () {
                this.handleFilter();
            }
        },

        computed: {},

        methods: {

            getList() {
                this.listLoading = true;
                routingApi.getAllData().then((data) => {
                    this.updateList(data);
                    this.getOthers();
                }).catch(() => {
                    this.listLoading = false;
                })
            },

            getOthers() {
                clusterApi.getAllData().then((data) => {
                    this.clustersList = data || [];
                    this.dataList.forEach((item) => {
                        var tempItem = getItemById(data, item.clusterID);
                        if (tempItem) {
                            this.$set(item, 'clusterName', tempItem.name);
                        }
                    });
                });

                apiApi.getAllData().then((data) => {
                    this.apiList = data || [];
                    this.dataList.forEach((item) => {
                        var tempItem = getItemById(data, item.api);
                        if (tempItem) {
                            this.$set(item, 'apiName', tempItem.name);
                        }
                    });
                });
            },

            updateList(data) {
                this.dataList = data || [];
                this.pageInfo.totalSize = this.dataList.length;
                this.listLoading = false;
                this.updateShowList();
            },

            updateShowList() {
                var tempFilterSearchList = [];
                var tempShowList = [];

                // 搜索操作
                this.dataList.forEach((item, index) => {
                    var searchName = this.listQuery.name;
                    var searchClusterId = this.listQuery.clusterId;
                    var searchApiId = this.listQuery.apiId;
                    var filterSearch = true;

                    // name
                    if (searchName) {
                        filterSearch = searchInclude(item.name, searchName);
                    }

                    if (filterSearch && searchClusterId !== -1) {
                        filterSearch = item.clusterID === searchClusterId;
                    }

                    if (filterSearch && searchApiId !== -1) {
                        filterSearch = item.api === searchApiId;
                    }


                    if (filterSearch) {
                        tempFilterSearchList.push(item);
                    }
                });

                //  分页操作
                tempFilterSearchList.forEach((item, index) => {
                    item = item || {};
                    var currentPage = this.listQuery.page;
                    var pageCount = this.listQuery.size;
                    var number = index; // 当前的编号
                    var maxSize = currentPage * pageCount;
                    var minSize = maxSize - pageCount;
                    var filterPage = true;

                    filterPage = number >= minSize && number < maxSize;

                    if (filterPage) {
                        tempShowList.push(item);
                    }
                });


                this.showList = tempShowList;
                this.pageInfo.totalSize = tempFilterSearchList.length;
            },

            //
            handleSizeChange(size) {
                this.listQuery.size = size;
                this.listQuery.page = 1;
                this.updateShowList();
            },

            //
            handleCurrentChange(page) {
                this.listQuery.page = page;
                this.updateShowList();
            },


            handleFilter() {
                this.listQuery.page = 1;
                this.updateShowList();
            },

            handleDelete(item) {
                let id = item.id;
                this.$confirm('是否删除该routing？', '提示', {
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
                routingApi.deleteItem(id).then((data) => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getList();
                })
            },

            //
            handleCreate() {
                this.$router.push({path: '/routing/new'});
            },

            handleShow(item) {
                this.$router.push({path: '/routing/show', query: {id: item.id}});
            },

            handleUpdate(item) {
                this.$router.push({path: '/routing/edit', query: {id: item.id}});
            }

        }
    }
</script>

<style scoped>

</style>
