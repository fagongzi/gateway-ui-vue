<template>
    <div class="app-container">
        <el-card class="box-card" style="width: 500px">
            <div slot="header" class="clearfix">
                <el-alert title="备份环境：目标的环境数据会被清理" type="error" :closable="false"></el-alert>
            </div>
            <el-row :gutter="10">
                <el-col :span="6" style="line-height: 40px">目标的环境：</el-col>
                <el-col :span="12">
                    <el-input v-model="backupAddress" placeholder="ip:port"></el-input>
                </el-col>
                <el-col :span="6">
                    <el-button :loading="doingBackup" type="primary" @click="doBackup">备份</el-button>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
    import * as systemApi from '~/api/system';

    const _name = 'systemIndex';

    export default {
        name: _name,
        data() {
            return {
                backupAddress: '',
                doingBackup: false
            }
        },
        watch: {
            '$route': function (to, from) {
                if (to.name != _name) {
                    this.$destroy();
                }
            }
        },
        methods: {
            doBackup() {
                if (!this.backupAddress || this.doingBackup) {
                    return false;
                }

                this.$confirm('目标的环境数据会被清理，是否确定备份？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this._doBackup();
                });
            },
            _doBackup() {
                //
                var data = {
                    toAddr: this.backupAddress
                };
                this.doingBackup = true;
                systemApi.backup(data).then((data) => {
                    this.$message({
                        type: 'success',
                        message: '备份成功!'
                    });
                    this.backupAddress = '';
                    this.doingBackup = false;
                }).catch(() => {
                    this.doingBackup = false;
                });
            }
        }
    }
</script>

<style scoped>

</style>
