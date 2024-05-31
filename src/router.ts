import Vue from 'vue'
import Router, { Route, RouteConfig } from 'vue-router'
import store from './store'
import Entry from '@/views/Entry.vue'

import Index from './views/Index/Index.vue'
import Itinerary from './views/Itinerary/Index.vue'
import Schedule from './views/Schedule/Index.vue'

import ItineraryEditor from './views/Itinerary/Editor.vue'
import ScheduleEditor from './views/Schedule/Editor.vue'
const DetailEditor = () =>
    import(/* webpackChunkName: 'detail-editor' */ './views/Detail/Editor.vue')

import Bill from './views/Bill/Index.vue'
import BillEditor from './views/Bill/Editor.vue'
const BillChart = () =>
    import(/* webpackChunkName: 'bill-chart' */ './views/Bill/Chart.vue')

import Map from './views/Map/Index.vue'

import UserInndex from './views/User/Index.vue'
import Login from './views/User/Login.vue'
import Register from './views/User/Register.vue'
import SetPassword from './views/User/SetPassword.vue'
import Options from './views/User/Options.vue'

import NotFound from './views/Other/NotFound.vue'

Vue.use(Router)

const needLogin: RouteConfig['beforeEnter'] = (to, from, next) => {
    store.state.loggedin ? next() : next('/login')
}
const router = new Router({
    mode: 'history',
    routes: [
        /* == 首页 =================================== */
        {
            path: '/',
            props: {
                routeModule: 'index'
            },
            component: Entry,
            children: [
                /* 首页目录 */
                {
                    path: '',
                    component: Index
                },
                /* 增加行程单 */
                {
                    path: 'add',
                    component: ItineraryEditor,
                    beforeEnter: needLogin,
                    props: {
                        edit: false
                    }
                }
            ]
        },
        {
            path: '/index',
            props: {
                routeModule: 'index'
            },
            component: Entry,
            children: [
                /* 首页目录 */
                {
                    path: '',
                    component: Index
                },
                /* 增加行程单 */
                {
                    path: 'add',
                    component: ItineraryEditor,
                    beforeEnter: needLogin,
                    props: {
                        edit: false
                    }
                },
                /* 首页目录 */
                {
                    path: ':page',
                    component: Index
                }
            ]
        },
        /* == 行程单 =================================== */
        {
            path: '/itinerary/:id',
            props: {
                routeModule: 'itinerary'
            },
            component: Entry,
            children: [
                /* 行程单首页 */
                {
                    path: '',
                    component: Itinerary
                },
                /* 编辑行程单 */
                {
                    path: 'edit',
                    component: ItineraryEditor,
                    beforeEnter: needLogin,
                    props: {
                        edit: true
                    }
                },
                /* 添加日程 */
                {
                    path: 'add',
                    component: ScheduleEditor,
                    beforeEnter: needLogin,
                    props: {
                        edit: false
                    }
                },
                /* 地图 */
                {
                    path: 'map',
                    component: Map,
                    props: {
                        routeModule: 'itinerary'
                    }
                }
            ]
        },
        /* == 日程 =================================== */
        {
            path: '/schedule/:id',
            props: {
                routeModule: 'schedule'
            },
            component: Entry,
            children: [
                /* 日程首页 */
                {
                    path: '',
                    component: Schedule
                },
                /* 编辑日程 */
                {
                    path: 'edit',
                    component: ScheduleEditor,
                    beforeEnter: needLogin,
                    props: {
                        edit: true
                    }
                },
                /* 添加详情 */
                {
                    path: 'add',
                    component: DetailEditor,
                    beforeEnter: needLogin,
                    props: {
                        edit: false
                    }
                },
                /* 地图 */
                {
                    path: 'map',
                    component: Map,
                    props: {
                        routeModule: 'schedule'
                    }
                }
            ]
        },
        /* == 详情 =================================== */
        {
            path: '/detail/:id',
            props: {
                routeModule: 'detail'
            },
            component: Entry,
            children: [
                /* 详情页（暂时不考虑做） */
                // {
                //     path: '',
                //     component: Index,
                // },
                /* 编辑详情 */
                {
                    path: 'edit',
                    component: DetailEditor,
                    beforeEnter: needLogin,
                    props: {
                        edit: true
                    }
                }
            ]
        },
        /* == 账单 =================================== */
        {
            path: '/bill/:pid',
            props: {
                routeModule: 'bill'
            },
            component: Entry,
            children: [
                /* 账单首页 */
                {
                    path: '',
                    component: Bill,
                    props: {
                        draft: false
                    }
                },
                /* 账单图表 */
                {
                    path: 'chart',
                    component: BillChart
                },
                /* 添加账单（实际是增加到草稿箱） */
                {
                    path: 'add',
                    component: BillEditor,
                    props: {
                        edit: false,
                        draft: true
                    }
                },
                /* 账单详情 */
                {
                    path: 'detail/:id',
                    component: BillEditor,
                    beforeEnter: needLogin,
                    props: {
                        edit: true,
                        draft: false
                    }
                },
                /* 编辑账单详情 */
                {
                    path: 'detail/:id/edit',
                    component: BillEditor,
                    beforeEnter: needLogin,
                    props: {
                        edit: true,
                        draft: false
                    }
                },
                /* 账单草稿 */
                {
                    path: 'draft',
                    component: Bill,
                    beforeEnter: needLogin,
                    props: {
                        draft: true
                    }
                },
                /* 账单草稿详情 */
                {
                    path: 'draft/:id',
                    component: BillEditor,
                    beforeEnter: needLogin,
                    props: {
                        edit: true,
                        draft: true
                    }
                },
                /* 编辑账单草稿详情 */
                {
                    path: 'draft/:id/edit',
                    component: BillEditor,
                    beforeEnter: needLogin,
                    props: {
                        edit: true,
                        draft: true
                    }
                }
            ]
        },
        /* == 用户 =================================== */
        {
            path: '/user',
            props: {
                routeModule: 'user'
            },
            component: Entry,
            children: [
                /* 用户中心 */
                {
                    path: '',
                    component: UserInndex,
                    beforeEnter: needLogin
                },
                /* 登录 */
                {
                    path: 'login',
                    alias: '/login',
                    component: Login
                },
                /* 注册 */
                {
                    path: 'register',
                    alias: '/register',
                    component: Register
                },
                /* 编辑资料 */
                {
                    path: 'edit',
                    component: Index,
                    beforeEnter: needLogin
                },
                /* 修改密码 */
                {
                    path: 'setpassword',
                    component: SetPassword,
                    beforeEnter: needLogin
                },
                /* 设置 */
                {
                    path: 'options',
                    component: Options,
                    beforeEnter: needLogin
                }
            ]
        },
        {
            path: '*',
            component: Entry,
            children: [
                {
                    path: '',
                    component: NotFound
                },
            ]
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        /* 切换页面时滚回顶部 */
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    }
})
export default router
