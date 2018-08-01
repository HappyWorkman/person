import axios from 'axios';
import { Message, MessageBox } from 'element-ui';
import store from '../store';
import { getToken } from '@/utils/auth';

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 150000, // 请求超时时间
  headers: {
    // 'Content-Type': 'application/x-www-form-urlencoded'
    'Content-Type': 'application/json'
  }
});
var sysState = 0;
// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Kol-Token'] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
      config.params = {
        ...config.params,
        'kol-token': getToken()
      };
    }
    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非0是抛错
     */
    const res = response.data;
    if (res.code !== '0') {
      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (sysState != 1) {
        if (res.code === 810000 || res.code === 400) {
          sysState = 1;
          MessageBox.confirm(
            '身份过期，可以取消继续留在该页面，或者重新登录',
            '确定登出',
            {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(() => {
              store.dispatch('FedLogOut').then(() => {
                location.reload(); // 为了重新实例化vue-router对象 避免bug
              });
            })
            .catch(() => {
              sysState = 0;
            });
        } else if (res.code === '-1') {
          Message({
            message: '登录失败',
            type: 'error',
            duration: 5 * 1000
          });
        } else if (res.code === '10014') {
          Message({
            message: '修改密码失败，验证码错误。',
            type: 'error',
            duration: 5 * 1000
          });
        } else {
          Message({
            message: res.msg,
            type: 'error',
            duration: 5 * 1000
          });
        }
      }
      return response.data;
      // return Promise.reject('error')
    } else {
      return response.data;
    }
  },
  error => {
    console.log('err' + error); // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
