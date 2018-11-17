/*
* author: wancheng
* date: 11/5/18
* desc:
*/


import router from '../router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style

NProgress.configure({showSpinner: false});// NProgress Configuration

let _first = true;

router.beforeEach((to, from, next) => {
    NProgress.start(); // start progress bar
    next();
});

router.afterEach(() => {
    NProgress.done() // end progress
});
