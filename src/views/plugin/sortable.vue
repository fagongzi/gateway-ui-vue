<template>
    <div class="app-container">
        <div class="row">
            <div class="col-3" style="float: left;width: 400px;">
                <h3>Draggable 1</h3>
                <draggable class="list-group" :list="sortLeftList" group="people"
                           :options="sortableLeftConfig">
                    <div
                            class="list-group-item"
                            v-for="(element, index) in sortLeftList"
                            :key="element.name"
                    >
                        {{ element.name }} {{ index }}
                    </div>
                </draggable>
            </div>

            <div class="col-3" style="float: left;width: 400px;">
                <h3>Draggable 2</h3>
                <draggable class="list-group" :list="sortRightList" group="people">
                    <div
                            class="list-group-item"
                            v-for="(element, index) in sortRightList"
                            :key="element.name"
                    >
                        {{ element.name }} {{ index }}
                    </div>
                </draggable>
            </div>

        </div>
    </div>
</template>

<script>
    import draggable from 'vuedraggable';
    import * as pluginApi from '~/api/plugin';

    function _formatSortItem(options) {
        return {
            id: options.id,
            name: options.name,
            version: options.version
        }
    }

    const _name = 'pluginSortable';
    export default {
        name: _name,
        data() {
            return {
                loading: true,
                dataList: [], //
                sortLeftList: [],
                sortRightList: [
                    {
                        id: 7,
                        name: 'test7'
                    },
                    {
                        id: 8,
                        name: 'test8'
                    }
                ], // 排序列表
                tempSortable: {},
                dragConfig: {
                    animation: 0,
                    group: "description",
                    disabled: false,
                    ghostClass: "ghost"
                },
                sortableLeftConfig: {
                    // sort: false
                }
            }
        },
        created() {

        },
        mounted() {
            this.init();
        },
        watch: {},
        components: {draggable},
        methods: {
            init() {
                this.loading = true;
                this.getPluginlist();
            },

            getPluginlist() {
                var that = this;
                pluginApi.getAllData().then(function (data) {
                    that.dataList = data || [];
                    that.sortLeftList = that.dataList.map((item) => {
                        return {
                            id: item.id,
                            name: item.name
                        }
                    });
                    that.loading = false;
                    that.getSortable();
                }).catch(function () {
                    that.loading = false;
                });
            },

            getSortable() {
                var that = this;

                pluginApi.getApply().then(function (data) {
                    that.tempSortable = data || {};
                    that.updateSortList();
                }).catch(function () {

                });
            },

            updateSortList() {

            },

            _getPluginById(id) {
                var ret;
                for (var i = 0, len = this.dataList.length; i < len; i++) {
                    var tempItem = this.dataList[i];

                    if (tempItem.id === id) {
                        ret = tempItem;
                        break;
                    }
                }

                return ret;
            },

            updateItem() {

            },

            //
            _doUpdateItem() {

            },

            goList() {
                this.$router.replace({path: '/plugin'});
                this.$destroy();
            },

            changelog(evt) {
                console.log(evt)
            }
        }

    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

    .sortable-wrap {
        width: 810px;
    }

    .sortable-left, .sortable-right {
        width: 400px;
        display: inline-block;
    }

    .list-group {
        display: -ms-flexbox;
        display: -webkit-box;
        display: flex;
        -ms-flex-direction: column;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        flex-direction: column;
        padding-left: 0;
        margin-bottom: 0;
        min-height: 20px;
    }

    .list-group-item {
        position: relative;
        display: block;
        padding: .75rem 1.25rem;
        margin-bottom: -1px;
        background-color: #fff;
        border: 1px solid rgba(0, 0, 0, .125);
        cursor: move;
    }

    .flip-list-move {
        transition: transform 0.5s;
    }

    .no-move {
        transition: transform 0s;
    }
</style>
