/*
* author: wancheng
* date: 11/5/18
* desc:
*/

import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';

import '~/styles/index.scss' // global css


import router from './router';
import store from './store';

import * as filters from './filters' // global filters

import './utils/progress';
import './icons';

Vue.use(ElementUI);

// 设置过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
});

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});
