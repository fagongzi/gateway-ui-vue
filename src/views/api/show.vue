<template>
    <div class="app-container">
        <div class="grid-content el-margin-bottom">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>基础信息</span>
                </div>
                <el-form label-width="150px">
                    <el-form-item label="名称">
                        <span>{{tempItem.name}}</span>
                    </el-form-item>

                    <el-form-item label="接口URL匹配模式">
                        <span>{{tempItem.urlPattern}}</span>
                        <el-tooltip class="item" effect="dark" placement="top-start">
                            <div slot="content">Gateway使用该字段来匹配原始请求的URL。<br/>该字段必须和Method配合使用，同时满足才算这个请求匹配了这个API。</div>
                            <i style="margin-left: 10px;color: #909399;" class="el-icon-info"></i>
                        </el-tooltip>
                    </el-form-item>

                    <el-form-item label="接口请求类型">
                        <span>{{tempItem.method}}</span>
                        <el-tooltip class="item" effect="dark" placement="top-start">
                            <div slot="content">* 匹配所有的HTTP Method（GET,PUT,POST,DELETE）。<br/>该字段必须和URLPattern配合使用，同时满足才算这个请求匹配了这个API。
                            </div>
                            <i style="margin-left: 10px;color: #909399;" class="el-icon-info"></i>
                        </el-tooltip>
                    </el-form-item>

                    <el-form-item label="匹配优先级">
                        <span>{{tempItem.position}}</span>
                        <el-tooltip class="item" effect="dark" placement="top-start">
                            <div slot="content">API匹配时按该值的升序匹配，即值越小优先级越高。默认值为0。</div>
                            <i style="margin-left: 10px;color: #909399;" class="el-icon-info"></i>
                        </el-tooltip>
                    </el-form-item>

                    <el-form-item label="匹配规则">
                        <span>{{tempItem.matchRule | matchRuleFilter}}</span>
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
                        <el-switch :disabled="true" v-model="tempItem.status" active-color="#13ce66"
                                   inactive-color="#f1f1f1"></el-switch>
                        <el-tooltip class="item" effect="dark" placement="top-start">
                            <div slot="content">只有开关开着，API 才能生效。</div>
                            <i style="margin-left: 10px;color: #909399;" class="el-icon-info"></i>
                        </el-tooltip>
                    </el-form-item>

                    <el-form-item label="接口请求域名">
                        <span>{{tempItem.domain}}</span>
                        <el-tooltip class="item" effect="dark" placement="top-start">
                            <div slot="content">当原始请求的host等于该值，则认为匹配了当前的API，同时忽略URLPattern和Method。</div>
                            <i style="margin-left: 10px;color: #909399;" class="el-icon-info"></i>
                        </el-tooltip>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <div class="grid-content el-margin-bottom">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>接口信息</span>
                </div>
                <div v-for="(item,index) in tempItem.nodes">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>接口{{index+1}}</span>
                        </div>
                        <el-form label-width="150px">
                            <el-form-item label="集群:" class="inline-item">
                                <span>{{item.clusterID}}</span>
                            </el-form-item>
                            <el-form-item label="节点标示名:" class="inline-item">
                                <span>{{item.attrName}}</span>
                            </el-form-item>
                            <el-form-item label="url重写规则:" class="inline-item">
                                <span>{{item.urlRewrite}}</span>
                            </el-form-item>
                            <el-form-item label="写超时:" class="inline-item">
                                <span>{{item.writeTimeout}}</span>
                            </el-form-item>
                            <el-form-item label="读超时:" class="inline-item">
                                <span>{{item.readTimeout}}</span>
                            </el-form-item>
                            <el-form-item label="batchIndex:" class="inline-item">
                                <span>{{item.batchIndex}}</span>
                            </el-form-item>
                            <el-form-item label="http默认值:" class="form-item-block">
                                <el-row :gutter="10">
                                    <el-col :span="4">
                                        <label for="">开关：
                                            <el-switch :disabled="true" v-model="item.useDefault" active-color="#13ce66"
                                                       inactive-color="#f1f1f1"></el-switch>
                                        </label>

                                        <el-tooltip class="item" effect="dark" placement="top-start">
                                            <div slot="content">当该值为True且DefaultValue存在时，直接使用DefaultValue作为返回值。</div>
                                            <i style="margin-left: 10px;color: #909399;" class="el-icon-info"></i>
                                        </el-tooltip>
                                    </el-col>
                                    <el-col :span="6">
                                        <label for="">状态码：<span>{{item.defaultValue.code}}</span>
                                        </label>

                                    </el-col>
                                    <el-col :span="10">
                                        <label for="">body 内容：<span>{{item.defaultValue.body}}</span>
                                        </label>
                                    </el-col>
                                </el-row>
                                <el-row class="el-margin-bottom" v-if="item.defaultValue.headers">
                                    <el-col :span="3" style="padding-right: 8px;text-align: right">
                                        <label for="">head头部:</label>
                                    </el-col>
                                    <el-col :span="20">
                                        <template v-for="(head,index) in item.defaultValue.headers">
                                            <span v-if="head.name && head.value">{{head.name}} : {{head.value}}</span>
                                        </template>
                                    </el-col>
                                </el-row>
                                <el-row class="el-margin-bottom" v-if="item.defaultValue.cookies">
                                    <el-col :span="3" style="padding-right: 8px;text-align: right"><label
                                            for="">cookie内容:</label></el-col>
                                    <el-col :span="20">
                                        <template v-for="(cookie,index) in item.defaultValue.cookies">
                                            <span v-if="cookie.name && cookie.value">{{cookie.name}} : {{cookie.value}}</span>
                                        </template>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="retryStrategy:" class="form-item-block" v-if="item.retryStrategy">
                                <el-row :gutter="10">
                                    <el-col :span="6">
                                        <label for="">interval：<span>{{item.retryStrategy.interval}}</span>
                                        </label>
                                    </el-col>
                                    <el-col :span="8">
                                        <label for="">maxTimes：<span>{{item.retryStrategy.maxTimes}}</span>
                                        </label>
                                    </el-col>
                                    <el-col :span="8">
                                        <label for="">codes：
                                            <span v-for="(itemCode,index) in item.retryStrategy.codes">{{itemCode}},</span>
                                        </label>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="cache:" class="form-item-block" v-if="item.cache">
                                <el-row :gutter="10">
                                    <el-col :span="3" style="text-align: right">
                                        <label for="">deadline:</label>
                                    </el-col>
                                    <el-col :span="6">
                                        <span>{{item.cache.deadline}}</span>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="10" style="margin-top: 10px">
                                    <el-col :span="3" style="text-align: right">
                                        <label for="">keys:</label>
                                    </el-col>
                                    <el-col :span="21">
                                        <template v-for="(key,index) in item.cache.keys">
                                            <el-row class="el-margin-bottom" :gutter="10">
                                                <el-col :span="6">
                                                    <span>name: {{key.name}}</span>
                                                </el-col>
                                                <el-col :span="6">
                                                    <span>source：{{key.source |sourceFilter}}</span>
                                                </el-col>
                                                <el-col :span="6">
                                                    <span>index：{{key.index}}</span>
                                                </el-col>
                                            </el-row>
                                        </template>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="10" style="margin-top: 10px">
                                    <el-col :span="3" style="text-align: right"><label for="">conditions:</label>
                                    </el-col>
                                    <el-col :span="21">
                                        <template v-for="(condition,index) in item.cache.conditions">
                                            <el-row class="el-margin-bottom" :gutter="10">
                                                <el-col :span="4">
                                                    <span>name: {{condition.parameter.name}}</span>
                                                </el-col>
                                                <el-col :span="4">
                                                    <span>source: {{condition.parameter.source |sourceFilter}}</span>
                                                </el-col>
                                                <el-col :span="4">
                                                    <span>index: {{condition.parameter.index}}</span>
                                                </el-col>
                                                <el-col :span="4">
                                                    <span>操作符: {{condition.cmp |cmpFilter}}</span>
                                                </el-col>
                                                <el-col :span="4">
                                                    <span>expect: {{condition.expect}}</span>
                                                </el-col>
                                            </el-row>
                                        </template>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="validations:" class="form-item-block" v-if="item.validations">
                                <div>
                                    <template v-for="(validation,index) in item.validations">
                                        <div style="overflow: hidden">
                                            <el-row :gutter="10">
                                                <el-col :span="4">
                                                    <span>name: {{validation.parameter.name}}</span>
                                                </el-col>
                                                <el-col :span="4">
                                                    <span>source: {{validation.parameter.source |sourceFilter}}</span>
                                                </el-col>
                                                <el-col :span="4">
                                                    <span>index: {{validation.parameter.index}}</span>
                                                </el-col>
                                                <el-col :span="4">
                                                    <span>expression: {{validation.rules[0].expression}}</span>
                                                </el-col>
                                                <el-col :span="4">
                                                    <el-checkbox-group :disabled="true" v-model="validation.required"
                                                                       style="color: #666666;float: left">
                                                        <el-checkbox label="是否必须" name="type"></el-checkbox>
                                                    </el-checkbox-group>
                                                </el-col>
                                            </el-row>
                                        </div>
                                    </template>
                                </div>
                            </el-form-item>
                        </el-form>
                    </el-card>
                </div>

            </el-card>
        </div>
        <div class="grid-content">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>其他信息</span>
                </div>
                <el-form label-width="150px">
                    <el-form-item label="默认返回值" style="width: 800px">
                        <el-row>
                            <el-col>
                                <el-card class="box-card">
                                    <el-row>
                                        <el-col :span="4" style="text-align: right;padding-right: 8px;">是否启动:</el-col>
                                        <el-col :span="10">
                                            <el-switch :disabled="true" v-model="tempItem.useDefault"
                                                       active-color="#13ce66"
                                                       inactive-color="#f1f1f1"></el-switch>
                                            <el-tooltip class="item" effect="dark" placement="top-start">
                                                <div slot="content">当该值为True且DefaultValue存在时，直接使用DefaultValue作为返回值。
                                                </div>
                                                <i style="margin-left: 10px;color: #909399;" class="el-icon-info"></i>
                                            </el-tooltip>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="4" style="text-align: right;padding-right: 8px;">状态码:</el-col>
                                        <el-col :span="10">
                                            <span>{{tempItem.defaultValue && tempItem.defaultValue.code}}</span>
                                        </el-col>
                                    </el-row>
                                    <el-row class="el-margin-bottom">
                                        <el-col :span="4" style="text-align: right;padding-right: 8px;">body 内容:
                                        </el-col>
                                        <el-col :span="14">
                                            <span>{{tempItem.defaultValue && tempItem.defaultValue.body}}</span>
                                        </el-col>
                                    </el-row>
                                    <el-row class="el-margin-bottom"
                                            v-if="tempItem.defaultValue && tempItem.defaultValue.headers">
                                        <el-col :span="4" style="text-align: right;padding-right: 8px;">head 头部:
                                        </el-col>
                                        <el-col :span="20">
                                            <template v-for="(head,index) in tempItem.defaultValue.headers">
                                                <span v-if="head.name && head.value">{{head.name}} : {{head.value}}</span>
                                            </template>
                                        </el-col>
                                    </el-row>
                                    <el-row class="el-margin-bottom"
                                            v-if="tempItem.defaultValue && tempItem.defaultValue.cookies">
                                        <el-col :span="4" style="text-align: right;padding-right: 8px;">set Cookie:
                                        </el-col>
                                        <el-col :span="20">
                                            <template v-for="(cookie,index) in tempItem.defaultValue.cookies">
                                                <span v-if="cookie.name && cookie.value">{{cookie.name}} : {{cookie.value}}</span>
                                            </template>
                                        </el-col>
                                    </el-row>
                                </el-card>
                            </el-col>
                        </el-row>
                    </el-form-item>

                    <el-form-item label="Auth插件">
                        <span>{{tempItem.authFilter}}</span>
                        <el-tooltip class="item" effect="dark" placement="top-start">
                            <div slot="content">指定该API所使用的Auth插件名称。Auth插件的实现可以借鉴JWT插件</div>
                            <i style="margin-left: 10px;color: #909399;" class="el-icon-info"></i>
                        </el-tooltip>
                    </el-form-item>

                    <el-form-item label="websocket参数">
                        <span>{{tempItem.webSocketOptions && tempItem.webSocketOptions.origin}}</span>
                    </el-form-item>

                    <el-form-item label="标签">
                        <el-tag style="margin-right: 8px" type="success"
                                v-for="(item,index) in tempItem.tags"
                                :key="index">{{ item.name }}({{item.value}})
                        </el-tag>
                    </el-form-item>
                    <el-form-item label="接口IP的访问控制" style="width: 800px">
                        <el-row :gutter="10" v-if="tempItem.ipAccessControl && tempItem.ipAccessControl.whitelist">
                            <el-col :span="11">
                                <el-card class="box-card">
                                    <div class="text item" v-for="(item,index) in tempItem.ipAccessControl.whitelist"
                                         :key="index">{{ item }}
                                    </div>
                                </el-card>

                            </el-col>
                            <el-col :span="11" v-if="tempItem.ipAccessControl && tempItem.ipAccessControl.blacklist">

                                <el-card class="box-card">
                                    <div class="text item"
                                         v-for="(item,index) in tempItem.ipAccessControl.blacklist"
                                         :key="index">{{ item }}
                                    </div>
                                </el-card>

                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="访问权限" style="width: 700px;">
                        <el-card class="box-card">
                            <div class="text item" v-for="(item,index) in tempItem.perms"
                                 :key="index">{{ item }}
                            </div>
                        </el-card>

                    </el-form-item>

                    <el-form-item label="重定义接口返回">
                        <el-row v-if="tempItem.renderTemplate && tempItem.renderTemplate.objects && tempItem.renderTemplate.objects.length > 0">
                            <el-col>
                                <div class="grid-content"
                                     v-for="(templateItem,index) in tempItem.renderTemplate.objects"
                                     :key="index">
                                    <el-card class="box-card el-margin-bottom">
                                        <div class="title_t">数据集 {{ index+1 }}
                                        </div>
                                        <el-row>
                                            <el-col :span="4" style="text-align: right;padding-right: 8px;">字段名称:
                                            </el-col>
                                            <el-col :span="10">
                                                <span>{{templateItem.name}}</span>
                                            </el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="4" style="text-align: right;padding-right: 8px;">flagAttrs:
                                            </el-col>
                                            <el-col :span="10">
                                                <el-switch :disabled="true" v-model="templateItem.flatAttrs"
                                                           active-color="#13ce66"
                                                           inactive-color="#f1f1f1"></el-switch>
                                            </el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="4" style="text-align: right;padding-right: 8px;">属性:</el-col>
                                            <el-col :span="20">
                                                <template v-for="(attr,index) in templateItem.attrs">
                                                    <el-row class="el-margin-bottom" :gutter="10">
                                                        <el-col :span="8">
                                                            <span>name: {{attr.name}}</span>
                                                        </el-col>
                                                        <el-col :span="8">
                                                            <span>value: {{attr.extractExp}}</span>
                                                        </el-col>
                                                    </el-row>
                                                </template>
                                            </el-col>
                                        </el-row>
                                    </el-card>
                                </div>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>

        <div style="margin-left: 70px;margin-top: 20px">
            <el-button @click="goList">返回</el-button>
            <el-button type="primary" @click="goEdit()">编辑</el-button>

        </div>
    </div>
</template>

<script>
    import * as apiApi from '~/api/api';

    const _name = 'apiShow';
    export default {
        name: _name,
        watch: {
            '$route': function (to, from) {
                if (to.name != _name) {
                    this.$destroy();
                }
            }
        },
        data() {
            return {
                tempItem: {},
                loading: true,
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.id = this.$route.query.id;
                let id = this.id;
                if (!id) {
                    return;
                }
                apiApi.getItemById(id).then((item) => {
                    item = item || {};
                    item.status = item.status == 1 ? true : false;
                    this.tempItem = item;
                });
            },

            goList() {
                this.$router.replace({path: '/api'});
                this.$destroy();
            },

            goEdit() {
                this.$router.push({path: '/api/edit', query: {id: this.tempItem.id}});
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
</style>
