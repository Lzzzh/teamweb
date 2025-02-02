import Vue from 'vue';
import App from './App.vue';
import store from './store'
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import el from 'element-ui/src/locale/lang/el';

//引入axios
const axios = require('axios');
axios.defaults.baseURL = 'http://localhost:8091/api'
Vue.prototype.$axios = axios

Vue.config.productionTip = false;
Vue.use(ElementUI, {
    size: 'small'
});

//使用钩子函数对路由进行权限跳转
/*router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    let token = localStorage.getItem('Authorization');
    if (to.path === '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        token === 'admin' ? next() : next('/403');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
});*/





//新钩子
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | 信息学院团队管理系统`;
    if (to.path === '/login') {
        next();
    } else {
        let token = localStorage.getItem('Authorization');
        if (!token || token === 'null' || token === '') {
            next('/login');
        } else {
            axios.get('/testToken').then((res) => {
                const code = res.data.code;
                console.log(code)
                if (code === 200) {
                    next();
                }else {
                    next('/login');
                }
            })
        }



    }
});

// 添加请求拦截器，在请求头中加token
axios.interceptors.request.use(
    config => {
        if (localStorage.getItem('Authorization')) {
            config.headers.Authorization = localStorage.getItem('Authorization');
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    });


new Vue({
    router, store:store,
    components: { App },
    template: '<App/>',
    render: h => h(App)
}).$mount('#app');
