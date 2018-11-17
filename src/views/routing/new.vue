<template>
    <div class="app-container">
        <routing-form show-type="create"></routing-form>
    </div>
</template>

<script>
    import RoutingForm from './components/RoutingForm';

    const _name = 'routingNew';

    export default {
        name: _name,
        watch: {
            '$route': function (to, from) {
                if (to.name != _name) {
                    this.$destroy();
                }
            }
        },
        components: {RoutingForm}
    }
</script>

<style scoped>

</style>
