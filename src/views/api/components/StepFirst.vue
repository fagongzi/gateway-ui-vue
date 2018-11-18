<template>
    <div class="app-container">
        <el-form :rules="rules" ref="dataForm" :model="tempItem" label-width="150px">
            <el-form-item label="名称" prop="name">
                <el-input v-model="tempItem.name" style="width: 200px"></el-input>
            </el-form-item>

            <el-form-item label="接口URL匹配模式" prop="urlPattern">
                <el-input v-model="tempItem.urlPattern" auto-complete="off"
                          placeholder="请输入接口URL匹配模式，正则表达式，如：^/api/users/(\\d+)$" style="width: 450px"></el-input>
                <el-tooltip class="item" effect="dark" placement="top-start">
                    <div slot="content">Gateway使用该字段来匹配原始请求的URL。<br/>该字段必须和Method配合使用，同时满足才算这个请求匹配了这个API。</div>
                    <i style="margin-left: 10px;color: #909399;" class="el-icon-info"></i>
                </el-tooltip>
            </el-form-item>

            <el-form-item label="接口请求类型">
                <el-select v-model="tempItem.method" placeholder="接口请求类型" style="width: 200px">
                    <el-option v-for="item in methodsConstant" :key="item.value" :value="item.value"
                               :label="item.title">
                    </el-option>
                </el-select>
                <el-tooltip class="item" effect="dark" placement="top-start">
                    <div slot="content">* 匹配所有的HTTP Method（GET,PUT,POST,DELETE）。<br/>该字段必须和URLPattern配合使用，同时满足才算这个请求匹配了这个API。
                    </div>
                    <i style="margin-left: 10px;color: #909399;" class="el-icon-info"></i>
                </el-tooltip>
            </el-form-item>

            <el-form-item label="匹配优先级">
                <el-input-number v-model="tempItem.position" :min="0" :max="100"
                                 label="匹配优先级"></el-input-number>
                <el-tooltip class="item" effect="dark" placement="top-start">
                    <div slot="content">API匹配时按该值的升序匹配，即值越小优先级越高。默认值为0。</div>
                    <i style="margin-left: 10px;color: #909399;" class="el-icon-info"></i>
                </el-tooltip>
            </el-form-item>

            <el-form-item label="匹配规则">
                <el-select v-model="tempItem.matchRule" placeholder="匹配规则" style="width: 200px">
                    <el-option v-for="item in matchRuleConstant" :key="item.value" :value="item.value"
                               :label="item.title">
                    </el-option>
                </el-select>
                <el-tooltip class="item" effect="dark" placement="top-start">
                    <div slot="content">
                        matchDefault 匹配规则 Domain || (URLPattern && Method) <br/>
                        matchAll 匹配规则 Domain && URLPattern && Method <br/>
                        matchAny 匹配规则 Domain || URLPattern || Method
                    </div>
                    <i style="margin-left: 10px;color: #909399;" class="el-icon-info"></i>
                </el-tooltip>
            </el-form-item>

            <el-form-item label="是否生效">
                <el-switch v-model="tempItem.status" active-color="#13ce66"
                           inactive-color="#f1f1f1"></el-switch>
                <el-tooltip class="item" effect="dark" placement="top-start">
                    <div slot="content">只有开关开着，API 才能生效。</div>
                    <i style="margin-left: 10px;color: #909399;" class="el-icon-info"></i>
                </el-tooltip>
            </el-form-item>

            <el-form-item label="接口请求域名" prop="domain">
                <el-input v-model="tempItem.domain" placeholder="当原始请求的host等于该值，则认为匹配了当前的API"
                          style="width: 450px"></el-input>
                <el-tooltip class="item" effect="dark" placement="top-start">
                    <div slot="content">当原始请求的host等于该值，则认为匹配了当前的API，同时忽略URLPattern和Method。</div>
                    <i style="margin-left: 10px;color: #909399;" class="el-icon-info"></i>
                </el-tooltip>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

    import {
        MATCH_RULE_OBJECT,
        METHODS_ARRAY,
        MATCH_RULE_ARRAY
    } from '~/constant/constant';
    import {extend, clone} from "~/utils";

    export default {
        name: "stepFirst",
        props: {
            editItem: {
                type: Object,
            },
            doValidate: {
                type: Boolean
            }
        },
        watch: {
            //
            'editItem': function (newValue, oldValue) {
                this.tempItem = extend(this.tempItem, clone(newValue));
                this.loading = false;
            },

            'doValidate': function (newValue, oldValue) {
                if (newValue) {
                    this.submitForm();
                }
            }

        },

        data() {
            return {
                tempItem: {
                    name: undefined, // 必填
                    urlPattern: undefined, // 必填
                    method: "*",
                    domain: '', // 必填
                    status: true,
                    position: 0,
                    matchRule: MATCH_RULE_OBJECT.matchDefault,
                },

                methodsConstant: METHODS_ARRAY,

                matchRuleConstant: MATCH_RULE_ARRAY,

                rules: {
                    name: [{required: true, message: '请填写接口名称', trigger: 'change'}],
                    urlPattern: [{required: true, message: '请填写接口URL匹配模式', trigger: 'change'}],
                    domain: [{required: true, message: '接口请求域名', trigger: 'change'}]
                }
            }
        },
        methods: {
            submitForm() {
                this.$refs['dataForm'].validate((valid) => {
                    this.$emit('submitFormStep', !valid, this.tempItem);
                })
            },
            clearValidate() {
                this.$refs['dataForm'].clearValidate();
            }
        }
    }
</script>

<style scoped>

</style>
