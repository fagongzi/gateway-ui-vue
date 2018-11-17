<template>
    <div class="app-container">

        <div class="filter-container">
            <el-input class="filter-item" style="width: 200px" v-model="listQuery.name" placeholder="集群名称"
                      @keyup.enter.native="handleFilter"></el-input>


            <el-select clearable style="width: 150px" class="filter-item" v-model="listQuery.loadBalance"
                       placeholder="负载均衡算法"
                       @change="handleFilter">
                <el-option v-for="item in loadBalanceConstant" :key="item.value" :value="item.value"
                           :label="item.title">
                </el-option>
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
            <el-table-column label="集群名称">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="负载均衡算法">
                <template slot-scope="scope">
                    <span>{{ scope.row.loadBalance == 0 ? 'RoundRobin' : 'IPHash' }}</span>
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
    </div>

</template>

<script>
    import * as clusterApi from '~/api/cluster'
    import waves from '~/directive/waves'; // 水波纹指令
    import {LOAD_BALANCE_ARRAY, LOAD_BALANCE_OBJECT} from '~/constant/constant';

    const _name = 'clusterIndex';

    const LOAD_BALANCE_ARRAY_SEARCH = [{value: -1, title: '请选择'}, ...LOAD_BALANCE_ARRAY];

    export default {
        name: _name,
        directives: {
            waves
        },
        data() {
            return {
                listQuery: {
                    name: '',
                    loadBalance: undefined
                },

                loadBalanceConstant: LOAD_BALANCE_ARRAY_SEARCH,


                listLoading: true, // 列表加载状态
                dataList: [],
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
            }
        },
        computed: {},
        methods: {

            getList() {
                clusterApi.getList().then((data) => {
                    this.updateList(data);
                }).catch(() => {
                    this.listLoading = false;
                })
            },

            updateList(data) {
                this.dataList = data || [];
                this.listLoading = false
            },

            handleFilter() {

            },

            handleCreate() {
                this.$router.push({path: '/cluster/new'});
            },

            handleShowList(item) {
                this.$router.push({path: '/server', query: {id: item.id}});
            },

            handleUpdate(item) {
                this.$router.push({path: '/cluster/edit', query: {id: item.id}});
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
            }
        }

    }
</script>

<style scoped>

</style>
