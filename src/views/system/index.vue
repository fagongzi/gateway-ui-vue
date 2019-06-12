<template>
    <div class="app-container">
        <el-card class="box-card" style="width: 500px">
            <div slot="header" class="clearfix">
                <el-alert :title="i18n('system.tips')" type="error" :closable="false"></el-alert>
            </div>
            <el-row :gutter="10">
                <el-col :span="6" style="line-height: 40px">{{i18n('system.backupAddress')}}</el-col>
                <el-col :span="12">
                    <el-input v-model="backupAddress" placeholder="ip:port"></el-input>
                </el-col>
                <el-col :span="6">
                    <el-button :loading="doingBackup" type="primary" @click="doBackup">{{i18n('btn.backup')}}</el-button>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
    import * as systemApi from '~/api/system';
    import i18nMixin from '../mixin/i18n';

    const _name = 'systemIndex';

    export default {
        name: _name,
        data() {
            return {
                backupAddress: '',
                doingBackup: false
            }
        },
        mixins: [i18nMixin],
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

                this.$confirm(this.i18n('system.confirmTips'), this.i18n('tips.tip'), {
                    confirmButtonText: this.i18n('btn.confirm'),
                    cancelButtonText: this.i18n('btn.cancel'),
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
