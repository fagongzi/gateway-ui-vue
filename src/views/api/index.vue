<template>
    <div class="app-container">

        <div class="filter-container">
            <el-input prefix-icon="el-icon-search" class="filter-item" v-model="listQuery.name" style="width: 200px"
                      placeholder="接口名称" clearable></el-input>

            <el-input prefix-icon="el-icon-search" class="filter-item" v-model="listQuery.urlPattern"
                      style="width: 200px"
                      placeholder="URL匹配规则" clearable></el-input>

            <el-input prefix-icon="el-icon-search" class="filter-item" v-model="listQuery.tag" style="width: 200px"
                      placeholder="标签(name/value)" clearable></el-input>

            <el-select class="filter-item" v-model="listQuery.matchRule" placeholder="匹配规则" style="width: 200px">
                <el-option v-for="item in matchRuleConstant" :key="item.value" :value="item.value"
                           :label="item.title">
                </el-option>
            </el-select>


            <el-input prefix-icon="el-icon-search" class="filter-item" v-model="listQuery.domain" style="width: 200px"
                      placeholder="接口请求域名" clearable></el-input>

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
            <el-table-column align="center" label="匹配规则" width="110px">
                <template slot-scope="scope">
                    <span>{{scope.row.matchRule | matchRuleFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="接口请求域名">
                <template slot-scope="scope">
                    <span>{{scope.row.domain}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="请求类型" width="100px">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.method">{{ scope.row.method }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="状态" width="100px">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 0" type="danger">禁用</el-tag>
                    <el-tag v-else>启用</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="320">
                <template slot-scope="scope">
                    <template v-if="scope.row.status == 0">
                        <el-button size="mini" type="success" @click="toggleStatus(scope.row)">启用API</el-button>
                    </template>
                    <template v-else>
                        <el-button size="mini" type="danger" @click="toggleStatus(scope.row)">禁用API</el-button>
                    </template>

                    <el-button size="mini" @click="handleShow(scope.row)">查看</el-button>
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
    import waves from '~/directive/waves' // 水波纹指令
    import * as apiApi from '~/api/api'
    import {clone, searchInclude} from "~/utils"
    import {MATCH_RULE_ARRAY2} from "~/constant/constant"

    const _name = 'apiIndex'


    export default {
        name: _name,
        directives: {
            waves
        },
        data() {
            return {
                listLoading: true,
                dataList: [],
                showList: [],
                listQuery: {
                    name: '', // 名称
                    tag: '',  // 标签
                    domain: '', // 请求域名
                    urlPattern: '', // url 匹配规则
                    matchRule: -1,//
                    page: 1,//
                    size: 10,// 默认值 10 个一页
                },
                // 页面信息
                pageInfo: {
                    totalSize: undefined, // 所有个数
                },

                matchRuleConstant: MATCH_RULE_ARRAY2
            }
        },
        created() {
            this.getList()
        },
        watch: {
            '$route': function (to, from) {
                if (to.name != _name) {
                    this.$destroy()
                }
            },

            'listQuery.name': function () {
                this.handleFilter()
            },

            'listQuery.domain': function () {
                this.handleFilter()
            },

            'listQuery.tag': function () {
                this.handleFilter()
            },
            'listQuery.matchRule': function () {
                this.handleFilter()
            },

            'listQuery.urlPattern': function () {
                this.handleFilter()
            }
        },
        computed: {},
        methods: {
            //
            getList() {
                this.listLoading = true
                apiApi.getAllData().then((data) => {
                    this.updateList(data)
                }).catch(() => {
                    this.listLoading = false
                })
            },

            //
            updateList(data) {
                this.dataList = data || []
                this.pageInfo.totalSize = this.dataList.length
                this.listLoading = false
                this.updateShowList()
            },

            handleFilter() {
                this.listQuery.page = 1
                this.updateShowList()
            },

            updateShowList() {
                var tempFilterSearchList = []
                var tempShowList = []

                // 搜索操作
                this.dataList.forEach((item, index) => {
                    var searchName = this.listQuery.name
                    var searchDomain = this.listQuery.domain
                    var searchTag = this.listQuery.tag
                    var searchMatchRule = this.listQuery.matchRule
                    var searchUrlPattern = this.listQuery.urlPattern
                    var filterSearch = true

                    // name
                    if (searchName) {
                        filterSearch = searchInclude(item.name, searchName)
                    }

                    // domain
                    if (filterSearch && searchDomain) {
                        filterSearch = searchInclude(item.domain, searchDomain)
                    }

                    if (filterSearch && searchUrlPattern) {
                        filterSearch = searchInclude(item.urlPattern, searchUrlPattern)
                    }

                    // tag
                    if (filterSearch && searchTag) {
                        if (item.tags && item.tags.length > 0) {
                            for (var i = 0, len = item.tags.length; i < len; i++) {
                                var tempTag = item.tags[i] || {}
                                filterSearch = searchInclude(tempTag.name, searchTag) || searchInclude(tempTag.value, searchTag)
                            }
                        }
                    }

                    if (filterSearch && searchMatchRule !== -1) {
                        filterSearch = item.matchRule === searchMatchRule
                    }


                    if (filterSearch) {
                        tempFilterSearchList.push(item)
                    }
                })

                //  分页操作
                tempFilterSearchList.forEach((item, index) => {
                    item = item || {}
                    var currentPage = this.listQuery.page
                    var pageCount = this.listQuery.size
                    var number = index // 当前的编号
                    var maxSize = currentPage * pageCount
                    var minSize = maxSize - pageCount
                    var filterPage = true

                    filterPage = number >= minSize && number < maxSize

                    if (filterPage) {
                        tempShowList.push(item)
                    }
                })


                this.showList = tempShowList
                this.pageInfo.totalSize = tempFilterSearchList.length
            },

            //
            handleSizeChange(size) {
                this.listQuery.size = size
                this.listQuery.page = 1
                this.updateShowList()
            },

            //
            handleCurrentChange(page) {
                this.listQuery.page = page
                this.updateShowList()
            },

            //
            handleCreate() {
                this.$router.push({path: '/api/new'})
            },
            //
            handleShow(item) {
                this.$router.push({path: '/api/show', query: {id: item.id}})
            },
            //
            handleUpdate(item) {
                this.$router.push({path: '/api/edit', query: {id: item.id}})
            },

            //
            handleDelete(item) {
                let id = item.id
                this.$confirm('是否删除该API？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this._doDeleteItem(id)
                })
            },

            //
            toggleStatus(item) {
                let status = item.status
                let _newItem = clone(item)

                if (status == 1) {
                    this.$confirm('是否禁用该API？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        _newItem.status = 0
                        this._doUpdateItemStatus(_newItem, false)
                    })
                } else {
                    _newItem.status = 1
                    this._doUpdateItemStatus(_newItem, true)
                }
            },

            //
            _doUpdateItemStatus(item, status) {
                const message = status ? '启用成功' : '禁用成功';
                apiApi.updateItem(item).then(() => {
                    this.$message({
                        type: 'success',
                        message: message
                    })
                    this.getList()
                }).catch(() => {

                })
            },

            //
            _doDeleteItem(id) {
                if (!id) {
                    return
                }
                //
                apiApi.deleteItem(id).then((data) => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    this.getList()
                })
            }
        }
    }
</script>

<style scoped>

</style>
