/*
* author: wancheng
* date: 11/5/18
* desc:
*/


import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app';
import getters from './getters';

Vue.use(Vuex);


const store = new Vuex.Store({
    modules: {
        app
    },
    getters
});

export default store;
