<template>
    <div class="app-container">
        <cluster-form show-type="create"></cluster-form>
    </div>
</template>

<script>
    import ClusterForm from './components/ClusterForm';

    const _name = 'clusterNew';
    export default {
        name: _name,
        watch: {
            '$route': function (to, from) {
                if (to.name != _name) {
                    this.$destroy();
                }
            }
        },
        components: {ClusterForm}
    }
</script>

<style scoped>

</style>
