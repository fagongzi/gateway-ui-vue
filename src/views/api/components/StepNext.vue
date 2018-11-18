<template>
    <div class="app-container">
        <div class="grid-content el-margin-bottom" v-for="(item,index) in tempItem.nodes">
            <el-card class="box-card">
                <div class="title_t">接口 {{ index+1 }}
                    <a style="float: right;font-size: 12px;color: #999999;cursor: pointer"
                       @click="removeNode(index)">移除节点</a>
                </div>
                <el-form label-width="150px">
                    <el-form-item label="集群:" class="inline-item is-required">
                        <el-select v-model.number="item.clusterID" style="width: 200px">
                            <el-option v-for="(item2,index2) in clusterList" :label="item2.name"
                                       :value="item2.id" :key="item2.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="节点标示名:" class="inline-item is-required">
                        <el-input style="width: 200px" v-model="item.attrName" placeholder="例如：user"></el-input>
                    </el-form-item>
                    <el-form-item label="url重写规则:" class="inline-item is-required">
                        <el-input style="width: 200px" v-model="item.urlRewrite"
                                  placeholder="例如：/users?id=$1"></el-input>
                    </el-form-item>
                    <el-form-item label="写超时:" class="inline-item is-required">
                        <el-input style="width: 200px" v-model.number="item.writeTimeout"
                                  placeholder="单位：ms"></el-input>
                    </el-form-item>
                    <el-form-item label="读超时:" class="inline-item is-required">
                        <el-input style="width: 200px" v-model.number="item.readTimeout" placeholder="单位：ms"></el-input>
                    </el-form-item>
                    <el-form-item label="batchIndex:" class="inline-item is-required">
                        <el-input style="width: 200px" v-model.number="item.batchIndex" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="http默认值:" class="form-item-block">
                        <el-row :gutter="10">
                            <el-col :span="4">
                                <label for="">开关：
                                    <el-switch v-model="item.useDefault" active-color="#13ce66"
                                               inactive-color="#f1f1f1"></el-switch>
                                </label>

                                <el-tooltip class="item" effect="dark" placement="top-start">
                                    <div slot="content">当该值为True且DefaultValue存在时，直接使用DefaultValue作为返回值。</div>
                                    <i style="margin-left: 10px;color: #909399;" class="el-icon-info"></i>
                                </el-tooltip>
                            </el-col>
                            <el-col :span="6">
                                <label for=""> <span class="red-icon">*</span>状态码：
                                    <el-input style="width: 65%" v-model="item.defaultValue.code"
                                              placeholder="200，404，500"></el-input>
                                </label>

                            </el-col>
                            <el-col :span="10">
                                <label for="">body 内容：
                                    <el-input style="width: 65%" v-model="item.defaultValue.body"
                                              placeholder="body 内容"></el-input>
                                </label>
                            </el-col>
                        </el-row>
                        <el-row class="el-margin-top">
                            <el-col :span="3" style="padding-right: 8px;text-align: right"><label for="">head头部:</label>
                            </el-col>
                            <el-col :span="20">
                                <template v-for="(head,index) in item.defaultValue.headers">
                                    <el-row class="el-margin-bottom">
                                        <el-col :span="8">
                                            <el-input v-model="head.name" placeholder="键"></el-input>
                                        </el-col>
                                        <el-col :span="1" style="text-align: center">=</el-col>
                                        <el-col :span="8">
                                            <el-input v-model="head.value" placeholder="值"></el-input>
                                        </el-col>
                                        <el-col v-if="index === 0" :span="1" style="text-align: center">
                                                <span title="添加" @click="addNodeDefaultValueItem(item,'head')"
                                                      style="cursor: pointer"
                                                      class="el-icon-circle-plus-outline"></span>
                                        </el-col>
                                        <el-col v-if="index > 0" :span="1"
                                                style="text-align: center">
                                                <span title="删除"
                                                      @click="removeNodeDefaultValueItem(item,'head',index)"
                                                      style="cursor: pointer" class="el-icon-remove-outline"></span>
                                        </el-col>
                                    </el-row>
                                </template>
                            </el-col>
                        </el-row>
                        <el-row class="el-margin-top">
                            <el-col :span="3" style="padding-right: 8px;text-align: right"><label
                                    for="">cookie内容:</label></el-col>
                            <el-col :span="20">
                                <template v-for="(cookie,index) in item.defaultValue.cookies">
                                    <el-row class="el-margin-bottom">
                                        <el-col :span="8">
                                            <el-input v-model="cookie.name" placeholder="键"></el-input>
                                        </el-col>
                                        <el-col :span="1" style="text-align: center">=</el-col>
                                        <el-col :span="8">
                                            <el-input v-model="cookie.value" placeholder="值"></el-input>
                                        </el-col>
                                        <el-col v-if="index === 0" :span="1" style="text-align: center">
                                                <span title="添加" @click="addNodeDefaultValueItem(item,'cookie')"
                                                      style="cursor: pointer"
                                                      class="el-icon-circle-plus-outline"></span>
                                        </el-col>
                                        <el-col v-if="index > 0" :span="1"
                                                style="text-align: center">
                                                <span title="删除"
                                                      @click="removeNodeDefaultValueItem(item,'cookie',index)"
                                                      style="cursor: pointer" class="el-icon-remove-outline"></span>
                                        </el-col>
                                    </el-row>
                                </template>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="retryStrategy:" class="form-item-block">
                        <div v-show="item.needRetryStrategy">
                            <el-row :gutter="10">
                                <el-col :span="6">
                                    <label for=""><span class="red-icon">*</span>interval:
                                        <el-input style="width: 70%" v-model.number="item.retryStrategy.interval"
                                                  placeholder=""></el-input>
                                    </label>
                                </el-col>
                                <el-col :span="8">
                                    <label for=""><span class="red-icon">*</span>maxTimes:
                                        <el-input style="width: 60%" v-model.number="item.retryStrategy.maxTimes"
                                                  placeholder="maxTimes"></el-input>
                                    </label>
                                </el-col>
                                <el-col :span="8">
                                    <label for="">codes:
                                        <el-input style="width: 70%" v-model="item.retryStrategy.codesStr"
                                                  placeholder="多个的情况用逗号分隔"></el-input>
                                        <el-tooltip class="item" effect="dark" placement="top-start">
                                            <div slot="content">存在多个code 的情况，用英文逗号“,”分隔</div>
                                            <i style="margin-left: 10px;color: #909399;" class="el-icon-info"></i>
                                        </el-tooltip>
                                    </label>
                                </el-col>
                            </el-row>
                            <el-button type="text" @click="item.needRetryStrategy = false">移除retryStrategy</el-button>

                        </div>
                        <el-button type="text" v-show="!item.needRetryStrategy" @click="item.needRetryStrategy = true">
                            添加retryStrategy
                        </el-button>

                    </el-form-item>
                    <el-form-item label="cache:" class="form-item-block">
                        <div v-show="item.needCache">
                            <el-row :gutter="10" style="overflow: hidden">
                                <el-col :span="3" style="text-align: right"><label for=""><span
                                        class="red-icon">*</span>deadline:</label>
                                </el-col>
                                <el-col :span="6">
                                    <el-date-picker
                                            v-model="item.cache.deadline"
                                            type="datetime"
                                            value-format="timestamp"
                                            placeholder="选择日期时间">
                                    </el-date-picker>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10" style="margin-top: 10px">
                                <el-col :span="3" style="text-align: right"><label for=""><span
                                        class="red-icon">*</span>keys:</label>
                                </el-col>
                                <el-col :span="21">
                                    <template v-for="(key,index) in item.cache.keys">
                                        <el-row class="el-margin-bottom" :gutter="10">
                                            <el-col :span="6">
                                                <el-input v-model="key.name" placeholder="name"></el-input>
                                            </el-col>
                                            <el-col :span="6" style="text-align: center">
                                                <el-select v-model="key.source" placeholder="请选择参数数据源">
                                                    <el-option v-for="(item2,index2) in sourceConstant"
                                                               :label="item2.title"
                                                               :value="item2.value" :key="item2.value"></el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-input v-model.number="key.index" placeholder="index"></el-input>
                                            </el-col>
                                            <el-col v-if="index === 0" :span="1" style="text-align: center">
                                                <span title="添加" @click="addNodeCacheKeyItem(item.cache)"
                                                      style="cursor: pointer"
                                                      class="el-icon-circle-plus-outline"></span>
                                            </el-col>
                                            <el-col v-if="index > 0" :span="1"
                                                    style="text-align: center">
                                                <span title="删除"
                                                      @click="removeNodeCacheKeyItem(item.cache,index)"
                                                      style="cursor: pointer" class="el-icon-remove-outline"></span>
                                            </el-col>
                                        </el-row>
                                    </template>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10" style="margin-top: 10px">
                                <el-col :span="3" style="text-align: right"><label for=""><span
                                        class="red-icon">*</span>conditions:</label>
                                </el-col>
                                <el-col :span="21">
                                    <template v-for="(condition,index) in item.cache.conditions">
                                        <el-row class="el-margin-bottom" :gutter="10">
                                            <el-col :span="4">
                                                <el-input v-model="condition.parameter.name"
                                                          placeholder="name"></el-input>
                                            </el-col>
                                            <el-col :span="4">
                                                <el-select v-model="condition.parameter.source" placeholder="请选择参数数据源">
                                                    <el-option v-for="(item2,index2) in sourceConstant"
                                                               :label="item2.title"
                                                               :value="item2.value" :key="item2.value"></el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="4">
                                                <el-input v-model.number="condition.parameter.index"
                                                          placeholder="index"></el-input>
                                            </el-col>
                                            <el-col :span="4">
                                                <el-select v-model="condition.cmp" placeholder="操作符">
                                                    <el-option v-for="(item2,index2) in cmpConstant"
                                                               :label="item2.title"
                                                               :value="item2.value" :key="item2.value"></el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="4">
                                                <el-input v-model="condition.expect" placeholder="expect"></el-input>
                                            </el-col>
                                            <el-col v-if="index === 0" :span="1" style="text-align: center">
                                                <span title="添加" @click="addNodeCacheConditionItem(item.cache)"
                                                      style="cursor: pointer"
                                                      class="el-icon-circle-plus-outline"></span>
                                            </el-col>
                                            <el-col v-if="index > 0" :span="1"
                                                    style="text-align: center">
                                                <span title="删除"
                                                      @click="removeNodeCacheConditionItem(item.cache,index)"
                                                      style="cursor: pointer" class="el-icon-remove-outline"></span>
                                            </el-col>
                                        </el-row>
                                    </template>
                                </el-col>
                            </el-row>
                            <el-button type="text" @click="item.needCache = false">移除cache</el-button>
                        </div>
                        <el-button type="text" v-show="!item.needCache" @click="item.needCache = true">添加cache
                        </el-button>
                    </el-form-item>
                    <el-form-item label="validations:" class="form-item-block">
                        <div v-show="item.needValidations">
                            <template v-for="(validation,index) in item.validations">
                                <div style="overflow: hidden">
                                    <el-row :gutter="10">
                                        <el-col :span="4">
                                            <el-input v-model="validation.parameter.name" placeholder="name"></el-input>
                                        </el-col>
                                        <el-col :span="4">
                                            <el-select v-model="validation.parameter.source" placeholder="请选择参数数据源">
                                                <el-option v-for="(item2,index2) in sourceConstant"
                                                           :label="item2.title"
                                                           :value="item2.value" :key="item2.value"></el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="4">
                                            <el-input v-model.number="validation.parameter.index"
                                                      placeholder="index"></el-input>
                                        </el-col>
                                        <el-col :span="4">
                                            <el-input v-model="validation.rules[0].expression"
                                                      placeholder="expression"></el-input>
                                        </el-col>
                                        <el-col :span="4">
                                            <el-checkbox-group v-model="validation.required"
                                                               style="color: #666666;float: left">
                                                <el-checkbox label="是否必须" name="type"></el-checkbox>
                                            </el-checkbox-group>
                                        </el-col>
                                        <el-col v-if="index === 0" :span="1" style="text-align: center">
                                                <span title="添加" @click="addNodeValidationItem(item.validations)"
                                                      style="cursor: pointer"
                                                      class="el-icon-circle-plus-outline"></span>
                                        </el-col>
                                        <el-col v-if="index > 0" :span="1"
                                                style="text-align: center">
                                                <span title="删除"
                                                      @click="removeNodeValidationItem(item.validations,index)"
                                                      style="cursor: pointer" class="el-icon-remove-outline"></span>
                                        </el-col>
                                    </el-row>
                                </div>
                            </template>
                            <el-button type="text" @click="item.needValidations = false">移除validations</el-button>
                        </div>
                        <el-button type="text" v-show="!item.needValidations" @click="item.needValidations = true">
                            添加validations
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <el-button type="primary" @click="addNode">添加节点</el-button>
    </div>
</template>

<script>

    import {
        RULE_TYPE_OBJECT,
        SOURCE_ARRAY,
        CMP_ARRAY
    } from '~/constant/constant';
    import {extend, clone, extendByTarget} from "~/utils";
    import * as clusterApi from '~/api/cluster';

    function _getNodeTempValidation() {
        return {
            parameter: {
                name: '',
                source: '',
                index: ''
            },
            required: false,
            rules: [
                {
                    ruleType: RULE_TYPE_OBJECT.ruleRegexp,
                    expression: ''
                }
            ]
        };
    }

    function _getNodeCacheKeyItem() {
        return {
            name: '',
            source: '',
            index: undefined
        }
    }

    function _getNodeCacheConditionItem() {
        return {
            cmp: '',
            expect: '',
            parameter: {
                name: '',
                source: '',
                index: undefined
            }
        }
    }

    function _getNodeTempItem() {
        var _validationTemp = _getNodeTempValidation();
        const _tempItem = {
            clusterID: '', //
            urlRewrite: '',
            attrName: '',
            useDefault: true,
            batchIndex: undefined,
            writeTimeout: '',
            readTimeout: '',
            validations: [
                _validationTemp
            ],
            cache: {
                keys: [
                    _getNodeCacheKeyItem()
                ],
                deadline: '',
                conditions: [
                    _getNodeCacheConditionItem()
                ]
            },
            //
            defaultValue: {
                code: 200,
                body: '',
                headers: [
                    {name: '', value: ''}
                ],
                cookies: [
                    {name: '', value: ''}
                ]
            },

            retryStrategy: {
                interval: '',
                maxTimes: '',
                codes: [],
                codesStr: ''
            },

            needValidations: false,
            needCache: false,
            needRetryStrategy: false
        };

        return _tempItem;
    }

    export default {
        name: "stepNext",
        props: {
            editItem: {
                type: Object,
            },
            doValidate: {
                type: Boolean
            }
        },
        data() {
            return {
                tempItem: {
                    nodes: []
                },
                sourceConstant: SOURCE_ARRAY,
                cmpConstant: CMP_ARRAY,
                rules: {},
                clusterList: [], //

            }
        },
        created() {
            this.init();
        },
        watch: {
            //
            'editItem': function (newValue, oldValue) {
                newValue = newValue || {};
                var tempNodes = [];
                newValue.nodes && newValue.nodes.forEach((item) => {
                    var tempNode = extendByTarget(_getNodeTempItem(), clone(item));
                    if (tempNode.retryStrategy && tempNode.retryStrategy.interval) {
                        tempNode.needRetryStrategy = true;
                        tempNode.retryStrategy.codesStr = tempNode.retryStrategy.codes && tempNode.retryStrategy.codes.join(',');
                    }
                    if (tempNode.cache && tempNode.cache.deadline) {
                        tempNode.needCache = true;
                    }
                    if (tempNode.validations && tempNode.validations.length > 0) {
                        var tempItem = tempNode.validations[0];
                        if (tempItem.parameter && tempItem.parameter.name) {
                            tempNode.needValidations = true;
                        }
                    }
                    tempNodes.push(tempNode);
                });

                this.tempItem.nodes = tempNodes;
            },

            'doValidate': function (newValue, oldValue) {
                if (newValue) {
                    this.submitForm();
                }
                else {
                    this.clearValidate();
                }
            }

        },
        methods: {
            init() {
                // 拉取 cluster list
                clusterApi.getList().then((data) => {
                    this.clusterList = data;
                });
            },

            submitForm() {
                var _tempItemResult = this._formatFormData();
                var _tempItem = _tempItemResult.result;
                var result = _tempItemResult.isError;
                this.$emit('submitFormStep', result, _tempItem);
            },

            _formatFormData() {
                var _tempItem = clone(this.tempItem);
                var result = {
                    nodes: []
                };
                var isError = false;

                for (var i = 0, len = _tempItem.nodes.length; i < len; i++) {
                    var _node = _tempItem.nodes[i];
                    var _msg = `接口${i + 1}: `;
                    if (!_node.clusterID) {
                        this._showMessage(_msg + '请选择集群');
                        isError = true;
                        break;
                    }

                    if (!_node.attrName) {
                        this._showMessage(_msg + '请填写节点名称');
                        isError = true;
                        break;
                    }

                    if (!_node.urlRewrite) {
                        this._showMessage(_msg + '请填写url重写规则');
                        isError = true;
                        break;
                    }


                    if (!_node.writeTimeout) {
                        this._showMessage(_msg + '请填写写超时时间');
                        isError = true;
                        break;
                    }

                    if (!_node.readTimeout) {
                        this._showMessage(_msg + '请填写读超时时间');
                        isError = true;
                        break;
                    }


                    if (!_node.batchIndex) {
                        this._showMessage(_msg + '请填写batchIndex');
                        isError = true;
                        break;
                    }

                    //
                    if (_node.needRetryStrategy) {
                        if (!_node.retryStrategy.interval) {
                            this._showMessage(_msg + '请填写retryStrategy的interval字段');
                            isError = true;
                            break;
                        }
                        if (!_node.retryStrategy.maxTimes) {
                            this._showMessage(_msg + '请填写retryStrategy的maxTimes字段');
                            isError = true;
                            break;
                        }

                        if (_node.retryStrategy.codesStr) {
                            var tempNodes = _node.retryStrategy.codesStr.split(',');
                            _node.retryStrategy.codes = tempNodes.map((item) => {
                                return parseInt(item, 10);
                            });

                            delete _node.retryStrategy.codesStr;
                        }
                    }
                    else {
                        delete _node.retryStrategy;
                    }

                    if (_node.needCache) {
                        if (!_node.cache.deadline) {
                            this._showMessage(_msg + '请填写cache的deadline字段');
                            isError = true;
                            break;
                        }

                    }
                    else {
                        delete _node.cache;
                    }

                    if (_node.needValidations) {

                    }
                    else {
                        delete _node.validations;
                    }

                    delete _node.needValidations;
                    delete _node.needCache;
                    delete _node.needRetryStrategy;
                    result.nodes.push(_node);
                }

                return {
                    isError: isError,
                    result: result
                };
            },

            _showMessage(msg) {
                this.$message({
                    type: 'warning',
                    message: msg
                });
            },


            addNodeDefaultValueItem(node, type) {
                var tempItem = {name: '', value: ''};
                if (type === 'head') {
                    node.defaultValue.headers.push(tempItem);
                }
                else if (type === 'cookie') {
                    node.defaultValue.cookies.push(tempItem);
                }
            },

            addNodeCacheKeyItem(node) {
                var _temp = _getNodeCacheKeyItem();
                node.keys.push(_temp);
            },


            removeNodeCacheKeyItem(node, index) {
                this.$confirm('是否确定移除?', '移除操作', {
                    confirmButtonText: '确定',
                    confirmButtonClass: 'el-button--danger',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    node.keys.splice(index, 1);
                }).catch(() => {
                });
            },

            addNodeCacheConditionItem(node) {
                var _temp = _getNodeCacheConditionItem();
                node.conditions.push(_temp);
            },

            removeNodeCacheConditionItem(node, index) {
                this.$confirm('是否确定移除?', '移除操作', {
                    confirmButtonText: '确定',
                    confirmButtonClass: 'el-button--danger',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    node.conditions.splice(index, 1);
                }).catch(() => {
                });
            },

            addNodeValidationItem(list) {
                var _temp = _getNodeTempValidation();
                list.push(_temp);
            },

            removeNodeValidationItem(list, index) {
                this.$confirm('是否确定移除?', '移除操作', {
                    confirmButtonText: '确定',
                    confirmButtonClass: 'el-button--danger',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    list.splice(index, 1);
                }).catch(() => {
                });
            },

            addNode() {
                var _temp = _getNodeTempItem();
                this.tempItem.nodes.push(_temp);
            },

            removeNode(index) {
                this.$confirm('是否确定移除?', '移除操作', {
                    confirmButtonText: '确定',
                    confirmButtonClass: 'el-button--danger',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tempItem.nodes.splice(index, 1);
                }).catch(() => {
                });
            },


            removeNodeDefaultValueItem(node, type, index) {
                this.$confirm('是否确定移除?', '移除操作', {
                    confirmButtonText: '确定',
                    confirmButtonClass: 'el-button--danger',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (type === 'head') {
                        node.defaultValue.headers.splice(index, 1);
                    }
                    if (type === 'cookie') {
                        node.defaultValue.cookies.splice(index, 1);
                    }
                }).catch(() => {
                });
            },

            needNodeDefaultValueDeleteShow(item) {
                return this.needDefaultValueDeleteShow(item);
            },

            needDefaultValueDeleteShow(item) {
                item = item || {};
                return item.name !== '' || item.value !== '';
            },

            clearValidate() {
                // this.$refs['dataForm'].clearValidate();
            }
        }
    }
</script>

<style scoped>
    .el-margin-top {
        margin-top: 10px;
    }

    .el-margin-bottom {
        margin-bottom: 10px;
    }

    .inline-item {
        display: inline-block;
    }

    .form-item-block {
        border: 1px solid #ebeef5;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        padding: 10px 5px;
    }

    .red-icon {
        color: #f56c6c;
        margin-right: 4px;
    }
</style>
