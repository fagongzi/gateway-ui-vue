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
                <el-input v-else v-model="tempItem.addr" style="width: 200px" placeholder='格式为："IP:PORT"'></el-input>
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
                <el-row>
                    <el-col>
                        <el-card class="box-card">
                            <div slot="header" class="clearfix" style="line-height:25px ">
                                <el-alert :closable="false"
                                          title="Server的健康检查机制，目前支持HTTP的协议检查，支持检查返回状态码以及返回内容。如果没有设置，认为这个Server的健康检查交给外部，Gateway永久认为这个Server是健康的。"
                                          type="warning">
                                </el-alert>
                            </div>
                            <el-row>
                                <el-col :span="4" style="text-align: right;padding-right: 8px;">检查路径:</el-col>
                                <el-col :span="10">
                                    <span v-if="isShow">{{tempItem.heathCheck.path}}</span>
                                    <el-input v-else v-model="tempItem.heathCheck.path"
                                              placeholder="检测路径，如/ping"></el-input>
                                </el-col>
                            </el-row>
                            <el-row class="el-margin-top">
                                <el-col :span="4" style="text-align: right;padding-right: 8px;">检测间隔时间:</el-col>
                                <el-col :span="10">
                                    <span v-if="isShow">{{tempItem.heathCheck.checkInterval}}</span>
                                    <el-input v-else v-model.number="tempItem.heathCheck.checkInterval"
                                              placeholder="单位(纳秒)"></el-input>
                                </el-col>
                            </el-row>
                            <el-row class="el-margin-top">
                                <el-col :span="4" style="text-align: right;padding-right: 8px;">检测超时时间:</el-col>
                                <el-col :span="10">
                                    <span v-if="isShow">{{tempItem.heathCheck.timeout}}</span>
                                    <el-input v-else v-model.number="tempItem.heathCheck.timeout"
                                              placeholder="单位(纳秒)"></el-input>
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-col>
                </el-row>

            </el-form-item>

            <el-form-item label="熔断规则" style="width: 800px">
                <el-row>
                    <el-col>
                        <el-card class="box-card">
                            <div slot="header" class="clearfix" style="line-height:25px ">
                                <el-alert :closable="false"
                                          title="熔断器，设置后端Server的熔断规则。熔断器分为3个状态： Open、Half、Close"
                                          type="warning">
                                </el-alert>
                            </div>
                            <el-row>
                                <el-col :span="5" style="text-align: right;padding-right: 8px;">关闭检查间隔时间:</el-col>
                                <el-col :span="10">
                                    <span v-if="isShow">{{tempItem.circuitBreaker.closeTimeout}}</span>
                                    <el-input v-else v-model.number="tempItem.circuitBreaker.closeTimeout"
                                              placeholder="单位(纳秒)"></el-input>
                                </el-col>
                            </el-row>
                            <el-row class="el-margin-top">
                                <el-col :span="5" style="text-align: right;padding-right: 8px;">熔断器检查周期:</el-col>
                                <el-col :span="10">
                                    <span v-if="isShow">{{tempItem.circuitBreaker.rateCheckPeriod}}</span>
                                    <el-input v-else v-model.number="tempItem.circuitBreaker.rateCheckPeriod"
                                              placeholder="单位(纳秒)"></el-input>
                                </el-col>
                            </el-row>
                            <el-row class="el-margin-top">
                                <el-col :span="5" style="text-align: right;padding-right: 8px;">Half限流百分比:</el-col>
                                <el-col :span="10">
                                    <span v-if="isShow">{{tempItem.circuitBreaker.halfTrafficRate}}</span>
                                    <el-input v-else v-model.number="tempItem.circuitBreaker.halfTrafficRate"
                                              placeholder="区间：1-100"></el-input>
                                </el-col>
                            </el-row>
                            <el-row class="el-margin-top">
                                <el-col :span="5" style="text-align: right;padding-right: 8px;">Half -> Close的错误百分比:</el-col>
                                <el-col :span="10">
                                    <span v-if="isShow">{{tempItem.circuitBreaker.failureRateToClose}}</span>
                                    <el-input v-else v-model.number="tempItem.circuitBreaker.failureRateToClose"
                                              placeholder="区间：1-100"></el-input>
                                </el-col>
                            </el-row>
                            <el-row class="el-margin-top">
                                <el-col :span="5" style="text-align: right;padding-right: 8px;">Half -> Open的成功百分比:</el-col>
                                <el-col :span="10">
                                    <span v-if="isShow">{{tempItem.circuitBreaker.succeedRateToOpen}}</span>
                                    <el-input v-else v-model.number="tempItem.circuitBreaker.succeedRateToOpen"
                                              placeholder="区间：1-100"></el-input>
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-col>
                </el-row>
            </el-form-item>


            <div style="margin-left: 70px">
                <el-button @click="goList">返回</el-button>
                <el-button v-if="showType=='show'" type="primary" @click="goEdit('dataForm')">编辑</el-button>
                <el-button v-else-if="showType=='create'" type="primary" @click="createItem('dataForm')">添加
                </el-button>
                <el-button v-else-if="showType=='update'" type="primary" @click="updateItem('dataForm')">修改
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
        PROTOCOL_ARRAY
    } from '~/constant/constant';
    import * as serverApi from '~/api/server';
    import * as clusterApi from '~/api/cluster';
    import * as bindApi from '~/api/bind';
    import {clone, extend} from "~/utils";

    function _getTempItem() {
        return {
            id: undefined,
            addr: '',
            protocol: PROTOCOL_OBJECT.http,
            maxQPS: undefined,
            heathCheck: {
                path: '',
                body:'',
                checkInterval: '',
                timeout: ''
            },
            circuitBreaker: {
                closeTimeout: '',
                halfTrafficRate: '',
                rateCheckPeriod: '',
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
                circuitBreakerConstant: CIRCUIT_STATUS_ARRAY,
                protocolConstant: PROTOCOL_ARRAY,
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
                clustersList: []
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
                this.tempItem = extend(this.tempItem, clone(newValue));
                this.loading = false;
            }
        },

        methods: {
            init() {
                if (this._isShow()) {
                    this.rules = {};
                }
                else if (this._isCreate()) {
                    this.loading = false;
                    this.tempItem = extend(this.tempItem, clone(this.editItem));
                }

                // 拉取集群
                clusterApi.getList().then((data) => {
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
                this.$refs[dataForm].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this._doCreateItem();
                })
            },

            _doCreateItem() {
                var item = this._formatFormData();


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
                    });
                });
            },

            updateItem(dataForm) {
                this.$refs[dataForm].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this._doUpdateItem();
                })
            },

            _doUpdateItem() {
                var item = this._formatFormData();

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
                    });
                });
            },

            //
            _formatFormData() {
                var item = clone(this.tempItem);


                if (!item.id) {
                    delete item.id;
                }

                if (item.heathCheck.path == '' && item.heathCheck.timeout == '' && item.heathCheck.checkInterval == '') {
                    delete item.heathCheck;
                }

                var empty1 = item.circuitBreaker.succeedRateToOpen == '' && item.circuitBreaker.halfTrafficRate == '' && item.circuitBreaker.rateCheckPeriod == '';
                var empty2 = item.circuitBreaker.closeTimeout == '' && item.circuitBreaker.failureRateToClose == '';

                if (empty1 && empty2) {
                    delete item.circuitBreaker;
                }

                return item;
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
</style>
