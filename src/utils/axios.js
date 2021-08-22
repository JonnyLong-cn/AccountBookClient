import axios from 'axios';
import { Toast } from 'zarm';
// 环境变量，判断是开发环境还是生产环境
// const MODE = import.meta.env.MODE;
// baseURL: 设置请求的基础路径
// axios.defaults.baseURL = MODE == 'development' ? '/api' : 'http://localhost:7001';

axios.defaults.baseURL = 'http://localhost:7001';
/* 用于请求头的设置 */
// 运行跨域验证
// axios.defaults.crossDomain=true
axios.defaults.withCredentials = true;
// 默认有token验证
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
// 从localStorage获取Authorization
axios.defaults.headers['Authorization'] = `${localStorage.getItem('token') || null}`;
// 配置post请求时，使用的请求体，这里默认设置成application/json的形式
axios.defaults.headers.post['Content-Type'] = 'application/json';

// 请求拦截器
axios.interceptors.request.use(config => {
  if (localStorage.getItem('token') !== '') {
    config.headers.Authorization = 'Bearer ' + localStorage.getItem('token');
  }
  return config;
}, error => {
  // 对请求错误做些什么
  return Promise.reject(error);
})

// 响应拦截器
axios.interceptors.response.use(res => {
  return Promise.resolve(res.data);
}, err => {
  switch (err.response.status) {
    case 401:
      Toast.show('未登录');
      window.location.hash = '/login';
      break;
    case 404:
      window.location.hash = '/login';
      break;
    case 413:
      Toast.show('图片太大');
      break;
    default:
      console.log('其他错误');
      break;
  }
})
export default axios;