<template>
    <el-scrollbar wrapClass="scrollbar-wrapper">
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
                return this.$route.path;
            }
        }
    }
</script>
