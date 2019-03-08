<template>
    <div class="vue-codemirror" :class="{ merge }">
        <div ref="mergeview" v-if="merge"></div>
        <textarea v-else ref="textarea" :name="name" :placeholder="placeholder" ></textarea>
    </div>
</template>

<script>
    import _CodeMirror from 'codemirror';

    const CodeMirror = window.CodeMirror || _CodeMirror;
    // require styles
    import 'codemirror/lib/codemirror.css'


    CodeMirror.extendMode("javascript", {
        commentStart: "/*",
        commentEnd: "*/",
        // FIXME semicolons inside of for
        newlineAfterToken: function (type, content, textAfter, state) {
            if (this.jsonMode) {
                return /^[\[,{]$/.test(content) || /^}/.test(textAfter);
            } else {
                if (content == ";" && state.lexical && state.lexical.type == ")") return false;
                return /^[;{}]$/.test(content) && !/^;/.test(textAfter);
            }
        }
    });


    // Applies automatic formatting to the specified range
    CodeMirror.defineExtension("autoFormatRange", function (from, to) {

        var cm = this;

        var outer = cm.getMode(), text = cm.getRange(from, to).split("\n");
        var state = CodeMirror.copyState(outer, cm.getTokenAt(from).state);
        var tabSize = cm.getOption("tabSize");

        var out = "", lines = 0, atSol = from.ch == 0;

        //
        function newline() {
            out += "\n";
            atSol = true;
            ++lines;
        }

        for (var i = 0; i < text.length; ++i) {

            var stream = new CodeMirror.StringStream(text[i], tabSize);

            //
            while (!stream.eol()) {

                var inner = CodeMirror.innerMode(outer, state);

                var style = outer.token(stream, state), cur = stream.current();

                stream.start = stream.pos;

                if (!atSol || /\S/.test(cur)) {
                    out += cur;
                    atSol = false;
                }

                if (!atSol && inner.mode.newlineAfterToken &&
                    inner.mode.newlineAfterToken(style, cur, stream.string.slice(stream.pos) || text[i + 1] || "", inner.state))
                    newline();
            }

            if (!stream.pos && outer.blankLine) outer.blankLine(state);

            if (!atSol) newline();
        }

        cm.operation(function () {

            cm.replaceRange(out, from, to);

            for (var cur = from.line + 1, end = from.line + lines; cur <= end; ++cur)
                cm.indentLine(cur, "smart");

            cm.setSelection(from, cm.getCursor(false));
        });
    });


    export default {
        name: "CodeMirror",
        data() {
            return {
                content: '',
                codemirror: null,
                cminstance: null
            }
        },
        props: {
            code: String,
            value: String,
            marker: Function,
            unseenLines: Array,
            name: {
                type: String,
                default: 'codemirror'
            },
            placeholder: {
                type: String,
                default: ''
            },
            merge: {
                type: Boolean,
                default: false
            },
            options: {
                type: Object,
                default: () => ({})
            },
            events: {
                type: Array,
                default: () => ([])
            },
            globalOptions: {
                type: Object,
                default: () => ({})
            },
            globalEvents: {
                type: Array,
                default: () => ([])
            }
        },
        watch: {
            options: {
                deep: true,
                handler(options) {
                    for (const key in options) {
                        this.cminstance.setOption(key, options[key])
                    }
                }
            },
            merge() {
                this.$nextTick(this.switchMerge)
            },
            code(newVal) {
                this.handerCodeChange(newVal)
            },
            value(newVal) {
                this.handerCodeChange(newVal)
            },
        },

        methods: {
            initialize() {
                const cmOptions = Object.assign({}, this.globalOptions, this.options)
                if (this.merge) {
                    this.codemirror = CodeMirror.MergeView(this.$refs.mergeview, cmOptions)
                    this.cminstance = this.codemirror.edit
                } else {
                    this.codemirror = CodeMirror.fromTextArea(this.$refs.textarea, cmOptions)
                    this.cminstance = this.codemirror
                    this.cminstance.setValue(this.code || this.value || this.content)
                }
                this.cminstance.on('change', cm => {
                    this.content = cm.getValue()
                    if (this.$emit) {
                        this.$emit('input', this.content)
                    }
                })
                // 所有有效事件（驼峰命名）+ 去重
                const tmpEvents = {}
                const allEvents = [
                    'scroll',
                    'changes',
                    'beforeChange',
                    'cursorActivity',
                    'keyHandled',
                    'inputRead',
                    'electricInput',
                    'beforeSelectionChange',
                    'viewportChange',
                    'swapDoc',
                    'gutterClick',
                    'gutterContextMenu',
                    'focus',
                    'blur',
                    'refresh',
                    'optionChange',
                    'scrollCursorIntoView',
                    'update'
                ]
                    .concat(this.events)
                    .concat(this.globalEvents)
                    .filter(e => (!tmpEvents[e] && (tmpEvents[e] = true)))
                    .forEach(event => {
                        // 循环事件，并兼容 run-time 事件命名
                        this.cminstance.on(event, (...args) => {
                            // console.log('当有事件触发了', event, args)
                            this.$emit(event, ...args)
                            const lowerCaseEvent = event.replace(/([A-Z])/g, '-$1').toLowerCase()
                            if (lowerCaseEvent !== event) {
                                this.$emit(lowerCaseEvent, ...args)
                            }
                        })
                    })
                this.$emit('ready', this.codemirror)
                this.unseenLineMarkers()
                // prevents funky dynamic rendering
                this.refresh()
            },
            refresh() {
                this.$nextTick(() => {
                    this.cminstance.refresh()
                })
            },
            destroy() {
                // garbage cleanup
                const element = this.cminstance.doc.cm.getWrapperElement()
                element && element.remove && element.remove()
            },
            handerCodeChange(newVal) {
                const cm_value = this.cminstance.getValue()
                if (newVal !== cm_value) {
                    const scrollInfo = this.cminstance.getScrollInfo()
                    this.cminstance.setValue(newVal)
                    this.content = newVal
                    this.cminstance.scrollTo(scrollInfo.left, scrollInfo.top)
                }
                this.unseenLineMarkers()
            },
            unseenLineMarkers() {
                if (this.unseenLines !== undefined && this.marker !== undefined) {
                    this.unseenLines.forEach(line => {
                        const info = this.cminstance.lineInfo(line)
                        this.cminstance.setGutterMarker(line, 'breakpoints', info.gutterMarkers ? null : this.marker())
                    })
                }
            },
            switchMerge() {
                // Save current values
                const history = this.cminstance.doc.history
                const cleanGeneration = this.cminstance.doc.cleanGeneration
                this.options.value = this.cminstance.getValue()
                this.destroy()
                this.initialize()
                // Restore values
                this.cminstance.doc.history = history
                this.cminstance.doc.cleanGeneration = cleanGeneration
            }
        },

        mounted() {
            this.initialize()
        },
        beforeDestroy() {
            this.destroy()
        }
    }
</script>

<style>
    .vue-codemirror {
        line-height: 1.4;
    }

    /* 默认高度 */
    .vue-codemirror .CodeMirror {
        height: 500px;
    }
</style>
