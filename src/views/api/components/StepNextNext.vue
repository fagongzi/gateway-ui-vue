<template>
    <div class="app-container">
        <el-form ref="dataForm" :model="tempItem" label-width="150px">
            <el-form-item label="支持的最大QPS" prop="maxQPS" style="width: 800px">
                <el-row>
                    <el-col>
                        <el-button type="text" @click="needMaxQPS = true" v-show="!needMaxQPS">添加支持的最大QPS</el-button>
                        <el-card class="box-card" v-show="needMaxQPS">
                            <el-row>
                                <el-col :span="8" style="text-align: right;padding-right: 8px;"><span class="red-icon">*</span>支持的最大QPS:</el-col>
                                <el-col :span="10">
                                    <el-input v-model.number="tempItem.maxQPS" style="width: 200px"
                                              placeholder='用于流控'></el-input>
                                </el-col>
                            </el-row>
                            <el-row class="el-margin-top">
                                <el-col :span="8" style="text-align: right;padding-right: 8px;"><span class="red-icon">*</span>超载:</el-col>
                                <el-col :span="10">
                                    <el-select v-model.number="tempItem.rateLimitOption" style="width: 200px">
                                        <el-option
                                                v-for="tempTime in rateLimitOptionConstant"
                                                :key="tempTime.value"
                                                :label="tempTime.title"
                                                :value="tempTime.value">
                                        </el-option>
                                    </el-select>
                                </el-col>
                            </el-row>
                        </el-card>
                        <el-button type="text" v-show="needMaxQPS" @click="needMaxQPS = false">移除支持的最大QPS</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="熔断器设置" style="width: 800px">
                <el-row>
                    <el-col>
                        <el-button type="text" v-show="!needCircuitBreaker" @click="needCircuitBreaker = true">添加熔断规则
                        </el-button>
                        <el-card class="box-card" v-show="needCircuitBreaker">
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
                                    <el-input v-model.number="tempItem.circuitBreaker.closeTimeout"
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
                                    <el-input v-model.number="tempItem.circuitBreaker.rateCheckPeriod "
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
                                    <el-input v-model.number="tempItem.circuitBreaker.halfTrafficRate"
                                              placeholder="区间：1-100"></el-input>
                                </el-col>
                            </el-row>
                            <el-row class="el-margin-top">
                                <el-col :span="8" style="text-align: right;padding-right: 8px;"><span
                                        class="red-icon">*</span>Open -> Close的错误百分比:
                                </el-col>
                                <el-col :span="10">
                                    <el-input v-model.number="tempItem.circuitBreaker.failureRateToClose"
                                              placeholder="区间：1-100"></el-input>
                                </el-col>
                            </el-row>
                            <el-row class="el-margin-top">
                                <el-col :span="8" style="text-align: right;padding-right: 8px;"><span
                                        class="red-icon">*</span>Half -> Open的成功百分比:
                                </el-col>
                                <el-col :span="10">
                                    <el-input v-model.number="tempItem.circuitBreaker.succeedRateToOpen"
                                              placeholder="区间：1-100"></el-input>
                                </el-col>
                            </el-row>
                        </el-card>
                        <el-button type="text" v-show="needCircuitBreaker" @click="needCircuitBreaker = false">移除熔断规则
                        </el-button>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {
        TIME_TYPE_OBJECT,
        TIME_TYPE_ARRAY,
        RATE_LIMIT_OPTION_ARRAY,
        RATE_LIMIT_OPTION_OBJECT
    } from '~/constant/constant'

    import {extend, clone, extendByTarget, toSecond, toNs} from "~/utils"
    import StepMixin from './StepMixin'


    function _getCircuitBreaker() {
        return {
            closeTimeout: 0,
            closeTimeoutType: TIME_TYPE_OBJECT.second,
            rateCheckPeriod: 0,
            rateCheckPeriodType: TIME_TYPE_OBJECT.second,
            halfTrafficRate: '',
            failureRateToClose: '',
            succeedRateToOpen: ''
        }
    }

    export default {
        name: "StepNextNext",
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
                    maxQPS: undefined,
                    rateLimitOption: RATE_LIMIT_OPTION_OBJECT.wait,
                    // 熔断策略
                    circuitBreaker: _getCircuitBreaker()
                },
                needCircuitBreaker: false,
                needMaxQPS: false,
                timeTypeConstant: TIME_TYPE_ARRAY,
                rateLimitOptionConstant: RATE_LIMIT_OPTION_ARRAY
            }
        },
        watch: {
            'editItem': function (newValue, oldValue) {
                this.tempItem = extendByTarget(this.tempItem, clone(newValue))

                if (this.tempItem.maxQPS) {
                    this.needMaxQPS = true
                }

                if (this.tempItem.circuitBreaker) {
                    if (this.tempItem.circuitBreaker.closeTimeout && this.tempItem.circuitBreaker.rateCheckPeriod) {
                        this.needCircuitBreaker = true
                        this.tempItem.circuitBreaker.closeTimeout = toSecond(this.tempItem.circuitBreaker.closeTimeout)
                        this.tempItem.circuitBreaker.rateCheckPeriod = toSecond(this.tempItem.circuitBreaker.rateCheckPeriod)
                    }
                    this.$set(this.tempItem.circuitBreaker, 'closeTimeoutType', TIME_TYPE_OBJECT.second)
                    this.$set(this.tempItem.circuitBreaker, 'rateCheckPeriodType', TIME_TYPE_OBJECT.second)
                } else {
                    this.tempItem.circuitBreaker = _getCircuitBreaker()
                }
            }
        },
        mixins: [StepMixin],

        methods: {
            submitForm() {
                var _tempItemResult = this._formatFormData()
                var _tempItem = _tempItemResult.result
                var result = _tempItemResult.isError
                this.$emit('submitFormStep', result, _tempItem)
            },
            _formatFormData() {
                var _tempItem = clone(this.tempItem)
                var isError = false

                if (!this.needMaxQPS) {
                    _tempItem.maxQPS = ''
                } else {
                    if (!_tempItem.maxQPS) {
                        isError = true
                        this._showMessage('填写支持的最大QPS。')
                    }
                }

                // 熔断规则
                if (!this.needCircuitBreaker) {
                    _tempItem.circuitBreaker = {}
                } else {
                    if (!_tempItem.circuitBreaker.closeTimeout) {
                        isError = true
                        this._showMessage('填写熔断规则的关闭检查间隔时间。')
                    } else if (!_tempItem.circuitBreaker.rateCheckPeriod) {
                        isError = true
                        this._showMessage('填写熔断规则的熔断器检查周期。')
                    } else if (!_tempItem.circuitBreaker.failureRateToClose) {
                        isError = true
                        this._showMessage('填写熔断规则的Open -> Close的错误百分比。')
                    } else if (!_tempItem.circuitBreaker.halfTrafficRate) {
                        isError = true
                        this._showMessage('填写熔断规则的Half限流百分比。')
                    } else if (!_tempItem.circuitBreaker.succeedRateToOpen) {
                        isError = true
                        this._showMessage('填写熔断规则的Half -> Open的成功百分比。')
                    }

                    _tempItem.circuitBreaker.rateCheckPeriod = toNs(_tempItem.circuitBreaker.rateCheckPeriod, _tempItem.circuitBreaker.rateCheckPeriodType)
                    _tempItem.circuitBreaker.closeTimeout = toNs(_tempItem.circuitBreaker.closeTimeout, _tempItem.circuitBreaker.closeTimeoutType)
                }


                return {
                    isError: isError,
                    result: _tempItem
                }
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

    .el-margin-bottom {
        margin-bottom: 10px;
    }
</style>
