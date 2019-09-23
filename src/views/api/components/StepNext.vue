<template>
    <div class="app-container">
        <div class="grid-content el-margin-bottom" v-for="(item,index) in tempItem.nodes">
            <el-card class="box-card">
                <div class="title_t">接口 {{ index+1 }}
                    <a style="float: right;font-size: 12px;color: #999999;cursor: pointer"
                       @click="removeNode(index)">移除节点</a>
                </div>
                <el-form label-width="120px">
                    <!---->
                    <el-form-item label="集群:" class="inline-item is-required">
                        <el-select v-model.number="item.clusterID" style="width: 230px">
                            <el-option v-for="(item2,index2) in clusterList" :label="item2.name"
                                       :value="item2.id" :key="item2.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <!---->
                    <el-form-item label="写超时:" class="inline-item">
                        <div>
                            <el-select v-model="item.writeTimeoutType" placeholder="请选择"
                                       style="width: 100px">
                                <el-option v-for="tempTime in timeTypeDefaultConstant" :key="tempTime.value"
                                           :value="tempTime.value"
                                           :label="tempTime.title"></el-option>
                            </el-select>
                            <el-input style="width: 130px" v-model.number="item.writeTimeout"
                                      placeholder="" :disabled="item.writeTimeoutType == -1">
                            </el-input>
                        </div>
                    </el-form-item>
                    <!---->
                    <el-form-item label="读超时:" class="inline-item">
                        <div>
                            <el-select v-model="item.readTimeoutType" placeholder="请选择"
                                       style="width: 100px">
                                <el-option v-for="tempTime in timeTypeDefaultConstant" :key="tempTime.value"
                                           :value="tempTime.value"
                                           :label="tempTime.title"></el-option>
                            </el-select>
                            <el-input style="width: 130px" v-model.number="item.readTimeout" placeholder=""
                                      :disabled="item.readTimeoutType == -1">
                            </el-input>
                        </div>

                    </el-form-item>
                    <!--                    -->
                    <el-form-item label="匹配优先级:" class="inline-item">
                        <el-input style="width: 230px" v-model.number="item.batchIndex" placeholder="例如:0"></el-input>
                    </el-form-item>
                    <!---->
                    <el-form-item label="节点标示名:" class="inline-item">
                        <el-input style="width: 230px" v-model.trim="item.attrName" placeholder="例如：user"></el-input>
                    </el-form-item>
                    <!---->
                    <el-form-item label="url重写规则:" class="inline-item">
                        <el-input style="width: 230px" v-model.trim="item.urlRewrite"
                                  placeholder="例如：/users?id=$1"></el-input>
                    </el-form-item>
                    <!---->
                    <el-form-item label="host类型:" class="inline-item">
                        <div>
                            <el-select v-model="item.hostType" placeholder="请选择"
                                       style="width: 150px">
                                <el-option v-for="tempHost in hostTypeConstant" :key="tempHost.value"
                                           :value="tempHost.value"
                                           :label="tempHost.title"></el-option>
                            </el-select>
                            <el-input style="width: 200px" v-model="item.custemHost"
                                      placeholder="" v-show="item.hostType === 2">
                            </el-input>
                        </div>
                    </el-form-item>
                    <!---->
                    <el-form-item label="http默认值:" class="form-item-block">
                        <div v-show="item.needHttpDefault">
                            <el-row :gutter="10">
                                <el-col :span="6">
                                    <label for="">是否强制启用默认值：
                                        <el-switch v-model="item.useDefault" active-color="#13ce66"
                                                   inactive-color="#f1f1f1"></el-switch>
                                    </label>
                                </el-col>
                                <el-col :span="6">
                                    <label for=""> <span class="red-icon">*</span>状态码：
                                        <el-input style="width: 65%" v-model.number="item.defaultValue.code"
                                                  placeholder="200，404，500"></el-input>
                                    </label>

                                </el-col>
                                <el-col :span="10">
                                    <label for=""><span class="red-icon">*</span>body 内容：
                                        <el-input style="width: 65%" v-model="item.defaultValue.body"
                                                  placeholder="body 内容"></el-input>
                                    </label>
                                </el-col>
                            </el-row>
                            <el-row class="el-margin-top">
                                <el-col :span="3" style="padding-right: 8px;text-align: right"><label
                                        for="">head头部:</label>
                                </el-col>
                                <el-col :span="20">
                                    <template v-for="(head,index) in item.defaultValue.headers">
                                        <el-row class="el-margin-bottom">
                                            <el-col :span="8">
                                                <el-input v-model.trim="head.name" placeholder="键"></el-input>
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
                                                <el-input v-model.trim="cookie.name" placeholder="键"></el-input>
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
                            <el-button type="text" @click="item.needHttpDefault = false">移除Http默认值</el-button>
                        </div>
                        <el-button type="text" v-show="!item.needHttpDefault" @click="item.needHttpDefault = true">
                            添加Http默认值
                        </el-button>
                    </el-form-item>
                    <!---->
                    <el-form-item label="重试策略:" class="form-item-block">
                        <div v-show="item.needRetryStrategy">
                            <el-row :gutter="10" style="overflow: hidden">
                                <el-col :span="7">
                                    <label for=""><span class="red-icon">*</span>重试间隔时间:
                                        <el-input style="width: 60%" v-model.number="item.retryStrategy.interval"
                                                  placeholder="重试间隔时间">
                                        </el-input>
                                        <span>ms</span>
                                    </label>
                                </el-col>
                                <el-col :span="7">
                                    <label for=""><span class="red-icon">*</span>最多重试次数:
                                        <el-input style="width: 60%" v-model.number="item.retryStrategy.maxTimes"
                                                  placeholder="最多重试次数"></el-input>
                                    </label>
                                </el-col>

                            </el-row>
                            <el-row :gutter="10" class="el-margin-top">
                                <el-col :span="11">
                                    <label for="" style="margin-left: 8px">处理的错误码:
                                        <el-input style="width: 70%" v-model="item.retryStrategy.codesStr"
                                                  placeholder="多个的情况用逗号分隔"></el-input>
                                        <el-tooltip class="item" effect="dark" placement="top-start">
                                            <div slot="content">存在多个code 的情况，用英文逗号“,”分隔</div>
                                            <i style="margin-left: 10px;color: #909399;" class="el-icon-info"></i>
                                        </el-tooltip>
                                    </label>
                                </el-col>
                            </el-row>
                            <el-button type="text" @click="item.needRetryStrategy = false">移除重试策略</el-button>
                        </div>
                        <el-button type="text" v-show="!item.needRetryStrategy" @click="item.needRetryStrategy = true">
                            添加重试策略
                        </el-button>

                    </el-form-item>
                    <!---->
                    <el-form-item label="数据缓存:" class="form-item-block">
                        <div v-show="item.needCache">
                            <el-row :gutter="10" style="overflow: hidden">
                                <el-col :span="3" style="text-align: right"><label for=""><span
                                        class="red-icon">*</span>过期时间:</label>
                                </el-col>
                                <el-col :span="10">
                                    <el-input style="width: 70%" v-model.number="item.cache.deadline"
                                              placeholder="请填写过期时间">
                                        <el-select v-model="item.cache.deadlineType" slot="prepend"
                                                   placeholder="请选择"
                                                   style="width: 100px">
                                            <el-option v-for="tempTime in timeTypeConstant" :key="tempTime.value"
                                                       :value="tempTime.value"
                                                       :label="tempTime.title"></el-option>
                                        </el-select>
                                    </el-input>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10" style="margin-top: 10px">
                                <el-col :span="3" style="text-align: right"><label for=""><span
                                        class="red-icon">*</span>关键词:</label>
                                </el-col>
                                <el-col :span="21">
                                    <template v-for="(key,index) in item.cache.keys">
                                        <el-row class="el-margin-bottom" :gutter="10">
                                            <el-col :span="6" style="text-align: center">
                                                <el-select v-model="key.source" placeholder="请选择参数数据源">
                                                    <el-option v-for="(item2,index2) in sourceConstant"
                                                               :label="item2.title"
                                                               :value="item2.value" :key="item2.value"></el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="6" v-if="key.source !== 5">
                                                <el-input v-model="key.name" placeholder="关键词"></el-input>
                                            </el-col>
                                            <el-col :span="6" v-else>
                                                <el-input style="width: 85%" v-model.number="key.index"
                                                          placeholder="路径index"></el-input>
                                                <el-tooltip class="item" effect="dark" placement="top-start">
                                                    <div slot="content">
                                                        http://example.com/path1/path2/path3?xxx=aa,填写1匹配path1，2匹配path2，3匹配path3
                                                    </div>
                                                    <i style="margin-left: 10px;color: #909399;"
                                                       class="el-icon-info"></i>
                                                </el-tooltip>
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
                                        class="red-icon">*</span>匹配条件:</label>
                                </el-col>
                                <el-col :span="21">
                                    <template v-for="(condition,index) in item.cache.conditions">
                                        <el-row class="el-margin-bottom" :gutter="10">
                                            <el-col :span="5">
                                                <el-select v-model="condition.parameter.source" placeholder="请选择参数数据源">
                                                    <el-option v-for="(item2,index2) in sourceConstant"
                                                               :label="item2.title"
                                                               :value="item2.value" :key="item2.value"></el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="5" v-if="condition.parameter.source !== 5">
                                                <el-input v-model="condition.parameter.name"
                                                          placeholder="关键词"></el-input>
                                            </el-col>

                                            <el-col :span="5" v-else>
                                                <el-input style="width: 80%" v-model.number="condition.parameter.index"
                                                          placeholder="路径index"></el-input>
                                                <el-tooltip class="item" effect="dark" placement="top-start">
                                                    <div slot="content">
                                                        http://example.com/path1/path2/path3?xxx=aa,填写1匹配path1，2匹配path2，3匹配path3
                                                    </div>
                                                    <i style="margin-left: 10px;color: #909399;"
                                                       class="el-icon-info"></i>
                                                </el-tooltip>
                                            </el-col>
                                            <el-col :span="4">
                                                <el-select v-model="condition.cmp" placeholder="操作符">
                                                    <el-option v-for="(item2,index2) in cmpConstant"
                                                               :label="item2.title"
                                                               :value="item2.value" :key="item2.value"></el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="5">
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
                            <el-button type="text" @click="item.needCache = false">移除数据缓存</el-button>
                        </div>
                        <el-button type="text" v-show="!item.needCache" @click="item.needCache = true">添加数据缓存
                        </el-button>
                    </el-form-item>
                    <el-form-item label="校验规则:" class="form-item-block">
                        <div v-show="item.needValidations">
                            <template v-for="(validation,index) in item.validations">
                                <div style="overflow: hidden">
                                    <el-row :gutter="10">
                                        <el-col :span="5">
                                            <el-select v-model="validation.parameter.source" placeholder="请选择参数数据源">
                                                <el-option v-for="(item2,index2) in sourceConstant"
                                                           :label="item2.title"
                                                           :value="item2.value" :key="item2.value"></el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="5" v-if="validation.parameter.source !== 5">
                                            <el-input v-model="validation.parameter.name" placeholder="关键词"></el-input>
                                        </el-col>
                                        <el-col :span="5" v-else>
                                            <el-input style="width: 80%" v-model.number="validation.parameter.index"
                                                      placeholder="路径index"></el-input>
                                            <el-tooltip class="item" effect="dark" placement="top-start">
                                                <div slot="content">
                                                    http://example.com/path1/path2/path3?xxx=aa,填写1匹配path1，2匹配path2，3匹配path3
                                                </div>
                                                <i style="margin-left: 10px;color: #909399;" class="el-icon-info"></i>
                                            </el-tooltip>
                                        </el-col>
                                        <el-col :span="4" v-if="validation.rules && validation.rules.length > 0">
                                            <el-input v-model="validation.rules[0].expression"
                                                      placeholder="填写正则匹配规则"></el-input>
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
                            <el-button type="text" @click="item.needValidations = false">移除校验规则</el-button>
                        </div>
                        <el-button type="text" v-show="!item.needValidations" @click="item.needValidations = true">
                            添加校验规则
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
        CMP_ARRAY,
        TIME_TYPE_ARRAY,
        TIME_TYPE_OBJECT,
        TIME_TYPE_DEFAULT_ARRAY,
        HOST_TYPE_ARRAY,
        HOST_TYPE_OBJECT
    } from '~/constant/constant';
    import {extend, clone, extendByTarget, toNs, encodeBase64, decodeBase64, toSecond} from "~/utils";
    import * as clusterApi from '~/api/cluster';
    import StepMixin from './StepMixin';

    function _getNodeTempValidation() {
        return {
            parameter: {
                name: '',
                source: '',
                index: 0
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
            index: 0
        }
    }

    function _getNodeCacheConditionItem() {
        return {
            cmp: '',
            expect: '',
            parameter: {
                name: '',
                source: '',
                index: 0
            }
        }
    }

    function _getNodeTempItem() {
        var _validationTemp = _getNodeTempValidation();
        const _tempItem = {
            clusterID: '', //
            urlRewrite: '',
            custemHost: '',
            hostType: HOST_TYPE_OBJECT.hostOrigin,
            attrName: '',
            useDefault: false,
            batchIndex: undefined,
            writeTimeout: '',
            writeTimeoutType: TIME_TYPE_OBJECT.second,
            readTimeout: '',
            readTimeoutType: TIME_TYPE_OBJECT.second,
            validations: [
                _validationTemp
            ],
            cache: {
                keys: [
                    _getNodeCacheKeyItem()
                ],
                deadline: '',
                deadlineType: TIME_TYPE_OBJECT.second, // 单位ms
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
            needRetryStrategy: false,
            needHttpDefault: false
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
                timeTypeConstant: TIME_TYPE_ARRAY,
                timeTypeDefaultConstant: TIME_TYPE_DEFAULT_ARRAY,
                hostTypeConstant: HOST_TYPE_ARRAY,
                rules: {},
                clusterList: [], //

            }
        },
        mixins: [StepMixin],
        created() {
            this.init();
        },
        watch: {
            //
            'editItem': function (newValue, oldValue) {
                this._updateData(newValue);
            }
        },
        methods: {
            init() {
                // 拉取 cluster list
                clusterApi.getAllData().then((data) => {
                    this.clusterList = data;
                });
            },
            submitForm() {
                var _tempItemResult = this._formatFormData();
                var _tempItem = _tempItemResult.result;
                var result = _tempItemResult.isError;
                this.$emit('submitFormStep', result, _tempItem);
            },

            _updateData(value) {
                var newValue = value || {};
                var tempNodes = [];
                newValue.nodes && newValue.nodes.forEach((item) => {
                    var tempNode = extendByTarget(_getNodeTempItem(), clone(item));

                    // 默认转化为 秒, 服务器端返回的是纳秒
                    if (tempNode.writeTimeout) {
                        tempNode.writeTimeout = toSecond(tempNode.writeTimeout);
                        tempNode.writeTimeoutType = TIME_TYPE_OBJECT.second;
                    } else {
                        tempNode.writeTimeoutType = TIME_TYPE_OBJECT.default;
                        tempNode.writeTimeout = undefined;
                    }

                    if (tempNode.readTimeout) {
                        tempNode.readTimeout = toSecond(tempNode.readTimeout);
                        tempNode.readTimeoutType = TIME_TYPE_OBJECT.second;
                    } else {
                        tempNode.readTimeoutType = TIME_TYPE_OBJECT.default;
                        tempNode.readTimeout = undefined;
                    }


                    if (tempNode.defaultValue && tempNode.defaultValue.code && tempNode.defaultValue.body) {
                        tempNode.needHttpDefault = true;

                        // 解码
                        if (tempNode.defaultValue.body) {
                            tempNode.defaultValue.body = decodeBase64(tempNode.defaultValue.body);
                        }
                    }

                    if (tempNode.retryStrategy && tempNode.retryStrategy.interval && tempNode.retryStrategy.maxTimes) {
                        tempNode.needRetryStrategy = true;
                        tempNode.retryStrategy.codesStr = tempNode.retryStrategy.codes && tempNode.retryStrategy.codes.join(',');
                        tempNode.retryStrategy.intervalType = TIME_TYPE_OBJECT.second;
                    }

                    if (tempNode.cache && tempNode.cache.deadline) {
                        tempNode.cache.deadline = toSecond(tempNode.cache.deadline);
                        tempNode.cache.deadlineType = TIME_TYPE_OBJECT.second;
                        tempNode.needCache = true;
                    }

                    if (tempNode.validations && tempNode.validations.length > 0) {
                        var tempItem = tempNode.validations[0];
                        if (tempItem.parameter && tempItem.parameter.name) {
                            tempNode.needValidations = true;
                        }

                        // 添加默认值
                        if (!tempItem.rules || (tempItem.rules && tempItem.rules.length === 0)) {
                            tempItem.rules = [];
                            var _tempRule = {
                                ruleType: RULE_TYPE_OBJECT.ruleRegexp,
                                expression: ''
                            };

                            tempItem.rules.push(_tempRule);
                        }
                    }

                    tempNodes.push(tempNode);
                });

                this.tempItem.nodes = tempNodes;
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

                    // host类型
                    if(_node.hostType === HOST_TYPE_OBJECT.hostCustom){
                        if(!_node.custemHost){
                            this._showMessage(_msg + '请填写host类型hostCustom对应的host 值');
                            isError = true;
                            break;
                        }
                    }
                    else {
                        delete _node.custemHost;
                    }

                    // 写超时
                    if (_node.writeTimeoutType == TIME_TYPE_OBJECT.default) {
                        delete _node.writeTimeout;
                    } else {
                        _node.writeTimeout = toNs(_node.writeTimeout, _node.writeTimeoutType);
                    }
                    delete _node.writeTimeoutType;

                    // 读超时
                    if (_node.readTimeoutType == TIME_TYPE_OBJECT.default) {
                        delete _node.readTimeout;
                    } else {
                        _node.readTimeout = toNs(_node.readTimeout, _node.readTimeoutType);
                    }
                    delete _node.readTimeoutType;

                    // http 默认值
                    if (_node.needHttpDefault) {
                        if (!_node.defaultValue.code) {
                            this._showMessage(_msg + '请填写状态码');
                            isError = true;
                            break;
                        }

                        if(!_node.defaultValue.body){
                            this._showMessage(_msg + '请填写body内容');
                            isError = true;
                            break;
                        }

                        if (_node.defaultValue.body) {

                            _node.defaultValue.body = encodeBase64(_node.defaultValue.body);
                        }

                    } else {
                        delete _node.defaultValue;
                        _node.useDefault = false;
                    }

                    // 重试策略
                    if (_node.needRetryStrategy) {
                        if (!_node.retryStrategy.interval) {
                            this._showMessage(_msg + '请填写重试策略的重试间隔时间字段');
                            isError = true;
                            break;
                        }
                        if (!_node.retryStrategy.maxTimes) {
                            this._showMessage(_msg + '请填写重试策略的最多重试次数字段');
                            isError = true;
                            break;
                        }

                        if (_node.retryStrategy.codesStr) {
                            var tempNodes = _node.retryStrategy.codesStr.split(',');
                            _node.retryStrategy.codes = tempNodes.map((item) => {
                                return parseInt(item, 10);
                            });
                            if (_node.retryStrategy.codes.length === 0) {
                                delete _node.retryStrategy.codes;
                            }

                            delete _node.retryStrategy.codesStr;
                        }

                    } else {
                        delete _node.retryStrategy;
                    }

                    // 数据缓存
                    if (_node.needCache) {
                        if (!_node.cache.deadline) {
                            this._showMessage(_msg + '请填写数据缓存的超时时间字段');
                            isError = true;
                            break;
                        }

                        // 过期事件
                        _node.cache.deadline = toNs(_node.cache.deadline, _node.cache.deadlineType);
                        delete _node.cache.deadlineType;

                        //
                        if (_node.cache.keys && _node.cache.keys.length > 0) {
                            _node.cache.keys.forEach((keyItem) => {
                                if (keyItem.source === 5) {
                                    keyItem.name = '';
                                } else {
                                    keyItem.index = 0;
                                }
                            })
                        }

                        //
                        if (_node.cache.conditions && _node.cache.conditions.length > 0) {
                            _node.cache.conditions.forEach((conditionItem) => {
                                if (conditionItem.parameter.source === 5) {
                                    conditionItem.parameter.name = '';
                                } else {
                                    conditionItem.parameter.index = 0;
                                }
                            });
                        }
                    } else {
                        delete _node.cache;
                    }

                    // 校验规则。
                    if (_node.needValidations) {
                        // 校验规则有数据
                        if (_node.validations && _node.validations.length > 0) {
                            _node.validations.forEach((validationItem) => {
                                if (validationItem.parameter.source == 5) {
                                    validationItem.parameter.name = '';
                                } else {
                                    validationItem.parameter.index = 0;
                                }
                            });
                        }
                    } else {
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

            addNodeDefaultValueItem(node, type) {
                var tempItem = {name: '', value: ''};
                if (type === 'head') {
                    node.defaultValue.headers.push(tempItem);
                } else if (type === 'cookie') {
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
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        padding: 10px 5px;
    }

    .red-icon {
        color: #f56c6c;
        margin-right: 4px;
    }
</style>
