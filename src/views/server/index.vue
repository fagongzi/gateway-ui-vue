<template>
    <div class="app-container">
        <div class="filter-container">
            <el-select v-model.number="listQuery.clusterId">
                <el-option v-for="(item2,index2) in clustersList" :label="item2.name"
                           :value="item2.id" :key="item2.id"></el-option>
            </el-select>

            <el-button class="filter-item" type="primary" style="margin-left: 20px" v-waves icon="el-icon-search"
                       @click="handleFilter">搜索
            </el-button>
            <el-button class="filter-item" style="float: right" v-waves @click="handleCreate" type="danger"
                       icon="el-icon-edit">添加
            </el-button>
        </div>
        <el-table :data="dataList" v-loading="listLoading" element-loading-text="加载中..." border fit
                  highlight-current-row
                  style="width: 100%">
            <el-table-column align="center" label="序号" width="65">
                <template slot-scope="scope">
                    <span>{{scope.$index+1}}</span>
                </template>
            </el-table-column>
            <el-table-column label="地址">
                <template slot-scope="scope">
                    <span>{{scope.row.addr}}</span>
                </template>
            </el-table-column>
            <el-table-column label="接口协议">
                <template slot-scope="scope">
                    <span>{{scope.row.protocol |protocolFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column label="支持的最大QPS">
                <template slot-scope="scope">
                    <span>{{scope.row.maxQPS}}</span>
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
    import * as serverApi from '~/api/server';
    import * as clusterApi from '~/api/cluster';
    import * as bindApi from '~/api/bind';
    import waves from '~/directive/waves'; // 水波纹指令
    const _name = 'routingIndex';

    export default {
        name: _name,
        directives: {
            waves
        },

        data() {
            return {
                listQuery: {
                    clusterId: undefined
                },
                listLoading: true,
                dataList: [],
                clustersList: [],
                bindIdList: []
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

        computed: {},

        methods: {
            init() {
                this.listQuery.clusterId = this.$route.query.id || '';
                // 拉取集群
                clusterApi.getList().then((data) => {
                    this.clustersList = data || [];
                    this.listLoading = false;
                });

                if (this.listQuery.clusterId) {
                    this.handleFilter();
                }
            },

            getList() {
                serverApi.getList().then((data) => {
                    this.updateList(data);
                }).catch(() => {
                    this.listLoading = false;
                })
            },


            updateList(data) {
                var tempList = data || [];
                var showList = [];

                if (this.bindIdList.length > 0) {
                    tempList.forEach((item) => {
                        if (this.bindIdList.indexOf(item.id) !== -1) {
                            showList.push(item);
                        }
                    });
                }

                this.dataList = showList;
                this.listLoading = false;
            },

            handleFilter() {
                var tempId = this.listQuery.clusterId;
                this.listLoading = true;
                clusterApi.getBindItem(tempId).then((data) => {
                    this.bindIdList = data || [];
                    this.getList();
                });
            },

            handleDelete(item) {
                let id = item.id;
                this.$confirm('是否删除该server？', '提示', {
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
                serverApi.deleteItem(id).then((data) => {
                    var bindItem = {
                        clusterID: this.$route.query.id,
                        serverID: data
                    };
                    bindApi.deleteItem(bindItem).then(() => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getList();
                    });
                })
            },

            handleCreate() {
                this.$router.push({path: '/server/new', query: {clusterId: this.listQuery.clusterId}});
            },


            handleShow(item) {
                this.$router.push({path: '/server/show', query: {id: item.id, clusterId: this.listQuery.clusterId}});
            },

            handleUpdate(item) {
                this.$router.push({path: '/server/edit', query: {id: item.id, clusterId: this.listQuery.clusterId}});
            }

        }
    }
</script>

<style scoped>

</style>
