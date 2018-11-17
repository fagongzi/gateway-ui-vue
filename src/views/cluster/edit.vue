<template>
    <div class="app-container">
        <cluster-form show-type="update" :editItem.sync="item"></cluster-form>
    </div>
</template>

<script>
    import ClusterForm from './components/ClusterForm';
    import * as clusterApi from '~/api/cluster';

    const _name = 'clusterEdit';
    export default {
        name: _name,
        data() {
            return {
                id: '',
                item: {}
            }
        },
        components: {ClusterForm},
        created() {
            this.init();
        },
        watch: {
            '$route': function (to, from) {
                if (to.name != _name) {
                    this.$destroy();
                }
            }
        },

        methods: {
            init() {
                this.id = this.$route.query.id;
                let id = this.id;
                if (!id) {
                    return;
                }
                clusterApi.getItemById(id).then((item) => {
                    this.item = item;
                });
            }
        }
    }
</script>

<style scoped>

</style>
