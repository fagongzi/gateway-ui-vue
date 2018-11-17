<template>
    <div class="app-container">
        <el-row :gutter="30">
            <el-col :span="8">
                <router-link to="/api">
                    <el-card class="box-card">
                        <div class="box-card-left">API</div>
                        <div class="box-card-right">个数：{{apiNum}}</div>
                    </el-card>
                </router-link>
            </el-col>
            <el-col :span="8">
                <router-link to="/cluster">
                    <el-card class="box-card">
                        <div class="box-card-left">Cluster</div>
                        <div class="box-card-right">个数：{{clusterNum}}</div>
                    </el-card>
                </router-link>
            </el-col>
            <el-col :span="8">
                <router-link to="/routing">
                    <el-card class="box-card">
                        <div class="box-card-left">Routing</div>
                        <div class="box-card-right">个数：{{routingNum}}</div>
                    </el-card>
                </router-link>

            </el-col>
        </el-row>
    </div>
</template>

<script>

    import * as apiApi from '~/api/api';
    import * as clusterApi from '~/api/cluster';
    import * as routingApi from '~/api/routing';


    export default {
        name: "home",
        data() {
            return {
                clusterNum: 0,
                routingNum: 0,
                apiNum: 0
            }
        },

        created() {
            this.init();
        },

        methods: {
            init() {
                apiApi.getList().then((data) => {
                    data = data || [];
                    this.apiNum = data.length
                });

                clusterApi.getList().then((data) => {
                    data = data || [];
                    this.clusterNum = data.length
                });

                routingApi.getList().then((data) => {
                    data = data || [];
                    this.routingNum = data.length
                })

            }
        }
    }
</script>

<style scoped>

    .box-card-left {
        display: inline-block;
        border-radius: 6px;
        margin: 14px 0 0 14px;
        padding: 16px;
    }

    .box-card-right{
        display: inline-block;
        padding: 16px;

    }

    .box-card {
        cursor: pointer;
    }
</style>
