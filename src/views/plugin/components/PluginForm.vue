<template>
    <div>
        <el-form :rules="rules" ref="dataForm" :model="tempItem" label-width="80px" v-loading="loading">
            <el-form-item :label="i18n('plugin.name')" prop="name">
                <span v-if="isShow">{{tempItem.name}}</span>
                <el-input v-else v-model="tempItem.name" style="width: 200px" placeholder='插件名称'></el-input>
            </el-form-item>
            <el-form-item :label="i18n('plugin.version')" prop="version">
                <span v-if="isShow">{{tempItem.version}}</span>
                <el-input v-else v-model.number="tempItem.version" style="width: 200px" placeholder='插件版本号'></el-input>
            </el-form-item>
            <el-form-item :label="i18n('plugin.author')" prop="author">
                <span v-if="isShow">{{tempItem.author}}</span>
                <el-input v-else v-model="tempItem.author" style="width: 200px" placeholder='作者'></el-input>
            </el-form-item>
            <el-form-item :label="i18n('plugin.email')" prop="email">
                <span v-if="isShow">{{tempItem.email}}</span>
                <el-input v-else v-model="tempItem.email" style="width: 200px" placeholder='email'></el-input>
            </el-form-item>
            <el-form-item :label="i18n('plugin.type')" prop="type">
                <span v-if="isShow">{{tempItem.type | pluginTypeFilter}}</span>
                <template v-else>
                    <el-select v-model="tempItem.type" :placeholder="i18n('plugin.type')">
                        <el-option v-for="(item,index) in pluginTypeConstant" :label="item.title"
                                   :value="item.value" :key="item.value"></el-option>
                    </el-select>
                </template>
            </el-form-item>
            <el-form-item :label="i18n('plugin.content')" prop="content">
                <div v-if="!isShow">
                    <el-button type="primary" size="mini" @click="handleSelectFile">{{i18n('btn.importCode')}}<i
                            class="el-icon-upload el-icon--right"></i>
                    </el-button>
                    <!--<el-tooltip class="item" effect="dark" placement="top">-->
                    <!--<div slot="content">方式一：选中所要格式化的代码，点击'格式化代码'按钮。<br/> 方式二：不选中，默认全部格式化。</div>-->
                    <!--</el-tooltip>-->
                    <el-button type="primary" size="mini" @click="formatContent">{{i18n('btn.formatCode')}}</el-button>
                    <el-tooltip class="item" effect="dark" placement="top-start">
                        <div slot="content">支持直接.js或者.txt文件导入，支持在线编写和修改</div>
                        <i style="margin-left: 10px;color: #909399;" class="el-icon-info"></i>
                    </el-tooltip>
                    <input class="el-upload__input" type="file" ref="fileInput" @change="handleFileChange">
                </div>
                <div style="width: 800px;height: 500px">
                    <code-mirror ref="codeMirror" v-model="tempItem.content" :options="cmJSOption"></code-mirror>
                </div>

            </el-form-item>
            <el-form-item :label="i18n('plugin.config')">
                <span v-if="isShow">{{tempItem.cfg}}</span>
                <el-input v-else v-model="tempItem.cfg" type="textarea" style="width: 800px" :rows="3"></el-input>
            </el-form-item>
            <!--<el-form-item label="是否启用">-->
            <!--<el-switch :disabled="isShow" v-model="tempItem.status" active-color="#13ce66"-->
            <!--inactive-color="#f1f1f1"></el-switch>-->
            <!--<el-tooltip class="item" effect="dark" placement="top-start">-->
            <!--<div slot="content">只有开关开着，插件才能生效。</div>-->
            <!--<i style="margin-left: 10px;color: #909399;" class="el-icon-info"></i>-->
            <!--</el-tooltip>-->
            <!--</el-form-item>-->
            <div style="margin-left: 70px">
                <el-button @click="goList">{{i18n('btn.return')}}</el-button>
                <el-button type="primary" v-if="isShow" @click="goEdit()">{{i18n('btn.edit')}}</el-button>
                <el-button v-if="isCreate" :loading="submitting" type="primary" @click="createItem('dataForm')">{{i18n('btn.submit')}}
                </el-button>
                <el-button v-else-if="isUpdate" :loading="submitting" type="primary" @click="updateItem('dataForm')">{{i18n('btn.submit')}}
                </el-button>
            </div>
        </el-form>

    </div>
</template>

<script>

    import * as pluginApi from '~/api/plugin';

    import {
        FORM_OBJECT_TIPS,
        FORM_OBJECT,
        PLUGIN_TYPE_ARRAY,
        PLUGIN_TYPE_OBJECT,
        STATUS_OBJECT
    } from "~/constant/constant";
    import CodeMirror from '~/components/CodeMirror';
    import {getFileContent, clone, encodeBase64, extendByTarget, decodeBase64} from "~/utils";
    import i18nMixin from '../../mixin/i18n';

    // language
    import 'codemirror/mode/javascript/javascript.js';
    // theme css
    import 'codemirror/theme/monokai.css';

    // require active-line.js
    import 'codemirror/addon/selection/active-line.js';

    // styleSelectedText
    import 'codemirror/addon/selection/mark-selection.js';
    import 'codemirror/addon/search/searchcursor.js';

    // hint
    import 'codemirror/addon/hint/show-hint.js';
    import 'codemirror/addon/hint/show-hint.css';
    import 'codemirror/addon/hint/javascript-hint.js';
    import 'codemirror/addon/selection/active-line.js';

    // highlightSelectionMatches
    import 'codemirror/addon/scroll/annotatescrollbar.js';
    import 'codemirror/addon/search/matchesonscrollbar.js';
    import 'codemirror/addon/search/searchcursor.js';
    import 'codemirror/addon/search/match-highlighter.js';

    // keyMap
    import 'codemirror/mode/clike/clike.js';
    import 'codemirror/addon/edit/matchbrackets.js';
    import 'codemirror/addon/comment/comment.js';
    import 'codemirror/addon/dialog/dialog.js';
    import 'codemirror/addon/dialog/dialog.css';
    import 'codemirror/addon/search/searchcursor.js';
    import 'codemirror/addon/search/search.js';
    import 'codemirror/keymap/sublime.js';

    // foldGutter
    import 'codemirror/addon/fold/foldgutter.css';
    import 'codemirror/addon/fold/brace-fold.js';
    import 'codemirror/addon/fold/comment-fold.js';
    import 'codemirror/addon/fold/foldcode.js';
    import 'codemirror/addon/fold/foldgutter.js';
    import 'codemirror/addon/fold/indent-fold.js';
    import 'codemirror/addon/fold/markdown-fold.js';
    import 'codemirror/addon/fold/xml-fold.js';


    function _getTempItem() {
        return {
            id: undefined,
            name: '',
            author: '',
            email: '',
            // status: true,
            updateAt: undefined,
            version: undefined,
            type: PLUGIN_TYPE_OBJECT.javaScript,
            content: '',
            cfg: ''
        };
    }

    function _getCodeMirrorJsOptions() {
        return {
            mode: 'text/javascript', // 代码编辑器
            tabSize: 4,
            styleActiveLine: false,
            lineNumbers: true,
            styleSelectedText: false,
            line: true,
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true},

            // hint.js options
            hintOptions: {
                // 当匹配只有一项的时候是否自动补全
                // completeSingle: false,
                tables: {
                    users: ['name', 'score', 'birthDate'],
                    countries: ['name', 'population', 'size']
                }
            },
            //快捷键 可提供三种模式 sublime、emacs、vim
            keyMap: "sublime",
            matchBrackets: true,
            showCursorWhenSelecting: true,
            theme: "monokai",
            extraKeys: {"Ctrl": "autocomplete"},
            readOnly: ''
        };
    }


    export default {
        name: "PluginForm",
        //
        props: {
            showType: {
                type: String,
                default: FORM_OBJECT.create
            },
            editItem: {
                type: Object,
            }
        },
        //
        data() {
            return {
                loading: true,
                submitting: false,
                rules: {
                    name: [{required: true, message: '请填写名称', trigger: 'change'}],
                    version: [{required: true, message: '请填写版本', trigger: 'change'}],
                    content: [{required: true, message: '请填写版本', trigger: 'change'}],
                },
                tempItem: _getTempItem(),
                pluginTypeConstant: PLUGIN_TYPE_ARRAY,
                cmJSOption: _getCodeMirrorJsOptions()
            };
        },
        mixins: [i18nMixin],
        components: {CodeMirror},
        //
        watch: {
            'editItem': function (newValue, oldValue) {
                var tempValue = newValue;
                tempValue.content = decodeBase64(tempValue.content || '');
                tempValue.cfg = decodeBase64(tempValue.cfg || '');
                // tempValue.status = tempValue.status === STATUS_OBJECT.up ? true : false;
                this.tempItem = extendByTarget(this.tempItem, clone(tempValue));
                this.loading = false;
                this.submitting = false;
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

        methods: {
            init() {
                if (this._isShow()) {
                    this.rules = {};
                    this.cmJSOption.readOnly = 'nocursor';
                } else if (this._isCreate()) {
                    this.loading = false;
                }
            },

            goList() {
                this.$router.replace({path: '/plugin'});
                this.$destroy();
            },

            goEdit() {
                this.$router.push({path: '/plugin/edit', query: {id: this.tempItem.id}});
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
                });
            },


            _doCreateItem() {
                var item = clone(this.tempItem);

                // item.status = item.status ? 1 : 0;
                item.content = encodeBase64(item.content || '');
                item.cfg = encodeBase64(item.cfg || '');

                this.submitting = true;

                pluginApi.updateItem(item).then(() => {
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

            //
            updateItem(dataForm) {
                if (this.submitting) {
                    return;
                }

                this.$refs[dataForm].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this._doUpdateItem();
                });
            },

            //
            _doUpdateItem() {
                var item = clone(this.tempItem);
                this.submitting = true;
                // item.status = item.status ? 1 : 0;
                item.content = encodeBase64(item.content || '');
                item.cfg = encodeBase64(item.cfg || '');

                pluginApi.updateItem(item).then(() => {
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

            //
            handleSelectFile() {
                this.$refs.fileInput.value = null;
                this.$refs.fileInput.click();
            },

            //
            handleFileChange(ev) {
                const files = ev.target.files;
                if (!files || files.length === 0) return;
                var that = this;
                const file = files[0];
                const fileTypes = ['text/javascript', 'text/plain'];

                if (!fileTypes.includes(file.type)) {
                    that._showMessage('暂不支持解析该类型的文件');
                    return false;
                }


                getFileContent(file).then(function (content) {
                    that.$set(that.tempItem, 'content', content);
                }).catch(function (error) {
                    that._showMessage(error || '无法读取文件内容');
                });
            },

            //
            formatContent() {
                var $codeMirror = this.$refs.codeMirror.$data.codemirror;

                $codeMirror.execCommand('selectAll');
                this.$nextTick(() => {
                    if ($codeMirror && $codeMirror.autoFormatRange) {
                        $codeMirror.autoFormatRange($codeMirror.getCursor(true), $codeMirror.getCursor(false));
                    }
                });
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
    };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
