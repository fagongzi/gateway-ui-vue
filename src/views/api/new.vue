<template>
    <div class="app-container">
        <api-form show-type="create"></api-form>
    </div>
</template>

<script>

    import ApiForm from './components/ApiForm';

    const _name = 'apiNew';
    export default {
        name: _name,
        watch: {
            '$route': function (to, from) {
                if (to.name != _name) {
                    this.$destroy();
                }
            }
        },
        components: {ApiForm}
    }
</script>

<style scoped>

</style>
