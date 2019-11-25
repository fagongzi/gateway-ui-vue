<template>
    <div>
        <el-form :rules="rules" ref="dataForm" :model="tempItem" label-width="150px" v-loading="loading">
            <el-form-item label="名称" prop="name">
                <span v-if="isShow">{{tempItem.name}}</span>
                <el-input v-else v-model="tempItem.name" style="width: 200px" placeholder='路由名称'></el-input>
            </el-form-item>
            <el-form-item label="绑定到的集群" prop="clusterID">
                <span v-if="isShow">{{tempItem.clusterName}}</span>
                <template v-else>
                    <el-select v-model.number="tempItem.clusterID" placeholder="选择绑定到的集群">
                        <el-option v-for="(item2,index2) in clusterList" :label="item2.name"
                                   :value="item2.id" :key="item2.id"></el-option>
                    </el-select>
                </template>
            </el-form-item>
            <el-form-item label="绑定到的接口" prop="api">
                <span v-if="isShow">{{tempItem.apiName}}</span>
                <template v-else>
                    <el-select v-model="tempItem.api" placeholder="绑定到的接口" style="width: 200px">
                        <el-option v-for="item in apiList" :key="item.id" :value="item.id"
                                   :label="item.name">
                        </el-option>
                    </el-select>
                </template>
            </el-form-item>
            <el-form-item label="路由策略">
                <span v-if="isShow">{{tempItem.strategy}}</span>
                <template v-else>
                    <el-select v-model.number="tempItem.strategy" placeholder="选择路由策略" style="width: 200px">
                        <el-option v-for="item in routingStrategyConstant" :key="item.value" :value="item.value"
                                   :label="item.title">
                        </el-option>
                    </el-select>
                </template>
            </el-form-item>
            <el-form-item label="路由流量的比例" prop="trafficRate">
                <span v-if="showType == 'show'">{{tempItem.trafficRate}}</span>
                <el-input v-else v-model.number="tempItem.trafficRate" style="width: 200px"
                          placeholder='例如：50'></el-input>
            </el-form-item>

            <el-form-item label="路由匹配条件">
                <template v-if="tempItem.conditions && tempItem.conditions.length > 0">
                    <el-table :data="tempItem.conditions" border style="width:900px">
                        <el-table-column label="数据源">
                            <template slot-scope="scope">
                                <span>{{scope.row.parameter.source | sourceFilter}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="关键词">
                            <template slot-scope="scope">
                                <span>{{scope.row.parameter.name}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column label="路径Index">
                            <template slot-scope="scope">
                                <span>{{scope.row.parameter.index}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作符">
                            <template slot-scope="scope">
                                <span>{{scope.row.cmp | cmpFilter}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="填写表达式">
                            <template slot-scope="scope">
                                <span>{{scope.row.expect}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="150" v-if="!isShow">
                            <template slot-scope="scope">
                                <el-button type="text" size="mini"
                                           @click="handleUpdateCondition(scope.row,scope.$index)">修改
                                </el-button>
                                <el-button type="text" size="mini"
                                           @click="handleDeleteCondition(scope.row,scope.$index)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button type="text" v-if="!isShow" @click="handleCreateCondition">新增匹配条件
                    </el-button>
                </template>

                <template v-else>
                    <el-button type="text" v-if="!isShow" @click="handleCreateCondition">新增匹配条件
                    </el-button>
                </template>
            </el-form-item>

            <el-form-item label="路由状态">
                <el-switch :disabled="isShow" v-model="tempItem.status" active-color="#13ce66"
                           inactive-color="#f1f1f1"></el-switch>
                <el-tooltip class="item" effect="dark" placement="top-start" v-show="!isShow">
                    <div slot="content">只有开关开着，路由才能生效。</div>
                    <i style="margin-left: 10px;color: #909399;" class="el-icon-info"></i>
                </el-tooltip>
            </el-form-item>

            <div style="margin-left: 70px">
                <el-button @click="goList">返回</el-button>
                <el-button type="primary" v-if="isShow" @click="goEdit()">编辑</el-button>
                <el-button v-if="isCreate" :loading="submitting" type="primary" @click="createItem('dataForm')">提交
                </el-button>
                <el-button v-else-if="isUpdate" :loading="submitting" type="primary" @click="updateItem('dataForm')">提交
                </el-button>
            </div>
        </el-form>


        <el-dialog :title="dialogStatusTitle" :visible.sync="dialogFormVisible" :close-on-click-modal='false'>
            <el-form ref="dataFormCondition" :rules="rules2" :model="tempCondition" :inline="true">
                <el-form-item label="数据源" style="width: 150px">
                    <el-select v-model="tempCondition.parameter.source" placeholder="placeholder">
                        <el-option
                                v-for="item in sourceConstant"
                                :key="item.value"
                                :label="item.title"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width: 150px" label="关键词" v-if="tempCondition.parameter.source != 5">
                    <el-input v-model="tempCondition.parameter.name"></el-input>
                </el-form-item>
                <el-form-item style="width: 150px" label="路径Index" v-else>
                    <el-input v-model.number="tempCondition.parameter.index" style="width: 80%"></el-input>
                    <el-tooltip class="item" effect="dark" placement="top-start">
                        <div slot="content">
                            http://example.com/path1/path2/path3?xxx=aa,填写1匹配path1，2匹配path2，3匹配path3
                        </div>
                        <i style="margin-left: 10px;color: #909399;"
                           class="el-icon-info"></i>
                    </el-tooltip>
                </el-form-item>
                <el-form-item style="width: 100px" label="操作符">
                    <el-select v-model="tempCondition.cmp" placeholder="操作符">
                        <el-option
                                v-for="item in cmpConstant"
                                :key="item.value"
                                :label="item.title"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width: 200px" label="表达式">
                    <el-input v-model="tempCondition.expect" placeholder="placeholder"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary"
                           @click="createItemCondition('dataFormCondition')">
                    提交
                </el-button>
                <el-button v-if="dialogStatus=='update'" type="primary"
                           @click="updateItemCondition('dataFormCondition')">
                    提交
                </el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import * as routingApi from '~/api/routing';
    import * as clusterApi from '~/api/cluster';
    import * as apiApi from '~/api/api';

    import {clone, extend, getItemById, extendByTarget} from "~/utils";
    import {
        STATUS_OBJECT,
        FORM_OBJECT,
        FORM_OBJECT_TIPS,
        STRATEGY_OBJECT,
        STRATEGY_ARRAY,
        CMP_OBJECT,
        CMP_ARRAY,
        SOURCE_ARRAY
    } from "~/constant/constant";

    function _getConditionItem() {
        return {
            parameter: {
                name: '',
                source: '',
                index: ''
            },
            cmp: '',
            expect: ''
        }
    }

    function _getTempItem() {
        return {
            id: undefined,
            name: '',
            clusterID: undefined,
            api: undefined,
            conditions: [],
            strategy: STRATEGY_OBJECT.split, //
            trafficRate: undefined,
            status: true
        }
    }

    export default {
        name: "routingForm",
        props: {
            showType: {
                type: String,
                default: FORM_OBJECT.create
            },
            editItem: {
                type: Object,
            }
        },
        data() {
            return {
                loading: true,
                submitting: false,
                rules: {
                    name: [{required: true, message: '请填写名称', trigger: 'change'}],
                    clusterID: [{required: true, message: '请选择cluster', trigger: 'change'}],
                    api: [{required: true, message: '请选择Api', trigger: 'change'}],
                    // conditions: [{type: 'array', required: true, message: '请填写表达式', trigger: 'change'}],
                    trafficRate: [
                        {required: true, message: '请填写trafficRate', trigger: 'change'},
                        {type: 'number', message: '请输入数字', trigger: 'change'}
                    ]
                },
                rules2: {},
                tempItem: _getTempItem(),
                routingStrategyConstant: STRATEGY_ARRAY,
                clusterList: [],
                apiList: [],
                cmpConstant: CMP_ARRAY,
                sourceConstant: SOURCE_ARRAY,
                tempCondition: _getConditionItem(),
                tempConditionIndex: -1,//
                dialogFormVisible: false,
                dialogStatus: FORM_OBJECT.create,

            }
        },

        computed: {
            isShow() {
                return this._isShow();
            },

            isCreate() {
                return this._isCreate();
            },
            isUpdate() {
                return this._isUpdate();
            },
            dialogStatusTitle() {
                return FORM_OBJECT_TIPS[this.dialogStatus];
            }
        },

        created() {
            this.init();
        },

        watch: {
            //
            'editItem': function (newValue, oldValue) {
                this.tempItem = extendByTarget(this.tempItem, clone(newValue));
                this.tempItem.status = this.tempItem.status == STATUS_OBJECT.up ? true : false;
                this.tempItem.conditions = this.tempItem.conditions || [];
                this.loading = false;
                this.submitting = false;
                this.initShow();
            }
        },

        methods: {
            init() {
                if (this._isShow()) {
                    this.rules = {};
                } else if (this._isCreate()) {
                    this.loading = false;
                }

                clusterApi.getAllData().then((data) => {
                    this.clusterList = data;
                    this.initShow();
                });

                apiApi.getAllData().then((data) => {
                    this.apiList = data;
                    this.initShow();
                });
            },

            initShow() {
                if (this._isShow()) {
                    var temp = getItemById(this.clusterList, this.tempItem.clusterID);
                    if (temp) {
                        this.$set(this.tempItem, 'clusterName', temp.name);
                    }

                    var temp2 = getItemById(this.apiList, this.tempItem.api);
                    if (temp2) {
                        this.$set(this.tempItem, 'apiName', temp2.name);
                    }

                }
            },

            goList() {
                this.$router.replace({path: '/routing'});
                this.$destroy();
            },

            goEdit() {
                this.$router.push({path: '/routing/edit', query: {id: this.tempItem.id}});
            },

            createItem(dataForm) {
                if (this.submitting) {
                    return;
                }
                this.$refs[dataForm].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this._doCreateItem();
                })
            },

            //
            _doCreateItem() {
                var item = clone(this.tempItem);
                item.status = item.status ? STATUS_OBJECT.up : STATUS_OBJECT.down;
                this.submitting = true;
                routingApi.updateItem(item).then(() => {
                    this.$message({
                        type: 'success',
                        message: '创建成功!'
                    });
                    setTimeout(() => {
                        this.goList();
                    }, 2000);
                }).catch(() => {
                    this.submitting = false;
                });
            },

            updateItem(dataForm) {
                if (this.submitting) {
                    return;
                }
                this.$refs[dataForm].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this._doUpdateItem();
                })
            },

            _doUpdateItem() {
                var item = clone(this.tempItem);
                item.status = item.status ? STATUS_OBJECT.up : STATUS_OBJECT.down;
                this.submitting = true;
                routingApi.updateItem(item).then(() => {
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                    setTimeout(() => {
                        this.goList();
                    }, 2000);
                }).catch(() => {
                    this.submitting = false;
                });
            },

            handleCreateCondition() {
                this.initTempCondition();
                this.dialogStatus = FORM_OBJECT.create;
                this.dialogFormVisible = true;

                this.$nextTick(() => {
                    this.$refs['dataFormCondition'].clearValidate()
                })
            },

            handleDeleteCondition(item, index) {
                let that = this;
                this.$confirm('是否删除该表达式？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    _delete();
                });

                function _delete() {
                    that.tempItem.conditions.splice(index, 1);
                }
            },

            handleUpdateCondition(item, index) {
                this.initTempCondition();
                this.tempCondition = clone(item);
                this.dialogFormVisible = true;
                this.dialogStatus = FORM_OBJECT.update;
            },

            createItemCondition(dataForm) {
                this.$refs[dataForm].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    let tempItem = clone(this.tempCondition);
                    if (tempItem.parameter.source == 5) {
                        tempItem.parameter.name = ''
                    } else {
                        tempItem.parameter.index = 0
                    }
                    this.tempItem.conditions.push(tempItem);
                    this.dialogFormVisible = false;
                    this.initTempCondition();
                });
            },

            updateItemCondition(dataForm) {
                this.$refs[dataForm].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    let tempItem = clone(this.tempCondition);
                    if (tempItem.parameter.source == 5) {
                        tempItem.parameter.name = ''
                    } else {
                        tempItem.parameter.index = 0
                    }
                    this.tempItem.conditions.splice(this.tempConditionIndex, 1, tempItem);
                    this.initTempCondition();
                    this.dialogFormVisible = false;
                });
            },

            initTempCondition() {
                this.tempCondition = _getConditionItem();
            },


            _isUpdate() {
                return this.showType === FORM_OBJECT.update;
            },

            _isShow() {
                return this.showType === FORM_OBJECT.show;
            },

            _isCreate() {
                return this.showType === FORM_OBJECT.create;
            }
        }
    }
</script>

<style scoped>

    .el-margin-bottom {
        margin-bottom: 10px;
    }
</style>
