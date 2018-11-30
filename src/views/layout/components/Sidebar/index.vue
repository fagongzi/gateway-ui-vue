<template>
    <el-scrollbar wrapClass="scrollbar-wrapper">
        <div class="logo-con">
            <div class="api-big" v-show="!isCollapse">FaGongZi</div>
            <div class="api-small" v-show="isCollapse">FGZ</div>
        </div>
        <el-menu
                mode="vertical"
                :show-timeout="200"
                :default-active="needActive()"
                :collapse="isCollapse"
                background-color="#304156"
                text-color="#bfcbd9"
                active-text-color="#409EFF"
        >
            <sidebar-item :routes="constantRouterMap"></sidebar-item>
        </el-menu>
    </el-scrollbar>

</template>

<script>
    import {mapGetters} from 'vuex';
    import SidebarItem from './SidebarItem';
    import {constantRouterMap} from '~/router/routerMap';


    export default {
        name: 'Sidebar',
        data() {
            return {
                constantRouterMap
            }
        },
        components: {SidebarItem},
        computed: {
            ...mapGetters([
                'sidebar'
            ]),
            isCollapse() {
                return !this.sidebar.opened
            }
        },
        methods: {
            needActive() {
                if (this.$route.meta && this.$route.meta.parent) {
                    return this.$route.meta.parent && this.$route.meta.parent.path;
                }
                else {
                    return this.$route.path;
                }
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .logo-con {
        height: 64px;
        width: 100%;
        padding: 10px;
        background: #304156;
        color: #fff;

        .api-big {
            width: 100%;
            height: 44px;
            font-size: 25px;
            text-align: center;
            line-height: 44px;
        }

        .api-small {
            height: 44px;
            color: #fff;
            line-height: 44px;
            text-align: center;
            font-size: 24px;
        }
    }
</style>
