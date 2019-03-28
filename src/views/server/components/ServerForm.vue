<template>
    <div>
        <el-form :rules="rules" ref="dataForm" :model="tempItem" label-width="150px" v-loading="loading">
            <el-form-item label="集群" prop="bindClusterId">
                <span v-if="isShow">{{tempItem.bindClusterName}}</span>
                <template v-else>
                    <el-select v-model="tempItem.bindClusterId">
                        <el-option v-for="(item2,index2) in clustersList" :label="item2.name"
                                   :value="item2.id" :key="item2.id"></el-option>
                    </el-select>
                </template>

            </el-form-item>
            <el-form-item label="地址" prop="addr">
                <span v-if="showType == 'show'">{{tempItem.addr}}</span>
                <el-input v-else v-model="tempItem.addr" style="width: 200px" placeholder='"IP:PORT",默认80端口'></el-input>
            </el-form-item>
            <el-form-item label="接口协议">
                <span v-if="isShow">{{tempItem.protocol |protocolFilter}}</span>
                <template v-else>
                    <el-select v-model="tempItem.protocol" placeholder="Server的接口协议" style="width: 200px">
                        <el-option v-for="item in protocolConstant" :key="item.value" :value="item.value"
                                   :label="item.title">
                        </el-option>
                    </el-select>
                </template>

            </el-form-item>
            <el-form-item label="支持的最大QPS" prop="maxQPS">
                <span v-if="showType == 'show'">{{tempItem.maxQPS}}</span>
                <el-input v-else v-model.number="tempItem.maxQPS" style="width: 200px" placeholder='用于流控'></el-input>
            </el-form-item>
            <el-form-item label="健康检查机制" style="width: 800px">
                <el-row v-show="needHeathCheck">
                    <el-col>
                        <el-card class="box-card">
                            <div slot="header" class="clearfix" style="line-height:25px ">
                                <el-alert :closable="false"
                                          title="Server的健康检查机制，目前支持HTTP的协议检查，支持检查返回状态码以及返回内容。如果没有设置，认为这个Server的健康检查交给外部，Gateway永久认为这个Server是健康的。"
                                          type="warning">
                                </el-alert>
                            </div>
                            <el-row>
                                <el-col :span="5" style="text-align: right;padding-right: 8px;"><span
                                        class="red-icon">*</span> 检查路径:
                                </el-col>
                                <el-col :span="10">
                                    <span v-if="isShow">{{tempItem.heathCheck.path}}</span>
                                    <el-input v-else v-model="tempItem.heathCheck.path"
                                              placeholder="检测路径，如/ping"></el-input>
                                </el-col>
                            </el-row>
                            <el-row class="el-margin-top">
                                <el-col :span="5" style="text-align: right;padding-right: 8px;"><span
                                        class="red-icon">*</span>检测间隔时间:
                                </el-col>
                                <el-col :span="10">
                                    <span v-if="isShow">{{tempItem.heathCheck.checkInterval | toSecondFilter}}</span>
                                    <el-input v-else v-model.number="tempItem.heathCheck.checkInterval"
                                              placeholder="请填写">
                                        <el-select v-model="tempItem.heathCheck.checkIntervalType" slot="prepend"
                                                   placeholder="请选择"
                                                   style="width: 100px">
                                            <el-option v-for="tempTime in timeTypeConstant" :key="tempTime.value"
                                                       :value="tempTime.value"
                                                       :label="tempTime.title"></el-option>
                                        </el-select>
                                    </el-input>
                                </el-col>
                            </el-row>
                            <el-row class="el-margin-top">
                                <el-col :span="5" style="text-align: right;padding-right: 8px;"><span
                                        class="red-icon">*</span>检测超时时间:
                                </el-col>
                                <el-col :span="10">
                                    <span v-if="isShow">{{tempItem.heathCheck.timeout | toSecondFilter}}</span>
                                    <el-input v-else v-model.number="tempItem.heathCheck.timeout"
                                              placeholder="请填写">
                                        <el-select v-model="tempItem.heathCheck.timeoutType" slot="prepend"
                                                   placeholder="请选择"
                                                   style="width: 100px">
                                            <el-option v-for="tempTime in timeTypeConstant" :key="tempTime.value"
                                                       :value="tempTime.value"
                                                       :label="tempTime.title"></el-option>
                                        </el-select>
                                    </el-input>
                                </el-col>
                            </el-row>
                            <el-row class="el-margin-top">
                                <el-col :span="5" style="text-align: right;padding-right: 8px;">返回内容:
                                </el-col>
                                <el-col :span="10">
                                    <span v-if="isShow">{{tempItem.heathCheck.body}}</span>
                                    <el-input v-else v-model="tempItem.heathCheck.body"
                                              placeholder="返回内容" type="textarea"></el-input>
                                </el-col>
                            </el-row>
                        </el-card>
                        <el-button type="text" v-if="!isShow" @click="needHeathCheck = false">移除健康检查机制</el-button>
                    </el-col>
                </el-row>
                <el-button type="text" v-show="!needHeathCheck" @click="needHeathCheck = true">添加健康检查机制
                </el-button>
            </el-form-item>

            <el-form-item label="熔断器设置" style="width: 800px">
                <el-row v-show="needCircuitBreaker">
                    <el-col>
                        <el-card class="box-card">
                            <div slot="header" class="clearfix" style="line-height:25px ">
                                <el-alert :closable="false"
                                          title="熔断器，设置后端Server的熔断规则。熔断器分为3个状态： Open、Half、Close"
                                          type="warning">
                                </el-alert>
                            </div>
                            <el-row>
                                <el-col :span="8" style="text-align: right;padding-right: 8px;"><span
                                        class="red-icon">*</span>关闭检查间隔时间:
                                </el-col>
                                <el-col :span="10">
                                    <span v-if="isShow">{{tempItem.circuitBreaker.closeTimeout | toSecondFilter}}</span>
                                    <el-input v-else v-model.number="tempItem.circuitBreaker.closeTimeout"
                                              placeholder="请填写">
                                        <el-select v-model="tempItem.circuitBreaker.closeTimeoutType" slot="prepend"
                                                   placeholder="请选择"
                                                   style="width: 100px">
                                            <el-option v-for="tempTime in timeTypeConstant" :key="tempTime.value"
                                                       :value="tempTime.value"
                                                       :label="tempTime.title"></el-option>
                                        </el-select>
                                    </el-input>
                                </el-col>
                            </el-row>
                            <el-row class="el-margin-top">
                                <el-col :span="8" style="text-align: right;padding-right: 8px;"><span
                                        class="red-icon">*</span>熔断器检查周期:
                                </el-col>
                                <el-col :span="10">
                                    <span v-if="isShow">{{tempItem.circuitBreaker.rateCheckPeriod | toSecondFilter}}</span>
                                    <el-input v-else
                                              v-model.number="tempItem.circuitBreaker.rateCheckPeriod "
                                              placeholder="请填写">
                                        <el-select v-model="tempItem.circuitBreaker.rateCheckPeriodType" slot="prepend"
                                                   placeholder="请选择"
                                                   style="width: 100px">
                                            <el-option v-for="tempTime in timeTypeConstant" :key="tempTime.value"
                                                       :value="tempTime.value"
                                                       :label="tempTime.title"></el-option>
                                        </el-select>
                                    </el-input>
                                </el-col>
                            </el-row>
                            <el-row class="el-margin-top">
                                <el-col :span="8" style="text-align: right;padding-right: 8px;"><span
                                        class="red-icon">*</span>Half限流百分比:
                                </el-col>
                                <el-col :span="10">
                                    <span v-if="isShow">{{tempItem.circuitBreaker.halfTrafficRate}}</span>
                                    <el-input v-else v-model.number="tempItem.circuitBreaker.halfTrafficRate"
                                              placeholder="区间：1-100"></el-input>
                                </el-col>
                            </el-row>
                            <el-row class="el-margin-top">
                                <el-col :span="8" style="text-align: right;padding-right: 8px;"><span
                                        class="red-icon">*</span>Open -> Close的错误百分比:
                                </el-col>
                                <el-col :span="10">
                                    <span v-if="isShow">{{tempItem.circuitBreaker.failureRateToClose}}</span>
                                    <el-input v-else v-model.number="tempItem.circuitBreaker.failureRateToClose"
                                              placeholder="区间：1-100"></el-input>
                                </el-col>
                            </el-row>
                            <el-row class="el-margin-top">
                                <el-col :span="8" style="text-align: right;padding-right: 8px;"><span
                                        class="red-icon">*</span>Half -> Open的成功百分比:
                                </el-col>
                                <el-col :span="10">
                                    <span v-if="isShow">{{tempItem.circuitBreaker.succeedRateToOpen}}</span>
                                    <el-input v-else v-model.number="tempItem.circuitBreaker.succeedRateToOpen"
                                              placeholder="区间：1-100"></el-input>
                                </el-col>
                            </el-row>
                        </el-card>
                        <el-button type="text" v-if="!isShow" @click="needCircuitBreaker = false">移除熔断规则</el-button>

                    </el-col>
                </el-row>
                <el-button type="text" v-show="!needCircuitBreaker" @click="needCircuitBreaker = true">添加熔断规则
                </el-button>

            </el-form-item>


            <div style="margin-left: 70px">
                <el-button @click="goList">返回</el-button>
                <el-button v-if="showType=='show'" type="primary" @click="goEdit('dataForm')">编辑</el-button>
                <el-button v-else-if="showType=='create'" :loading="submitting" type="primary"
                           @click="createItem('dataForm')">添加
                </el-button>
                <el-button v-else-if="showType=='update'" :loading="submitting" type="primary"
                           @click="updateItem('dataForm')">修改
                </el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    import {
        FORM_OBJECT,
        CIRCUIT_STATUS_OBJECT,
        CIRCUIT_STATUS_ARRAY,
        PROTOCOL_OBJECT,
        PROTOCOL_ARRAY,
        TIME_TYPE_ARRAY,
        TIME_TYPE_OBJECT
    } from '~/constant/constant';
    import * as serverApi from '~/api/server';
    import * as clusterApi from '~/api/cluster';
    import * as bindApi from '~/api/bind';
    import {clone, extend, toSecond, toNs} from "~/utils";

    function _getTempItem() {
        return {
            id: undefined,
            addr: '',
            protocol: PROTOCOL_OBJECT.http,
            maxQPS: undefined,
            heathCheck: {
                path: '',
                body: '',
                checkInterval: 0,
                checkIntervalType: TIME_TYPE_OBJECT.second,
                timeout: 0,
                timeoutType: TIME_TYPE_OBJECT.second,
            },
            circuitBreaker: {
                closeTimeout: 0,
                closeTimeoutType: TIME_TYPE_OBJECT.second,
                rateCheckPeriod: 0,
                rateCheckPeriodType: TIME_TYPE_OBJECT.second,
                halfTrafficRate: '',
                failureRateToClose: '',
                succeedRateToOpen: ''
            },
            bindClusterId: '',
            bindClusterName: ''
        }
    }

    export default {
        name: "serverForm",
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
                circuitBreakerConstant: CIRCUIT_STATUS_ARRAY,
                protocolConstant: PROTOCOL_ARRAY,
                timeTypeConstant: TIME_TYPE_ARRAY,
                rules: {
                    bindClusterId: [
                        {required: true, message: '请选择集群', trigger: 'change'}
                    ],
                    addr: [
                        {required: true, message: '请填写地址', trigger: 'change'},
                        {min: 5, max: 255, message: '长度请控制在 5 - 255', trigger: 'change'}
                    ],
                    maxQPS: [
                        {required: true, message: '请填写支持的最大QPS', trigger: 'change'},
                        {type: 'number', min: 1, message: '数值必须大于0', trigger: 'change'},
                    ],

                },
                tempItem: _getTempItem(),

                clustersList: [],
                needHeathCheck: false,
                needCircuitBreaker: false
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
            }
        },
        created() {
            this.init();
        },

        watch: {
            //
            'editItem': function (newValue, oldValue) {
                var _tempItem = extend(_getTempItem(), clone(newValue));

                if (!this._isShow()) {


                    if (_tempItem.heathCheck.path) {
                        this.needHeathCheck = true;
                    }
                    if (_tempItem.circuitBreaker.halfTrafficRate) {
                        this.needCircuitBreaker = true;
                    }

                    if (_tempItem.heathCheck.checkInterval) {
                        _tempItem.heathCheck.checkInterval = toSecond(_tempItem.heathCheck.checkInterval);
                    }

                    if (_tempItem.heathCheck.timeout) {
                        _tempItem.heathCheck.timeout = toSecond(_tempItem.heathCheck.timeout);
                    }

                    if (_tempItem.circuitBreaker.closeTimeout) {
                        _tempItem.circuitBreaker.closeTimeout = toSecond(_tempItem.circuitBreaker.closeTimeout);
                    }

                    if (_tempItem.circuitBreaker.rateCheckPeriod) {
                        _tempItem.circuitBreaker.rateCheckPeriod = toSecond(_tempItem.circuitBreaker.rateCheckPeriod);
                    }

                    _tempItem.heathCheck.checkIntervalType = TIME_TYPE_OBJECT.second;
                    _tempItem.heathCheck.timeoutType = TIME_TYPE_OBJECT.second;
                    _tempItem.circuitBreaker.closeTimeoutType = TIME_TYPE_OBJECT.second;
                    _tempItem.circuitBreaker.rateCheckPeriodType = TIME_TYPE_OBJECT.second;

                }

                this.tempItem = _tempItem;
                this.loading = false;
                this.submitting = false;
            }
        },

        methods: {
            init() {
                if (this._isShow()) {
                    this.rules = {};
                    this.needHeathCheck = true;
                    this.needCircuitBreaker = true;
                } else if (this._isCreate()) {
                    this.loading = false;
                    this.tempItem = extend(this.tempItem, clone(this.editItem));
                }

                // 拉取集群
                clusterApi.getAllData().then((data) => {
                    this.clustersList = data || [];

                    if (this._isShow()) {
                        this.initShow();
                    }
                });
            },

            initShow() {
                if (this.tempItem.bindClusterId) {
                    for (var i = 0, len = this.clustersList.length; i < len; i++) {
                        var temp = this.clustersList[i];
                        if (temp.id == this.tempItem.bindClusterId) {
                            this.tempItem.bindClusterName = temp.name;
                        }
                    }
                }
            },

            goList() {
                this.$router.replace({path: '/server', query: {id: this.tempItem.bindClusterId}});
                this.$destroy();
            },


            goEdit() {
                this.$router.push({
                    path: '/server/edit',
                    query: {id: this.tempItem.id, clusterId: this.tempItem.bindClusterId}
                });
                this.$destroy();
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

            _doCreateItem() {
                var item = this._formatFormData();

                if (!item) {
                    return;
                }
                this.submitting = true;

                serverApi.updateItem(item).then((data) => {
                    var bindItem = {
                        clusterID: this.tempItem.bindClusterId,
                        serverID: data
                    };
                    bindApi.updateItem(bindItem).then(() => {
                        this.$message({
                            type: 'success',
                            message: '创建成功!'
                        });
                        setTimeout(() => {
                            this.goList();
                        }, 2000);
                    }).catch(() => {
                        this.submitting = true;
                    });
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
                var item = this._formatFormData();
                if (!item) {
                    return;
                }

                this.submitting = true;
                serverApi.updateItem(item).then((data) => {
                    var bindItem = {
                        clusterID: this.tempItem.bindClusterId,
                        serverID: data
                    };
                    bindApi.updateItem(bindItem).then(() => {
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
                });
            },

            //
            _formatFormData() {
                var item = clone(this.tempItem);

                if (!item.id) {
                    delete item.id;
                }
                if (item.addr) {
                    // 替换中文的：
                    item.addr = item.addr.replace('：', ':');
                    // 默认补充80端口
                    if (item.addr.indexOf(':') === -1) {
                        item.addr = item.addr + ':80';
                    }
                }


                item.heathCheck.timeout = toNs(item.heathCheck.timeout, item.heathCheck.timeoutType);
                item.heathCheck.checkInterval = toNs(item.heathCheck.checkInterval, item.heathCheck.checkIntervalType);
                item.circuitBreaker.rateCheckPeriod = toNs(item.circuitBreaker.rateCheckPeriod, item.circuitBreaker.rateCheckPeriodType);
                item.circuitBreaker.closeTimeout = toNs(item.circuitBreaker.closeTimeout, item.circuitBreaker.closeTimeoutType);


                if (this.needHeathCheck) {
                    if (!item.heathCheck.path) {
                        this._showMessage('填写健康检查机制的检查路径字段');
                        return false;
                    } else if (!item.heathCheck.checkInterval) {
                        this._showMessage('填写健康检查机制的间隔时间字段');
                        return false;
                    } else if (!item.heathCheck.timeout) {
                        this._showMessage('填写健康检查机制的超时时间字段');
                        return false;
                    }
                } else {
                    delete item.heathCheck;
                }

                if (this.needCircuitBreaker) {
                    if (!item.circuitBreaker.closeTimeout) {
                        this._showMessage('填写熔断规则的间隔时间字段');
                        return false;
                    } else if (!item.circuitBreaker.rateCheckPeriod) {
                        this._showMessage('填写熔断规则的检查周期字段');
                        return false;
                    } else if (!item.circuitBreaker.halfTrafficRate) {
                        this._showMessage('填写熔断规则的Half限流百分比字段');
                        return false;
                    } else if (!item.circuitBreaker.failureRateToClose) {
                        this._showMessage('填写熔断规则的Open -> Close的错误百分比字段');
                        return false;
                    } else if (!item.circuitBreaker.succeedRateToOpen) {
                        this._showMessage('填写熔断规则的Half -> Open的成功百分比字段');
                        return false;
                    }
                } else {
                    delete item.circuitBreaker;
                }


                return item;
            },

            _showMessage(msg) {
                this.$message({
                    type: 'warning',
                    message: msg
                });
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
    .el-margin-top {
        margin-top: 10px;
    }

    .red-icon {
        color: #f56c6c;
        margin-right: 4px;
    }
</style>
