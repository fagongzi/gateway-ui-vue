<template>
    <div class="">
        <el-form :rules="rules" ref="dataForm" :model="tempItem" label-width="150px" v-loading="loading">
            <el-form-item label="Cluster名称" prop="name">
                <el-input v-model="tempItem.name" style="width: 200px"></el-input>
            </el-form-item>

            <el-form-item label="负载均衡算法">
                <el-select v-model="tempItem.loadBalance" placeholder="负载均衡算法" style="width: 200px">
                    <el-option v-for="item in loadBalanceConstant" :key="item.value" :value="item.value"
                               :label="item.title">
                    </el-option>
                </el-select>
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
    import {FORM_OBJECT, LOAD_BALANCE_ARRAY, LOAD_BALANCE_OBJECT} from '~/constant/constant';
    import * as clusterApi from '~/api/cluster';
    import {clone, extend} from "~/utils";


    function _getTempItem() {
        return {
            id: undefined,
            name: undefined,
            loadBalance: LOAD_BALANCE_OBJECT.roundRobin
        }
    }


    export default {
        name: "clusterForm",
        props: {
            showType: {
                type: String,
                default: FORM_OBJECT.create
            },
            editItem: {
                type: Object,
            }
        },
        data() {
            return {
                loading: true,
                submitting:false,
                loadBalanceConstant: LOAD_BALANCE_ARRAY,
                rules: {
                    name: {required: true, message: '请填写集群名称', trigger: 'change'}
                },
                tempItem: _getTempItem()
            }
        },

        watch: {
            //
            'editItem': function (newValue, oldValue) {
                this.tempItem = extend(this.tempItem, clone(newValue));
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
                }
                else if (this._isCreate()) {
                    this.loading = false;
                }
            },

            goList() {
                this.$router.replace({path: '/cluster'});
                this.$destroy();
            },

            createItem(dataForm) {
                if(this.submitting){
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
                clusterApi.updateItem(item).then(() => {
                    this.$message({
                        type: 'success',
                        message: '创建成功!'
                    });
                    setTimeout(() => {
                        this.goList();
                    }, 2000);
                }).catch(()=>{
                    this.submitting = false;
                });
            },

            updateItem(dataForm) {
                if(this.submitting){
                    return;
                }

                this.$refs[dataForm].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this._doUpdateItem();
                })
            },

            _doUpdateItem() {
                var item = clone(this.tempItem);
                this.submitting = true;

                clusterApi.updateItem(item).then(() => {
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                    setTimeout(() => {
                        this.goList();
                    }, 2000);
                }).catch(()=>{
                    this.submitting = false;
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

    }
</script>

<style scoped>

</style>
