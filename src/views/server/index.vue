<template>
    <div class="app-container">
        <div class="filter-container">
            <el-select filterable v-model.number="listQuery.clusterId" @change="handleFilter"
                       :placeholder="i18n('server.searchTips')">
                <el-option v-for="(item2,index2) in clustersList" :label="item2.name"
                           :value="item2.id" :key="item2.id"></el-option>
            </el-select>
            <template v-if="listQuery.clusterId">
                <el-input prefix-icon="el-icon-search" v-model="listQuery.addr" style="width: 200px"
                          :placeholder="i18n('server.address')" clearable></el-input>

                <el-input prefix-icon="el-icon-search" v-model="listQuery.maxQPS" style="width: 200px"
                          placeholder="maxQPS" clearable></el-input>

                <el-button style="margin-left: 10px" :loading="listLoading" type="primary"
                           @click="handleFilter">{{i18n('btn.refresh')}}
                </el-button>
            </template>

            <el-tooltip class="item" effect="dark" :content="i18n('server.addTips')" placement="top-start"
                        v-if="clustersList.length === 0">
                <div style="float: right">
                    <el-button :disabled="true" class="filter-item" type="danger"
                               icon="el-icon-edit">{{i18n('btn.add')}}
                    </el-button>
                </div>
            </el-tooltip>
            <el-button v-else class="filter-item" style="float: right" v-waves @click="handleCreate" type="danger"
                       icon="el-icon-edit">{{i18n('btn.add')}}
            </el-button>

        </div>
        <el-table :data="filterData" v-loading="listLoading" element-loading-text="加载中..." border fit
                  highlight-current-row
                  style="width: 100%">
            <el-table-column align="center" label="ID" width="65">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="i18n('server.address')">
                <template slot-scope="scope">
                    <span>{{scope.row.addr}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="i18n('server.protocol')">
                <template slot-scope="scope">
                    <span>{{scope.row.protocol |protocolFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="i18n('server.maxQPS')">
                <template slot-scope="scope">
                    <span>{{scope.row.maxQPS}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="i18n('btn.operator')" width="350">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleShow(scope.row)">{{i18n('btn.show')}}</el-button>
                  <el-button size="mini" type="primary" @click="handleCopy(scope.row)">{{i18n('btn.copy')}}</el-button>
                  <el-button size="mini" type="primary" @click="handleUpdate(scope.row)">{{i18n('btn.edit')}}</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{i18n('btn.delete')}}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination-container">
            <el-pagination background layout="total" :total="pageInfo.totalSize">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import * as serverApi from '~/api/server';
    import * as clusterApi from '~/api/cluster';
    import * as bindApi from '~/api/bind';
    import waves from '~/directive/waves'; // 水波纹指令
    const _name = 'routingIndex';
    import {clone, searchInclude} from "~/utils";
    import i18nMixin from '../mixin/i18n';


    export default {
        name: _name,
        directives: {
            waves
        },

        data() {
            return {
                listQuery: {
                    clusterId: undefined,
                    addr: undefined,
                    maxQPS: undefined
                },
                listLoading: true,
                dataList: [],
                clustersList: [],
                bindIdList: [],
                pageInfo: {
                    totalSize: undefined
                }
            }
        },

        created() {
            this.init();
        },
        mixins:[i18nMixin],
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
                    var filterSearch = true;

                    if (this.listQuery.addr) {
                        filterSearch = searchInclude(item.addr, this.listQuery.addr);
                    }

                    if (filterSearch && this.listQuery.maxQPS) {
                        filterSearch = searchInclude(item.maxQPS, this.listQuery.maxQPS);
                    }

                    return filterSearch;
                })
            }
        },

        methods: {
             init() {
                this.listQuery.clusterId = this.$route.query.id || '';
                // 拉取集群
                clusterApi.getAllData().then((data) => {
                    this.clustersList = data || [];
                    this.listLoading = false;
                }).catch(() => {
                    this.listLoading = false;
                });

                if (this.listQuery.clusterId) {
                    this.handleFilter();
                }
            },

            getList() {
                if (this.bindIdList && this.bindIdList.length > 0) {
                    var promiseList = [];
                    this.bindIdList.forEach((id) => {
                        promiseList.push(serverApi.getItemById(id));
                    });

                    Promise.all(promiseList).then((allList) => {
                        this.dataList = allList;
                        this.listLoading = false;
                        this.pageInfo.totalSize = this.dataList.length;
                    });
                } else {
                    this.dataList = [];
                    this.pageInfo.totalSize = this.dataList.length;
                    this.listLoading = false;
                }
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
                if (!(id && this.listQuery.clusterId)) {
                    return;
                }

                var bindItem = {
                    clusterID: this.listQuery.clusterId,
                    serverID: id
                };

                // 先解绑，后删除。
                bindApi.deleteItem(bindItem).then(() => {
                    //
                    serverApi.deleteItem(id).then((data) => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.handleFilter();
                    })
                });
            },

            handleCreate() {
                this.$router.push({path: '/server/new', query: {clusterId: this.listQuery.clusterId}});
            },

            handleShow(item) {
                this.$router.push({path: '/server/show', query: {id: item.id, clusterId: this.listQuery.clusterId}});
            },

            handleUpdate(item) {
                this.$router.push({path: '/server/edit', query: {id: item.id, clusterId: this.listQuery.clusterId}});
            },

          handleCopy(item){
            this.$router.push({path: '/server/copy', query: {id: item.id, clusterId: this.listQuery.clusterId}});

          }

        }
    }
</script>

<style scoped>

</style>
