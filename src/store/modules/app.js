/*
* author: wancheng
* date: 11/5/18
* desc:
*/

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
        }
    }
};

export default app;
