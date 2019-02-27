<template>
    <div class="app-container">
        <plugin-form show-type="create"></plugin-form>
    </div>
</template>

<script>

    import PluginForm from './components/PluginForm';

    const _name = 'pluginNew';

    export default {
        name: _name,
        watch: {
            '$route': function (to, from) {
                if (to.name != _name) {
                    this.$destroy();
                }
            }
        },
        components: {PluginForm}
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
