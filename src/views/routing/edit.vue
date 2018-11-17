<template>
    <div class="app-container">
        <routing-form show-type="update" :editItem.sync="item"></routing-form>
    </div>
</template>

<script>
    import RoutingForm from './components/RoutingForm';
    import * as routingApi from '~/api/routing';

    const _name = 'routingEdit';
    export default {
        name: _name,
        data() {
            return {
                item: {}
            }
        },
        components: {RoutingForm},
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
        methods:{
            init(){
                this.id = this.$route.query.id;
                let id = this.id;
                if (!id) {
                    return;
                }
                routingApi.getItemById(id).then((item) => {
                    item = item || {};
                    this.item = item;
                });
            }
        }

    }
</script>

<style scoped>

</style>
