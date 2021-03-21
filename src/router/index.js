import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const home = () => import(/* webpackChunkName: "demo" */ '../components/common/Home.vue')
const dashboard = () => import(/* webpackChunkName: "demo" */ '../components/page/Dashboard.vue')
const table = () => import(/* webpackChunkName: "demo" */ '../components/page/BaseTable.vue')
const tabs = () => import(/* webpackChunkName: "demo" */ '../components/page/Tabs.vue')
const sendmessage = () => import(/* webpackChunkName: "demo" */ '../components/page/SendMessage.vue')
const form = () => import(/* webpackChunkName: "demo" */ '../components/page/BaseForm.vue')
const permission = () => import(/* webpackChunkName: "demo" */ '../components/page/Permission.vue')
const four = () => import(/* webpackChunkName: "demo" */ '../components/page/404.vue')
const three = () => import(/* webpackChunkName: "demo" */ '../components/page/403.vue')
const sharepaper = () => import(/* webpackChunkName: "demo" */ '../components/page/SharePaper.vue')
const readpaper = () => import(/* webpackChunkName: "demo" */ '../components/page/ReadPaper.vue')
const personalcenter = () => import(/* webpackChunkName: "demo" */ '../components/page/PersonalCenter.vue')
const login = () => import(/* webpackChunkName: "demo" */ '../components/page/Login.vue')
export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/dashboard',
        },
        {
            path: '/',
            component: home,
            meta: { title: '自述文件'},
            children: [
                {
                    path: '/dashboard',
                    component: dashboard,
                    meta: { title: '主页' }
                },
                {
                    path: '/table',
                    component: table,
                    meta: { title: '项目列表' }
                },
                {
                    path: '/tabs',
                    component: tabs,
                    meta: { title: '消息中心' }
                },
                {
                    path: '/sendMessage',
                    component: sendmessage,
                    meta: {title: '发送消息'}
                },
                {
                    path: '/form',
                    component: form,
                    meta: { title: '基本表单' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: permission,
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: four,
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: three,
                    meta: { title: '403' }
                },
                {
                    path: '/sharePaper',
                    component: sharepaper,
                    meta: {title: '分享论文'}
                },
                {
                    path: '/readPaper',
                    component: readpaper,
                    meta: {title: '阅读论文'}
                },
                {
                    path: '/personalCenter',
                    component: personalcenter,
                    meta: {title: '个人中心' }
                }
            ]
        },
        {
            path: '/login',
            component: login,
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
