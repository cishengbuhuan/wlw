import Vue from 'vue';
import axios from 'axios';
import store from '../store/';

// 默认配置
axios.defaults.baseURL = 'http://www.xxxx.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const request = (config) => {
  return axios(config);
};

// http request 拦截器
axios.interceptors.request.use(
  (config) => {
    if(store.state.token) {
      config.headers.Authorization = `${store.state.token}`;  // token保存在store中
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// http response 拦截器
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if(error.response) {
      switch (error.response.status) {
        case 401:
          router.replace({
            path: '/login',
            query: {redirect: router.currentRoute.fullPath}
          });
      }
    }
    return Promise.reject(error.response.data);
  }
);



