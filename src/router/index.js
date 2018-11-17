/*
* author: wancheng
* date: 11/5/18
* desc:
*/


import Vue from 'vue';
import Router from 'vue-router';
import {constantRouterMap} from "~/router/routerMap";

Vue.use(Router);

export default new Router({
    scrollBehavior: () => ({y: 0}),
    // mode: 'history', // 支持history 模式
    routes: constantRouterMap
})
