/*
* author: wancheng
* date: 11/5/18
* desc:
*/

import Layout from '~/views/layout/Layout';


let constantRouterMap = [
    {path: '/404', component: () => import('../views/error/404'), hidden: true},
    // 首页
    {
        path: '',
        component: Layout,
        redirect: 'home',
        children: [{
            path: 'home',
            component: () => import('../views/home/index'),
            name: 'home',
            meta: {title: 'Home', icon: 'excel', noCache: true}
        }]
    },

    // api
    {
        path: '/api',
        component: Layout,
        redirect: '/api/index',
        children: [
            {
                path: 'index',
                component: () => import('../views/api/index'),
                name: 'apiIndex',
                meta: {title: 'API', icon: 'international', noCache: true}
            },
            {
                path: 'new',
                hidden: true,
                component: () => import('../views/api/new'),
                name: 'apiNew',
                meta: {
                    title: '新增',
                    noCache: true,
                    parent: {path: '/api/index', meta: {title: 'API'}}
                }
            },
            {
                path: 'edit',
                hidden: true,
                component: () => import('../views/api/edit'),
                name: 'apiEdit',
                meta: {
                    title: '修改',
                    noCache: true,
                    parent: {path: '/api/index', meta: {title: 'API'}}
                }
            },
            {
                path: 'show',
                hidden: true,
                component: () => import('../views/api/show'),
                name: 'apiShow',
                meta: {
                    title: '查看',
                    noCache: true,
                    parent: {path: '/api/index', meta: {title: 'API'}}
                }
            }
        ]
    },

    // cluster
    {
        path: '/cluster',
        component: Layout,
        redirect: '/cluster/index',
        children: [
            {
                path: 'index',
                component: () => import('../views/cluster/index'),
                name: 'clusterIndex',
                meta: {title: 'Cluster', icon: 'form', noCache: true}
            },
            {
                path: 'new',
                hidden: true,
                component: () => import('../views/cluster/new'),
                name: 'clusterNew',
                meta: {
                    title: '新增',
                    noCache: true,
                    parent: {path: '/cluster/index', meta: {title: 'Cluster'}}
                }
            },
            {
                path: 'edit',
                hidden: true,
                component: () => import('../views/cluster/edit'),
                name: 'clusterEdit',
                meta: {
                    title: '修改',
                    noCache: true,
                    parent: {path: '/cluster/index', meta: {title: 'Cluster'}}
                }
            }
        ]
    },
    // server
    {
        path: '/server',
        component: Layout,
        redirect: '/server/index',
        children: [
            {
                path: 'index',
                component: () => import('../views/server/index'),
                name: 'serverIndex',
                meta: {title: 'Server', icon: 'table', noCache: true}
            },
            {
                path: 'new',
                hidden: true,
                component: () => import('../views/server/new'),
                name: 'serverNew',
                meta: {
                    title: '新增',
                    noCache: true,
                    parent: {path: '/server/index', meta: {title: 'Server'}}
                }
            },
            {
              path: 'copy',
              hidden: true,
              component: () => import('../views/server/copy'),
              name: 'serverCopy',
              meta: {
                title: '新增',
                noCache: true,
                parent: {path: '/server/index', meta: {title: 'Server'}}
              }
            },
            {
                path: 'edit',
                hidden: true,
                component: () => import('../views/server/edit'),
                name: 'serverEdit',
                meta: {
                    title: '修改',
                    noCache: true,
                    parent: {path: '/server/index', meta: {title: 'Server'}}
                }
            },
            {
                path: 'show',
                hidden: true,
                component: () => import('../views/server/show'),
                name: 'serverShow',
                meta: {
                    title: '查看',
                    noCache: true,
                    parent: {path: '/server/index', meta: {title: 'Server'}}
                }
            }

        ]
    },
    //
    {
        path: '/routing',
        component: Layout,
        redirect: '/routing/index',
        children: [
            {
                path: 'index',
                component: () => import('../views/routing/index'),
                name: 'routingIndex',
                meta: {title: 'Routing', icon: 'component', noCache: true}
            },
            {
                path: 'new',
                hidden: true,
                component: () => import('../views/routing/new'),
                name: 'routingNew',
                meta: {
                    title: '新增',
                    noCache: true,
                    parent: {path: '/routing/index', meta: {title: 'Routing'}}
                }
            },
            {
                path: 'edit',
                hidden: true,
                component: () => import('../views/routing/edit'),
                name: 'routingEdit',
                meta: {
                    title: '修改',
                    noCache: true,
                    parent: {path: '/routing/index', meta: {title: 'Routing'}}
                }
            },
            {
                path: 'show',
                hidden: true,
                component: () => import('../views/routing/show'),
                name: 'routingShow',
                meta: {
                    title: '查看',
                    noCache: true,
                    parent: {path: '/routing/index', meta: {title: 'Routing'}}
                }
            }
        ]
    },
    //
    {
        path: '/system',
        component: Layout,
        redirect: '/system/index',
        children: [
            {
                path: 'index',
                component: () => import('../views/system/index'),
                name: 'systemIndex',
                meta: {title: 'System', icon: 'el-icon-setting', noCache: true}
            }
        ]
    },
    { path: '*', redirect: '/404', hidden: true }
];


export {
    constantRouterMap
}
