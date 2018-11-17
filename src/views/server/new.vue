<template>
    <div class="app-container">
        <server-form show-type="create" :editItem.sync="item"></server-form>
    </div>
</template>

<script>
    import ServerForm from './components/ServerForm';

    const _name = 'serverNew';
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
        created() {
            this.init();
        },
        components: {ServerForm},
        methods: {
            init() {
                this.clusterId = this.$route.query.clusterId;
                if (this.clusterId) {
                    this.item = {
                        bindClusterId: parseInt(this.clusterId, 10)
                    }
                }
            }
        }

    }
</script>

<style scoped>

</style>
