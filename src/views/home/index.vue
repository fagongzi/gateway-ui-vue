<template>
    <div class="app-container">
        <el-row :gutter="30">
            <el-col :span="6">
                <router-link to="/api">
                    <el-card class="box-card">
                        <div class="box-card-left">{{i18n('nav.api')}}</div>
                        <div class="box-card-right">{{i18n('home.count')}}：{{apiNum}}</div>
                    </el-card>
                </router-link>
            </el-col>
            <el-col :span="6">
                <router-link to="/cluster">
                    <el-card class="box-card">
                        <div class="box-card-left">{{i18n('nav.cluster')}}</div>
                        <div class="box-card-right">{{i18n('home.count')}}：{{clusterNum}}</div>
                    </el-card>
                </router-link>
            </el-col>
            <el-col :span="6">
                <router-link to="/server">
                    <el-card class="box-card">
                        <div class="box-card-left">{{i18n('nav.server')}}</div>
                        <div class="box-card-right">{{i18n('home.count')}}：{{serverNum}}</div>
                    </el-card>
                </router-link>

            </el-col>
            <el-col :span="6">
                <router-link to="/routing">
                    <el-card class="box-card">
                        <div class="box-card-left">{{i18n('nav.routing')}}</div>
                        <div class="box-card-right">{{i18n('home.count')}}：{{routingNum}}</div>
                    </el-card>
                </router-link>

            </el-col>

        </el-row>
    </div>
</template>

<script>

    import * as systemApi from '~/api/system';
    import i18nMixin from '../mixin/i18n';

    const _name = 'home';
    export default {
        name: _name,
        data() {
            return {
                clusterNum: 0,
                routingNum: 0,
                apiNum: 0,
                serverNum: 0
            };
        },
        mixins: [i18nMixin],

        created() {
            this.init();
        },

        watch: {
            '$route': function (to, from) {
                if (to.name !== _name) {
                    this.$destroy();
                }
            },
        },

        methods: {
            init() {
                systemApi.getAllData().then((data) => {
                    data = data || {};
                    var count = data.count || {};
                    this.apiNum = count.api || 0;
                    this.clusterNum = count.cluster || 0;
                    this.routingNum = count.routing || 0;
                    this.serverNum = count.server || 0;
                });
            }
        }
    };
</script>

<style scoped>

    .box-card-left {
        display: inline-block;
        border-radius: 6px;
        margin: 14px 0 0 14px;
        padding: 16px;
    }

    .box-card-right {
        display: inline-block;
        padding: 16px;

    }

    .box-card {
        cursor: pointer;
    }
</style>
