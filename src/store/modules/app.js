/*
* author: wancheng
* date: 11/5/18
* desc:
*/

import Cookies from 'js-cookie'
import {LANGUAGE_TYPE} from "~/constant/constant";

let _data = {
    sidebarStatus: true
};

const app = {
    state: {
        sidebar: {
            opened: _data.sidebarStatus,
            withoutAnimation: false
        },
        device: 'desktop',
        language: Cookies.get('language') || LANGUAGE_TYPE.zh,
    },
    mutations: {
        TOGGLE_SIDEBAR: state => {
            if (state.sidebar.opened) {
                _data.sidebarStatus = true;
            } else {
                _data.sidebarStatus = false;
            }
            state.sidebar.opened = !state.sidebar.opened;
            state.sidebar.withoutAnimation = false
        },
        CLOSE_SIDEBAR: (state, withoutAnimation) => {
            _data.sidebarStatus = true;
            state.sidebar.opened = false
            state.sidebar.withoutAnimation = withoutAnimation
        },
        TOGGLE_DEVICE: (state, device) => {
            state.device = device
        },
        SET_LANGUAGE: (state, language) => {
            state.language = language
            Cookies.set('language', language)
        }
    },
    actions: {
        toggleSideBar({commit}) {
            commit('TOGGLE_SIDEBAR')
        },
        closeSideBar({commit}, {withoutAnimation}) {
            commit('CLOSE_SIDEBAR', withoutAnimation)
        },
        toggleDevice({commit}, device) {
            commit('TOGGLE_DEVICE', device)
        },
        setLanguage({commit}, language) {
            commit('SET_LANGUAGE', language)
        },
    }
};

export default app;
