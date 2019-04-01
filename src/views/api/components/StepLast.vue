<template>
    <div class="app-container">
        <el-form ref="dataForm" :model="tempItem" label-width="180px">
            <!--默认返回值-->
            <el-form-item label="默认返回值(UseDefault)" style="width: 800px">
                <el-row>
                    <el-col>
                        <el-button type="text" v-show="!needDefaultValue" @click="needDefaultValue = true">添加默认返回值
                        </el-button>
                        <el-card class="box-card" v-show="needDefaultValue">
                            <div slot="header" class="clearfix" style="line-height:25px ">
                                <el-alert :closable="false"
                                          title="默认返回值，当后端Cluster无可用Server的时候，Gateway将返回这个默认值。可以用来做Mock或者后端服务故障时候的默认返回。"
                                          type="warning">
                                </el-alert>
                            </div>
                            <el-row>
                                <el-col :span="4" style="text-align: right;padding-right: 8px;">是否启动:</el-col>
                                <el-col :span="10">
                                    <el-switch v-model="tempItem.useDefault" active-color="#13ce66"
                                               inactive-color="#f1f1f1"></el-switch>
                                    <el-tooltip class="item" effect="dark" placement="top-start">
                                        <div slot="content">如果启用，则强制覆盖整体的默认值。</div>
                                        <i style="margin-left: 10px;color: #909399;" class="el-icon-info"></i>
                                    </el-tooltip>
                                </el-col>
                            </el-row>
                            <el-row class="el-margin-bottom">
                                <el-col :span="4" style="text-align: right;padding-right: 8px;"><span
                                        class="red-icon">*</span> 状态码:
                                </el-col>
                                <el-col :span="10">
                                    <el-input v-model.number="tempItem.defaultValue.code"
                                              placeholder="例如：200，404，500"></el-input>
                                </el-col>
                            </el-row>
                            <el-row class="el-margin-bottom">
                                <el-col :span="4" style="text-align: right;padding-right: 8px;">body 内容:</el-col>
                                <el-col :span="14">
                                    <el-input v-model="tempItem.defaultValue.body" placeholder="body 内容"></el-input>
                                </el-col>
                            </el-row>
                            <el-row class="el-margin-bottom">
                                <el-col :span="4" style="text-align: right;padding-right: 8px;">head 头部:</el-col>
                                <el-col :span="20">
                                    <template v-for="(head,index) in tempItem.defaultValue.headers">
                                        <el-row style="margin-bottom: 8px">
                                            <el-col :span="8">
                                                <el-input v-model="head.name" placeholder="键"></el-input>
                                            </el-col>
                                            <el-col :span="1" style="text-align: center">=</el-col>
                                            <el-col :span="8">
                                                <el-input v-model="head.value" placeholder="值"></el-input>
                                            </el-col>
                                            <el-col v-if="index === 0" :span="1" style="text-align: center">
                                                <span title="添加" @click="addDefaultValueItem('head')"
                                                      style="cursor: pointer"
                                                      class="el-icon-circle-plus-outline"></span>
                                            </el-col>
                                            <el-col v-if="index > 0" :span="1"
                                                    style="text-align: center">
                                                <span title="删除" @click="removeDefaultValueItem('head',index)"
                                                      style="cursor: pointer" class="el-icon-remove-outline"></span>
                                            </el-col>
                                        </el-row>
                                    </template>
                                </el-col>
                            </el-row>
                            <el-row class="el-margin-bottom">
                                <el-col :span="4" style="text-align: right;padding-right: 8px;">set Cookie:</el-col>
                                <el-col :span="20">
                                    <template v-for="(cookie,index) in tempItem.defaultValue.cookies">
                                        <el-row style="margin-bottom: 8px">
                                            <el-col :span="8">
                                                <el-input v-model="cookie.name" placeholder="键"></el-input>
                                            </el-col>
                                            <el-col :span="1" style="text-align: center">=</el-col>
                                            <el-col :span="8">
                                                <el-input v-model="cookie.value" placeholder="值"></el-input>
                                            </el-col>
                                            <el-col v-if="index === 0" :span="1" style="text-align: center">
                                                <span title="添加" @click="addDefaultValueItem('cookie')"
                                                      style="cursor: pointer"
                                                      class="el-icon-circle-plus-outline"></span>
                                            </el-col>
                                            <el-col v-if="index > 0" :span="1"
                                                    style="text-align: center">
                                                <span title="删除" @click="removeDefaultValueItem('cookie',index)"
                                                      style="cursor: pointer" class="el-icon-remove-outline"></span>
                                            </el-col>
                                        </el-row>
                                    </template>
                                </el-col>
                            </el-row>
                        </el-card>
                        <el-button type="text" v-show="needDefaultValue" @click="needDefaultValue = false">移除默认返回值
                        </el-button>
                    </el-col>
                </el-row>
            </el-form-item>

            <!--websocket参数-->
            <el-form-item label="websocket参数">
                <template v-if="needWebsocket">
                    <div>
                        <el-input style="width: 400px" v-model="tempItem.webSocketOptions.origin"
                                  placeholder="origin"></el-input>
                    </div>

                    <el-button type="text" @click="needWebsocket = false">移除websocket参数</el-button>
                </template>
                <template v-else>
                    <el-button type="text" @click="needWebsocket = true">添加websocket参数</el-button>
                </template>

            </el-form-item>
            <!--Auth插件-->
            <el-form-item label="Auth插件">
                <template v-if="needAuthFilter">
                    <div>
                        <el-input v-model="tempItem.authFilter" placeholder="指定该API所使用的Auth插件名称，例如：jwt"
                                  style="width: 450px"></el-input>
                        <el-tooltip class="item" effect="dark" placement="top-start">
                            <div slot="content">指定该API所使用的Auth插件名称。Auth插件的实现可以借鉴JWT插件</div>
                            <i style="margin-left: 10px;color: #909399;" class="el-icon-info"></i>
                        </el-tooltip>
                    </div>
                    <el-button type="text" @click="needAuthFilter = false">移除authFilter参数</el-button>
                </template>
                <template v-else>
                    <el-button type="text" @click="needAuthFilter = true">添加authFilter参数</el-button>
                </template>

            </el-form-item>
            <!--标签-->
            <el-form-item label="标签(Tags)" style="width: 700px">
                <el-row>
                    <el-col>
                        <div class="grid-content" v-show="needTags">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <div style="line-height: 30px;color: #999999">标签</div>
                                    <el-input style="display: inline-block;width: 200px;" v-model="tempTag.name"
                                              placeholder="标签的name"></el-input>
                                    <div style="display: inline-block;width: 250px;">
                                        <el-input placeholder="标签的value" v-model="tempTag.value">
                                            <el-button slot="append" @click="addTag()">添加</el-button>
                                        </el-input>
                                    </div>

                                </div>
                                <div class="text item">
                                    <el-tag style="margin-right: 8px" type="success" closable
                                            v-for="(item,index) in tempItem.tags"
                                            :key="index" @close="removeTag(index)">{{ item.name }}({{item.value}})
                                    </el-tag>
                                </div>
                            </el-card>
                            <el-button type="text" @click="needTags = false">移除标签</el-button>
                        </div>
                        <el-button type="text" v-show="!needTags" @click="needTags = true">添加标签</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
            <!--接口IP的访问控制-->
            <el-form-item label="接口IP的访问控制" style="width: 800px">
                <el-row :gutter="10">
                    <el-col :span="11">
                        <div class="grid-content" v-show="needIpWhite">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <div style="line-height: 30px;color: #999999">IP白名单</div>
                                    <el-input placeholder="IP格式 xxx:xxx:xxx" v-model="tempIp.white">
                                        <el-button slot="append" @click="addIpAccessControl('whitelist')">添加</el-button>
                                    </el-input>
                                </div>
                                <div class="text item" v-for="(item,index) in tempItem.ipAccessControl.whitelist"
                                     :key="index">{{ item }} <span style="float: right;color: #999999;cursor: pointer"
                                                                   @click="removeIpAccessControl('whitelist',index)">移除</span>
                                </div>
                            </el-card>
                            <el-button type="text" @click="needIpWhite = false">移除IP白名单选项</el-button>
                        </div>
                        <el-button type="text" v-show="!needIpWhite" @click="needIpWhite = true">添加IP白名单选项</el-button>
                    </el-col>
                    <el-col :span="11">
                        <div class="grid-content" v-show="needIpBlack">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <div style="line-height: 30px;color: #999999">IP黑名单</div>
                                    <el-input placeholder="IP格式 xxx:xxx:xxx" v-model="tempIp.black">
                                        <el-button slot="append" @click="addIpAccessControl('blacklist')">添加</el-button>
                                    </el-input>
                                </div>
                                <div class="text item" v-for="(item,index) in tempItem.ipAccessControl.blacklist"
                                     :key="index">{{ item }} <span style="float: right;color: #999999;cursor: pointer"
                                                                   @click="removeIpAccessControl('blacklist',index)">移除</span>
                                </div>
                            </el-card>
                            <el-button type="text" @click="needIpBlack = false">移除IP黑名单选项</el-button>
                        </div>
                        <el-button type="text" v-show="!needIpBlack" @click="needIpBlack = true">添加IP黑名单选项</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
            <!--重定义接口返回-->
            <el-form-item label="重定义接口返回" style="width: 700px">
                <el-row v-if="tempItem.renderTemplate.objects.length > 0">
                    <el-col>
                        <div class="grid-content" v-for="(templateItem,index) in tempItem.renderTemplate.objects"
                             :key="index">
                            <el-card class="box-card el-margin-bottom">
                                <div class="title_t">数据集 {{ index+1 }}
                                    <a style="float: right;font-size: 12px;color: #999999;cursor: pointer"
                                       @click="removeRenderTemplateItem(index)">移除节点</a>
                                </div>
                                <el-row>
                                    <el-col :span="6" style="text-align: right;padding-right: 8px;">字段名称:</el-col>
                                    <el-col :span="10">
                                        <el-input v-model.trim="templateItem.name"
                                                  placeholder="字段名称"></el-input>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="6" style="text-align: right;padding-right: 8px;">是否放置根节点:</el-col>
                                    <el-col :span="10">
                                        <el-switch v-model="templateItem.flatAttrs"
                                                   active-color="#13ce66"
                                                   inactive-color="#f1f1f1"></el-switch>
                                        <el-tooltip class="item" effect="dark" placement="top-start">
                                            <div slot="content">如果开启了，则</div>
                                            <i style="margin-left: 10px;color: #909399;" class="el-icon-info"></i>
                                        </el-tooltip>
                                    </el-col>

                                </el-row>
                                <el-row>
                                    <el-col :span="6" style="text-align: right;padding-right: 8px;">属性:</el-col>
                                    <el-col :span="18">
                                        <template v-for="(attr,index) in templateItem.attrs">
                                            <el-row class="el-margin-bottom" :gutter="10">
                                                <el-col :span="8">
                                                    <el-input v-model.trim="attr.name" placeholder="属性键"></el-input>
                                                </el-col>
                                                <el-col :span="8">
                                                    <el-input v-model.trim="attr.extractExp"
                                                              placeholder="属性值"></el-input>
                                                </el-col>
                                                <el-col v-if="index === 0" :span="1" style="text-align: center">
                                            <span title="添加" @click="addTemplateAttrItem(templateItem)"
                                                  style="cursor: pointer"
                                                  class="el-icon-circle-plus-outline"></span>
                                                </el-col>
                                                <el-col v-if="index > 0" :span="1"
                                                        style="text-align: center">
                                            <span title="删除" @click="removeTemplateAttrItem(templateItem,index)"
                                                  style="cursor: pointer" class="el-icon-remove-outline"></span>
                                                </el-col>
                                            </el-row>
                                        </template>
                                    </el-col>
                                </el-row>
                            </el-card>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <div class="grid-content bg-purple" style="padding: 0 5px;text-align: right;"
                         v-if="tempItem.renderTemplate.objects.length > 0">
                        <el-button class="add" size="mini" type="primary" icon="el-icon-plus"
                                   @click="addRenderTemplateItem">新增节点
                        </el-button>
                    </div>
                    <el-button v-else type="text" @click="addRenderTemplateItem">新增节点</el-button>
                </el-row>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {TIME_TYPE_OBJECT, TIME_TYPE_ARRAY} from '~/constant/constant';
    import {extend, clone, extendByTarget, encodeBase64, decodeBase64, toSecond, toNs} from "~/utils";
    import StepMixin from './StepMixin';


    function _getRenderTemplateItem() {
        return {
            name: '',
            attrs: [
                {
                    name: '',
                    extractExp: ''
                }
            ],
            flatAttrs: true
        }
    }

    function _getDefaultValue() {
        return {
            code: '', // 必填
            body: '',
            headers: [
                {name: '', value: ''}
            ],
            cookies: [
                {name: '', value: ''}
            ]
        }
    }

    export default {
        name: "stepLast",
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
                this.tempItem = extendByTarget(this.tempItem, clone(newValue));

                // default value
                if (this.tempItem.defaultValue.code) {
                    this.needDefaultValue = true;
                }

                // default value
                if (!this.tempItem.defaultValue.cookies || this.tempItem.defaultValue.cookies.length == 0) {
                    this.tempItem.defaultValue.cookies = [];
                    this.tempItem.defaultValue.cookies.push({name: '', value: ''});
                }

                if (!this.tempItem.defaultValue.headers || this.tempItem.defaultValue.headers.length == 0) {
                    this.tempItem.defaultValue.headers = [];
                    this.tempItem.defaultValue.headers.push({name: '', value: ''});
                }

                //解码
                if (this.tempItem.defaultValue.body) {
                    this.tempItem.defaultValue.body = decodeBase64(this.tempItem.defaultValue.body);
                }

                // 初始化 ipAccessControl
                if (this.tempItem.ipAccessControl) {
                    if (this.tempItem.ipAccessControl.whitelist) {
                        if (this.tempItem.ipAccessControl.whitelist.length > 0) {
                            this.needIpWhite = true;
                        }

                    } else {
                        this.tempItem.ipAccessControl.whitelist = [];
                    }
                    if (this.tempItem.ipAccessControl.blacklist) {
                        if (this.tempItem.ipAccessControl.blacklist.length > 0) {
                            this.needIpBlack = true;
                        }

                    } else {
                        this.tempItem.ipAccessControl.blacklist = [];
                    }
                }

                // tags
                if (this.tempItem.tags && this.tempItem.tags.length > 0) {
                    this.needTags = true;
                }

                // perms
                if (this.tempItem.perms && this.tempItem.perms.length > 0) {
                    this.needPerm = true;
                }

                // websockets
                if (this.tempItem.webSocketOptions && this.tempItem.webSocketOptions.origin) {
                    this.needWebsocket = true;
                }

                //
                if (this.tempItem.authFilter) {
                    this.needAuthFilter = true;
                }
            }
        },

        data() {
            return {
                tempIp: {
                    white: '',
                    black: ''
                },
                tempTag: {
                    name: '',
                    value: ''
                },
                tempPerm: '',
                tempItem: {
                    // ip 的访问控制。ip 匹配。
                    ipAccessControl: {
                        whitelist: [],
                        blacklist: []
                    },
                    // 默认返回值
                    // 当后端Cluster无可用Server的时候，Gateway将返回这个默认值
                    // 可以用来做Mock或者后端服务故障时候的默认返回。
                    defaultValue: _getDefaultValue(),  //  设置访问这个API需要的权限，需要用户自己开发权限检查插件。
                    useDefault: true,
                    perms: [],
                    // tag 标签，编译维护和检索。
                    tags: [],

                    // 从新定义返回的数据。
                    renderTemplate: {
                        objects: []
                    },
                    // websocket选项，设置该API为websocket
                    webSocketOptions: {
                        origin: ''
                    },
                    authFilter: ''
                },

                timeTypeConstant: TIME_TYPE_ARRAY,
                needDefaultValue: false,
                needTags: false,
                needIpWhite: false,
                needIpBlack: false,
                needPerm: false,
                needWebsocket: false,
                needAuthFilter: false,
            }
        },
        mixins: [StepMixin],
        methods: {

            _formatFormData() {
                var _tempItem = clone(this.tempItem);

                var isError = false;

                if (!this.needDefaultValue) {
                    _tempItem.defaultValue = _getDefaultValue();
                    _tempItem.useDefault = false;
                } else {
                    if (!_tempItem.defaultValue.code) {
                        isError = true;
                        this._showMessage('填写默认返回的状态码。');
                    }


                    if (_tempItem.defaultValue.body) {
                        _tempItem.defaultValue.body = encodeBase64(_tempItem.defaultValue.body);
                    }

                    //
                    if (_tempItem.defaultValue.cookies && _tempItem.defaultValue.cookies.length > 0) {
                        var tempCookiesList = [];
                        _tempItem.defaultValue.cookies.forEach((item) => {
                            if (item.name && item.value) {
                                tempCookiesList.push(item);
                            }
                        });
                        _tempItem.defaultValue.cookies = tempCookiesList;
                    }

                    //
                    if (_tempItem.defaultValue.headers && _tempItem.defaultValue.headers.length > 0) {
                        var tempHeadersList = [];
                        _tempItem.defaultValue.headers.forEach((item) => {
                            if (item.name && item.value) {
                                tempHeadersList.push(item);
                            }
                        });
                        _tempItem.defaultValue.headers = tempHeadersList;
                    }
                }

                // 标签
                if (!this.needTags) {
                    _tempItem.tags = [];
                }

                // 白名单
                if (!this.needIpBlack) {
                    _tempItem.ipAccessControl.blacklist = [];
                }

                // 黑名单
                if (!this.needIpWhite) {
                    _tempItem.ipAccessControl.whitelist = [];
                }

                if (!this.needPerm) {
                    _tempItem.perms = [];
                }

                if (!this.needAuthFilter) {
                    _tempItem.authFilter = '';
                } else {
                    if (!_tempItem.authFilter) {
                        isError = true;
                        this._showMessage('请填写 authFilter 参数。');
                    }
                }


                if (!this.needWebsocket) {
                    _tempItem.webSocketOptions.origin = '';
                } else {
                    if (!_tempItem.webSocketOptions.origin) {
                        isError = true;
                        this._showMessage('请填写 websocket 参数。');
                    }
                }

                return {
                    isError: isError,
                    result: _tempItem
                };
            },

            submitForm() {
                var _tempItemResult = this._formatFormData();
                var _tempItem = _tempItemResult.result;
                var result = _tempItemResult.isError;
                this.$emit('submitFormStep', result, _tempItem);
            },

            addIpAccessControl(type) {
                if (this.tempIp.black !== '' && type === 'blacklist') {
                    this.tempItem.ipAccessControl.blacklist.push(this.tempIp.black);
                    this.tempIp.black = '';
                }
                if (this.tempIp.white !== '' && type === 'whitelist') {
                    this.tempItem.ipAccessControl.whitelist.push(this.tempIp.white);
                    this.tempIp.white = '';
                }
            },

            //
            removeIpAccessControl(type, index) {
                this.$confirm('是否确定移除?', '移除操作', {
                    confirmButtonText: '确定',
                    confirmButtonClass: 'el-button--danger',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (type === 'blacklist') {
                        this.tempItem.ipAccessControl.blacklist.splice(index, 1);
                    }
                    if (type === 'whitelist') {
                        this.tempItem.ipAccessControl.whitelist.splice(index, 1);
                    }
                }).catch(() => {
                });
            },

            addDefaultValueItem(type) {
                var tempItem = {name: '', value: ''};
                if (type === 'head') {
                    this.tempItem.defaultValue.headers.push(tempItem);
                } else if (type === 'cookie') {
                    this.tempItem.defaultValue.cookies.push(tempItem);
                }
            },

            removeDefaultValueItem(type, index) {
                this.$confirm('是否确定移除?', '移除操作', {
                    confirmButtonText: '确定',
                    confirmButtonClass: 'el-button--danger',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (type === 'head') {
                        this.tempItem.defaultValue.headers.splice(index, 1);
                    }
                    if (type === 'cookie') {
                        this.tempItem.defaultValue.cookies.splice(index, 1);
                    }
                }).catch(() => {
                });
            },

            addTag() {
                this.tempItem.tags.push(this.tempTag);
                this.tempTag = {
                    name: '',
                    value: ''
                };
            },

            removeTag(index) {
                this.$confirm('是否确定移除?', '移除操作', {
                    confirmButtonText: '确定',
                    confirmButtonClass: 'el-button--danger',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tempItem.tags.splice(index, 1);
                }).catch(() => {
                });
            },

            addPerm() {
                this.tempItem.perms.push(this.tempPerm);
                this.tempPerm = '';

            },

            removePerm(index) {
                this.$confirm('是否确定移除?', '移除操作', {
                    confirmButtonText: '确定',
                    confirmButtonClass: 'el-button--danger',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tempItem.perms.splice(index, 1);
                }).catch(() => {
                });
            },

            addRenderTemplateItem() {
                var _tempItem = _getRenderTemplateItem();
                this.tempItem.renderTemplate.objects.push(_tempItem);
            },

            //
            removeRenderTemplateItem(index) {
                this.$confirm('是否确定移除?', '移除操作', {
                    confirmButtonText: '确定',
                    confirmButtonClass: 'el-button--danger',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tempItem.renderTemplate.objects.splice(index, 1);
                }).catch(() => {
                });
            },

            //
            addTemplateAttrItem(item) {
                var _temp = {
                    name: '',
                    extractExp: ''
                };
                item.attrs.push(_temp)
            },

            //
            removeTemplateAttrItem(item, index) {
                this.$confirm('是否确定移除?', '移除操作', {
                    confirmButtonText: '确定',
                    confirmButtonClass: 'el-button--danger',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    item.attrs.splice(index, 1);
                }).catch(() => {
                });
            },
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
