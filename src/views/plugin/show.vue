<template>
    <div class="app-container">
        <plugin-form show-type="show" :editItem.sync="item"></plugin-form>
    </div>
</template>

<script>
    import PluginForm from './components/PluginForm';
    import * as pluginApi from '~/api/plugin';

    const _name = 'pluginShow';

    export default {
        name: _name,
        data() {
            return {
                item: {}
            }
        },
        watch: {
            '$route': function (to, from) {
                if (to.name != _name) {
                    this.$destroy();
                }
            }
        },
        components: {PluginForm},
        created() {
            this.init();
        },

        methods:{
            init(){
                this.id = this.$route.query.id;
                let id = this.id;
                if (!id) {
                    return;
                }
                pluginApi.getItemById(id).then((item) => {
                    item = item || {};
                    this.item = item;
                });
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
