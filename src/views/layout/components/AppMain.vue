<template>
    <section class="app-main" style="min-height: 100%">
        <transition name="fade-transform" mode="out-in">
            <keep-alive>
                <router-view :key="key"></router-view>
            </keep-alive>
        </transition>
    </section>
</template>

<script>
    /**
     * app main 主要显示核心。
     */
    export default {
        name: 'AppMain',
        computed: {
            key() {
                return this.$route.fullPath
            }
        }
    }
</script>
