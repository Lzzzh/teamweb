import axios from 'axios';

const service = axios.create({
    baseURL: 'http://localhost:8093/file',
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
