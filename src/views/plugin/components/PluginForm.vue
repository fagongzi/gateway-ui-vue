<template>
    <div>
        <el-form ref="form" :model="tempItem" label-width="80px">
            <el-form-item label="名称" prop="name">
                <span v-if="isShow">{{tempItem.name}}</span>
                <el-input v-else v-model="tempItem.name" style="width: 200px" placeholder='插件名称'></el-input>
            </el-form-item>
            <el-form-item label="版本" prop="version">
                <span v-if="isShow">{{tempItem.version}}</span>
                <el-input v-else v-model="tempItem.version" style="width: 200px" placeholder='插件版本号'></el-input>
            </el-form-item>
            <el-form-item label="作者" prop="author">
                <span v-if="isShow">{{tempItem.author}}</span>
                <el-input v-else v-model="tempItem.author" style="width: 200px" placeholder='作者'></el-input>
            </el-form-item>
            <el-form-item label="email" prop="email">
                <span v-if="isShow">{{tempItem.email}}</span>
                <el-input v-else v-model="tempItem.email" style="width: 200px" placeholder='email'></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type">
                <el-select v-model="tempItem.type" placeholder="类型">
                    <el-option v-for="(item,index) in pluginTypeConstant" :label="item.title"
                               :value="item.value" :key="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="内容">
                <div style="width: 800px;height: 500px">
                    <code-mirror v-model="tempItem.tempContent" :options="cmJSOption"></code-mirror>
                </div>
                <div>
                    <el-button type="primary" size="mini">导入JS文件<i class="el-icon-upload el-icon--right"></i>
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item label="配置信息">
                <el-input v-model="tempItem.cfg" type="textarea" style="width: 800px" :rows="3"></el-input>
            </el-form-item>
            <div style="margin-left: 70px">
                <el-button @click="goList">返回</el-button>
                <el-button v-if="isCreate" :loading="submitting" type="primary" @click="createItem('dataForm')">提交
                </el-button>
                <el-button v-else-if="isUpdate" :loading="submitting" type="primary" @click="updateItem('dataForm')">提交
                </el-button>
            </div>
        </el-form>

    </div>
</template>

<script>

    import * as pluginApi from '~/api/plugin';

    import {FORM_OBJECT_TIPS, FORM_OBJECT, PLUGIN_TYPE_ARRAY, PLUGIN_TYPE_OBJECT} from "~/constant/constant";
    import CodeMirror from '~/components/CodeMirror';

    // language
    import 'codemirror/mode/javascript/javascript.js'
    // theme css
    import 'codemirror/theme/monokai.css'

    // require active-line.js
    import 'codemirror/addon/selection/active-line.js'

    // styleSelectedText
    import 'codemirror/addon/selection/mark-selection.js'
    import 'codemirror/addon/search/searchcursor.js'

    // hint
    import 'codemirror/addon/hint/show-hint.js'
    import 'codemirror/addon/hint/show-hint.css'
    import 'codemirror/addon/hint/javascript-hint.js'
    import 'codemirror/addon/selection/active-line.js'

    // highlightSelectionMatches
    import 'codemirror/addon/scroll/annotatescrollbar.js'
    import 'codemirror/addon/search/matchesonscrollbar.js'
    import 'codemirror/addon/search/searchcursor.js'
    import 'codemirror/addon/search/match-highlighter.js'

    // keyMap
    import 'codemirror/mode/clike/clike.js'
    import 'codemirror/addon/edit/matchbrackets.js'
    import 'codemirror/addon/comment/comment.js'
    import 'codemirror/addon/dialog/dialog.js'
    import 'codemirror/addon/dialog/dialog.css'
    import 'codemirror/addon/search/searchcursor.js'
    import 'codemirror/addon/search/search.js'
    import 'codemirror/keymap/sublime.js'

    // foldGutter
    import 'codemirror/addon/fold/foldgutter.css'
    import 'codemirror/addon/fold/brace-fold.js'
    import 'codemirror/addon/fold/comment-fold.js'
    import 'codemirror/addon/fold/foldcode.js'
    import 'codemirror/addon/fold/foldgutter.js'
    import 'codemirror/addon/fold/indent-fold.js'
    import 'codemirror/addon/fold/markdown-fold.js'
    import 'codemirror/addon/fold/xml-fold.js'


    function _getTempItem() {
        return {
            id: undefined,
            name: '',
            author: '',
            email: '',
            status: '',
            updateAt: '',
            version: '',
            type: PLUGIN_TYPE_OBJECT.javaScript,
            content: '',
            cfg: ''
        }
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
            extraKeys: {"Ctrl": "autocomplete"}
        }
    }


    function _getCodeMirrorDefaultOptions() {
        return {}
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
                rules: {},
                tempItem: _getTempItem(),
                pluginTypeConstant: PLUGIN_TYPE_ARRAY,
                tempContent: '',
                cmJSOption: _getCodeMirrorJsOptions()
            }
        },
        components: {CodeMirror},
        //
        watch: {
            'editItem': function (newValue, oldValue) {

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

        },

        methods: {
            init() {

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
                })
            },


            _doCreateItem() {
                var item = clone(this.tempItem);
                this.submitting = true;

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
                })
            },

            //
            _doUpdateItem() {

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

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
