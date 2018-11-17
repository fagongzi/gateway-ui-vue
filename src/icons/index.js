/*
* author: wancheng
* date: 6/27/18
* desc: 
*/

import Vue from 'vue'
import SvgIcon from '../components/SvgIcon'// svg组件
// 全局注册组件。
Vue.component('svg-icon', SvgIcon);

// 全部加载进来。
const requireAll = requireContext => requireContext.keys().map(requireContext);
const req = require.context('./svg', false, /\.svg$/);
requireAll(req);