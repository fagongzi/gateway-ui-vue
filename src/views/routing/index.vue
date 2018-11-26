<template>
    <div class="app-container">

        <div class="filter-container">
            <el-input prefix-icon="el-icon-search" style="width: 200px" v-model="listQuery.name"
                      placeholder="名称"></el-input>

            <el-select v-model.number="listQuery.clusterId" placeholder="请选择cluster">
                <el-option :label="'请选择'" :value="''" :key="-1"></el-option>
                <el-option v-for="(item2,index2) in clustersList" :label="item2.name"
                           :value="item2.id" :key="item2.id"></el-option>
            </el-select>

            <el-select v-model.number="listQuery.apiId" placeholder="请选择api">
                <el-option :label="'请选择'" :value="''" :key="-1"></el-option>
                <el-option v-for="(item2,index2) in apiList" :label="item2.name"
                           :value="item2.id" :key="item2.id"></el-option>
            </el-select>


            <!--<el-button class="filter-item" type="primary" style="margin-left: 20px" v-waves icon="el-icon-search"-->
            <!--@click="handleFilter">搜索-->
            <!--</el-button>-->

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
        <el-table :data="filterData" v-loading="listLoading" element-loading-text="加载中..." border fit
                  highlight-current-row
                  style="width: 100%">
            <el-table-column align="center" label="序号" width="65">
                <template slot-scope="scope">
                    <span>{{scope.$index+1}}</span>
                </template>
            </el-table-column>
            <el-table-column label="名称">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="集群">
                <template slot-scope="scope">
                    <span>{{scope.row.clusterName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="接口">
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
        <div class="pagination-container" v-if="dataList.length > 0">
            <el-button style="float: left" size="small" @click="initList">第一页</el-button>
            <div style="float: left">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="pageInfo.currentPage" :page-sizes="[10,20,30, 50]"
                               :page-size="pageSearch.limit" @prev-click="handlePagePreview"
                               @next-click="handlePageNext"
                               layout="prev, next, sizes">

                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>

    import waves from '~/directive/waves'; // 水波纹指令
    const _name = 'routingIndex';
    import * as routingApi from '~/api/routing';
    import * as clusterApi from '~/api/cluster';
    import * as apiApi from '~/api/api';
    import {getItemById} from "~/utils/index";

    function _getPageSearch() {
        return {
            after: '',
            limit: 10,
        }
    }

    function _getPageInfo() {
        return {
            currentPage: 1, //当前页
            map: {},
        }
    }

    export default {
        name: _name,
        directives: {
            waves
        },

        data() {
            return {
                listQuery: {
                    name: undefined,
                    clusterId: undefined,
                    apiId: undefined
                },
                listLoading: true,
                dataList: [],
                clustersList: [],
                apiList: [],
                pageSearch: _getPageSearch(),
                // 页面信息
                pageInfo: _getPageInfo(),
            }
        },

        created() {
            this.init();
        },

        watch: {
            '$route': function (to, from) {
                if (to.name != _name) {
                    this.$destroy();
                }
            }
        },

        computed: {
            filterData() {
                return this.dataList.filter((item) => {
                    var name = this.listQuery.name;
                    var clusterId = this.listQuery.clusterId;
                    var apiId = this.listQuery.apiId;
                    return (!name || item.name.toLowerCase().includes(name.toLowerCase())) && (!clusterId || item.clusterID == clusterId) && (!apiId || item.api == apiId);
                });
            }
        },

        methods: {

            init() {
                this.getList();
            },
            //
            initList() {
                this.pageSearch = _getPageSearch();
                this.pageInfo = _getPageInfo();
                this.getList();
            },


            getList() {
                routingApi.getList().then((data) => {
                    this.updateList(data);
                    this.getOthers();
                }).catch(() => {
                    this.listLoading = false;
                })
            },

            getOthers() {
                clusterApi.getList().then((data) => {
                    this.clustersList = data || [];
                    this.dataList.forEach((item) => {
                        var tempItem = getItemById(data, item.clusterID);
                        if (tempItem) {
                            this.$set(item, 'clusterName', tempItem.name);
                        }
                    });
                });

                apiApi.getList().then((data) => {
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
                this.listLoading = false;
                this.updatePageSearch();
            },

            updatePageSearch() {
                var listLength = this.dataList.length;
                var lastItem = this.dataList[listLength - 1];

                if (lastItem && lastItem.id && listLength == this.pageSearch.limit) {
                    this.pageInfo.map[this.pageInfo.currentPage] = this.pageSearch.after;
                    this.pageSearch.after = lastItem.id;
                }
                else {
                    this.pageSearch.after = '';
                }
            },

            handleFilter() {

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

            //
            handleSizeChange(size) {
                this.pageSearch.limit = size;
                this.pageSearch.after = '';
                this.getList();
            },

            // 上一页
            handlePagePreview(page) {
                var currentPage = this.pageInfo.currentPage;
                // 上一个数据
                var preSearchAfter = this.pageInfo.map[currentPage - 1] || '';
                this.pageSearch.after = preSearchAfter;
                this.pageInfo.currentPage = currentPage - 1;
            },

            //
            handlePageNext(page) {

            },

            //
            handleCurrentChange(page) {
                if (!this.pageSearch.after && page > 1) {
                    return false;
                }

                this.pageInfo.currentPage = page;
                this.getList();
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
            }

        }
    }
</script>

<style scoped>

</style>
