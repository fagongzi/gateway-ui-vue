<template>
    <div class="app-container">
        <api-form show-type="update" :editItem.sync="item"></api-form>
    </div>
</template>

<script>
    import * as apiApi from '~/api/api';
    import ApiForm from './components/ApiForm';

    const _name = 'apiEdit';
    export default {
        name: _name,
        watch: {
            '$route': function (to, from) {
                if (to.name != _name) {
                    this.$destroy();
                }
            }
        },
        data() {
            return {
                item: {}
            }
        },

        components: {ApiForm},

        created() {
            this.init();
        },
        methods: {
            init() {
                this.id = this.$route.query.id;
                let id = this.id;
                if (!id) {
                    return;
                }
                apiApi.getItemById(id).then((item) => {
                    item = item || {};
                    item.status = item.status == 1 ? true : false;
                    this.item = item;
                });
            }
        }
    }
</script>

<style scoped>

</style>
