<template>
    <div class="app-container">

        <div class="filter-container">
            <el-input prefix-icon="el-icon-search" class="filter-item" v-model="listQuery.name" style="width: 200px"
                      placeholder="接口名称"></el-input>

            <!--<el-button class="filter-item" type="primary" style="margin-left: 20px" v-waves icon="el-icon-search"-->
            <!--@click="handleFilter">搜索-->
            <!--</el-button>-->

            <el-button class="filter-item" style="float: right" v-waves @click="handleCreate" type="danger"
                       icon="el-icon-edit">添加
            </el-button>
        </div>
        <el-table
                :data="dataList.filter((data)=> !listQuery.name || data.name.toLowerCase().includes(listQuery.name.toLowerCase()))"
                v-loading="listLoading" element-loading-text="加载中..." border fit
                highlight-current-row
                style="width: 100%">
            <el-table-column align="center" label="ID" width="65">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
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

        <!--page footer-->
        <div class="pagination-container" v-if="!(dataList.length == 0 && pageInfo.currentPage === 1)">
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
    import * as apiApi from '~/api/api';
    import {clone} from "~/utils";

    const _name = 'apiIndex';

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
                listLoading: true,
                dataList: [],
                listQuery: {
                    name: ''
                },
                pageSearch: _getPageSearch(),
                // 页面信息
                pageInfo: _getPageInfo(),
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
            //
            getList() {
                var query = clone(this.pageSearch);
                apiApi.getList(query).then((data) => {
                    this.updateList(data);
                }).catch(() => {
                    this.listLoading = false;
                });
            },
            //
            initList() {
                this.pageSearch = _getPageSearch();
                this.pageInfo = _getPageInfo();
                this.getList();
            },
            //
            updateList(data) {
                this.dataList = data || [];
                this.listLoading = false;
                this.updatePageSearch();
            },
            //
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
            //
            handleFilter() {

            },
            //
            handleCreate() {
                this.$router.push({path: '/api/new'});
            },
            //
            handleShow(item) {
                this.$router.push({path: '/api/show', query: {id: item.id}});
            },
            //
            handleUpdate(item) {
                this.$router.push({path: '/api/edit', query: {id: item.id}});
            },

            //
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

            //
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
