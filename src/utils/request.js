import axios from 'axios';

const service = axios.create({
    // process.env.NODE_ENV === 'development', //来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    baseURL: 'http://localhost:8091/api',
    timeout: 5000
});

service.interceptors.request.use(
    config => {
        if (localStorage.getItem('Authorization')) {
            config.headers.Authorization = localStorage.getItem('Authorization');
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);


export default service;
