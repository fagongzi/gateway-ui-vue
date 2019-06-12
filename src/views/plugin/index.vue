<template>
    <!-- -->
    <div class="app-container">
        <div class="filter-container">

            <el-input prefix-icon="el-icon-search" style="width: 200px" v-model="listQuery.name"
                      :placeholder="i18n('plugin.name')" clearable></el-input>
            <el-input prefix-icon="el-icon-search" style="width: 200px" v-model="listQuery.author"
                      :placeholder="i18n('plugin.author')" clearable></el-input>
            <el-input prefix-icon="el-icon-search" style="width: 200px" v-model="listQuery.email"
                      :placeholder="i18n('plugin.email')" clearable></el-input>
            <el-select filterable v-model="listQuery.used" placeholder="placeholder">
                <el-option :label="i18n('plugin.isUsed')" :value="undefined" :key="-1"></el-option>
                <el-option :label="i18n('tips.yes')" :value="true" :key="0"></el-option>
                <el-option :label="i18n('tips.no')" :value="false" :key="1"></el-option>
            </el-select>


            <el-button style="margin-left: 10px" :loading="listLoading" type="primary"
                       @click="getList">{{i18n('btn.refresh')}}
            </el-button>
            <el-button class="filter-item" style="float: right" v-waves @click="handleCreate" type="danger"
                       icon="el-icon-edit">{{i18n('btn.add')}}
            </el-button>
            <el-button type="success" style="float: right;" v-waves @click="handleSortable">{{i18n('btn.manage')}}</el-button>

        </div>
        <el-table :data="showList" v-loading="listLoading" :element-loading-text="i18n('tips.loading')" border fit
                  style="width: 100%">
            <el-table-column label="ID" width="65">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="i18n('plugin.name')">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="i18n('plugin.author')">
                <template slot-scope="scope">
                    <span>{{scope.row.author}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="i18n('plugin.email')">
                <template slot-scope="scope">
                    <span>{{scope.row.email}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="i18n('plugin.updateTime')">
                <template slot-scope="scope">
                    <span>{{scope.row.updateAt | parseTime}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="i18n('plugin.version')">
                <template slot-scope="scope">
                    <span>{{scope.row.version}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="i18n('plugin.isUsed')">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.used == true" type="danger">{{i18n('tips.yes')}}</el-tag>
                    <el-tag v-else>{{i18n('tips.no')}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column :label="i18n('btn.operator')" width="350">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleShow(scope.row)">{{i18n('btn.show')}}</el-button>
                    <el-button size="mini" type="primary" @click="handleUpdate(scope.row)">{{i18n('btn.edit')}}</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
                               v-if="scope.row.used !== true">
                        {{i18n('btn.delete')}}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import waves from '~/directive/waves'; // 水波纹指令
    import * as pluginApi from '~/api/plugin';
    import {searchInclude} from '~/utils/index';
    import i18nMixin from '../mixin/i18n';


    const _name = 'pluginIndex';

    export default {
        name: _name,
        directives: {
            waves
        },
        mixins:[i18nMixin],
        data() {
            return {
                listQuery: {
                    name: '',
                    author: '',
                    email: '',
                    status: -1,
                    used: undefined,
                    page: 1,//
                    size: 10,// 默认值 10 个一页
                },
                listLoading: true,
                dataList: [],
                showList: [],
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
            'listQuery.name': function () {
                this.handleFilter();
            },

            'listQuery.author': function () {
                this.handleFilter();
            },

            'listQuery.email': function () {
                this.handleFilter();
            },

            'listQuery.used': function () {
                this.handleFilter();
            }
        },

        //
        methods: {
            getList() {
                this.listLoading = true;
                pluginApi.getAllData().then((data) => {
                    this.listLoading = false;
                    this.updateList(data);
                }).catch(() => {
                    this.listLoading = false;
                });
            },

            handleFilter() {
                this.listQuery.page = 1;
                this.updateShowList();
            },

            updateList(data) {
                this.dataList = data;
                this.pageInfo.totalSize = this.dataList.length;
                this.updateShowList();
                this.updateListIsUsed();
            },

            //
            updateListIsUsed() {
                pluginApi.getApply().then((data) => {
                    var tempSortable = data || {};

                    var appliedIDs = tempSortable.appliedIDs || [];

                    if (appliedIDs.length > 0) {
                        appliedIDs.forEach((id) => {
                            var tempItem = this._getPluginById(id);

                            if (tempItem) {
                                this.$set(tempItem, 'used', !!tempItem);
                            }
                        })
                    }
                })
            },

            updateShowList() {
                var tempFilterSearchList = [];
                var tempShowList = [];

                // 搜索操作
                this.dataList.forEach((item, index) => {
                    var searchName = this.listQuery.name;
                    var author = this.listQuery.author;
                    var email = this.listQuery.email;
                    // var status = this.listQuery.status;
                    var used = this.listQuery.used;

                    var filterSearch = true;

                    // name
                    if (searchName) {
                        filterSearch = searchInclude(item.name, searchName);
                    }

                    if (filterSearch && author) {
                        filterSearch = searchInclude(item.author, author);
                    }

                    if (filterSearch && email) {
                        filterSearch = searchInclude(item.email, email);
                    }

                    if (filterSearch && used !== undefined) {
                        if (item.used) {
                            filterSearch = item.used === used;
                        } else if (used) {
                            filterSearch = false;
                        }
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

            handleCreate() {
                this.$router.push({path: '/plugin/new'});
            },

            handleSortable() {
                this.$router.push({path: '/plugin/sortable'});
            },

            handleShow(item) {
                this.$router.push({path: '/plugin/show', query: {id: item.id}});

            },

            handleUpdate(item) {
                this.$router.push({path: '/plugin/edit', query: {id: item.id}});
            },

            //
            handleDelete(item) {
                let id = item.id;
                this.$confirm('是否删除该插件？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this._doDeleteItem(id);
                });
            },

            _doDeleteItem(id) {
                pluginApi.deleteItem(id).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getList();
                }).catch(() => {

                })
            },
            _getPluginById(id) {
                var ret;
                for (var i = 0, len = this.dataList.length; i < len; i++) {
                    var tempItem = this.dataList[i];

                    if (tempItem.id === id) {
                        ret = tempItem;
                        break;
                    }
                }

                return ret;
            },

        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
