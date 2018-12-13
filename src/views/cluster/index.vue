<template>
    <div class="app-container">

        <div class="filter-container">
            <el-input prefix-icon="el-icon-search" class="filter-item" style="width: 200px" v-model="listQuery.name"
                      placeholder="Cluster名称" clearable></el-input>

            <el-button style="margin-left: 10px" :loading="listLoading" class="filter-item" type="primary"
                       @click="getList">刷新
            </el-button>

            <el-button class="filter-item" style="float: right" v-waves @click="handleCreate" type="danger"
                       icon="el-icon-edit">添加
            </el-button>
        </div>
        <el-table
                :data="showList"
                v-loading="listLoading" element-loading-text="加载中..." border fit
                highlight-current-row
                style="width: 100%">
            <el-table-column align="center" label="ID" width="65">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column label="Cluster名称">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="负载均衡算法">
                <template slot-scope="scope">
                    <span>{{ scope.row.loadBalance | loadBalanceFilter }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="350">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleShowList(scope.row)">查看绑定的服务</el-button>
                    <el-button size="mini" type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--page footer-->
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
    import * as clusterApi from '~/api/cluster'
    import waves from '~/directive/waves'; // 水波纹指令
    import {LOAD_BALANCE_ARRAY, LOAD_BALANCE_OBJECT} from '~/constant/constant';
    import {clone, searchInclude} from "~/utils";

    const _name = 'clusterIndex';

    export default {
        name: _name,
        directives: {
            waves
        },
        data() {
            return {
                listQuery: {
                    name: '',
                    loadBalance: undefined,
                    page: 1,//
                    size: 10,// 默认值 10 个一页
                },

                listLoading: true, // 列表加载状态
                dataList: [],
                showList: [],
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
                if (to.name !== _name) {
                    this.$destroy();
                }
            },

            'listQuery.name': function () {
                this.handleFilter();
            }
        },
        computed: {},
        methods: {
            getList() {
                this.listLoading = true;
                clusterApi.getAllData().then((data) => {
                    this.updateList(data);
                }).catch(() => {
                    this.listLoading = false;
                })
            },


            updateList(data) {
                this.dataList = data || [];
                this.pageInfo.totalSize = this.dataList.length;
                this.listLoading = false;
                this.updateShowList();
            },


            handleFilter() {
                this.listQuery.page = 1;
                this.updateShowList();
            },

            updateShowList() {
                var tempFilterSearchList = [];
                var tempShowList = [];

                // 搜索操作
                this.dataList.forEach((item, index) => {
                    var searchName = this.listQuery.name;
                    var searchDomain = this.listQuery.domain;
                    var searchTag = this.listQuery.tag;
                    var searchMatchRule = this.listQuery.matchRule;
                    var filterSearch = true;

                    // name
                    if (searchName) {
                        filterSearch = searchInclude(item.name, searchName);
                    }

                    // domain
                    if (filterSearch && searchDomain) {
                        filterSearch = searchInclude(item.domain, searchDomain);
                    }

                    // tag
                    if (filterSearch && searchTag) {
                        if (item.tags && item.tags.length > 0) {
                            for (var i = 0, len = item.tags.length; i < len; i++) {
                                var tempTag = item.tags[i] || {};
                                filterSearch = searchInclude(tempTag.name, searchTag) || searchInclude(tempTag.value, searchTag);
                            }
                        }
                    }

                    if (filterSearch && searchMatchRule !== -1) {
                        filterSearch = item.matchRule === searchMatchRule;
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

            handleDelete(item) {
                let id = item.id;
                this.$confirm('是否删除该集群？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this._doDeleteItem(id);
                });
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

            _doDeleteItem(id) {
                if (!id) {
                    return;
                }
                //
                clusterApi.deleteItem(id).then((data) => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getList();
                })
            },

            handleCreate() {
                this.$router.push({path: '/cluster/new'});
            },

            handleShowList(item) {
                this.$router.push({path: '/server', query: {id: item.id}});
            },

            handleUpdate(item) {
                this.$router.push({path: '/cluster/edit', query: {id: item.id}});
            }
        }

    }
</script>

<style scoped>

</style>
