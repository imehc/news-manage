import {store} from "../redux/store";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:5000"
axios.defaults.timeout = 5000;
//请求头
// axios.defaults.headers
// 请求之前
// axios.interceptors.request.use
//响应之后
// axios.interceptors.response.use

axios.interceptors.request.use(function (config) {//请求之前
  // Do something before request is sent
  //显示loading
  store.dispatch({//由于不在组件内部，只能使用原始方法，含有异步操作，数据提交至 actions ，可用于向后台提交数据（同步使用commit）
    type:'change_loading',
    payload:true
  })
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {//请求之前
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  //隐藏loading
  store.dispatch({//由于不在组件内部，只能使用原始方法，含有异步操作，数据提交至 actions ，可用于向后台提交数据（同步使用commit）
    type:'change_loading',
    payload:false
  })
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  //隐藏loading
  store.dispatch({//由于不在组件内部，只能使用原始方法，含有异步操作，数据提交至 actions ，可用于向后台提交数据（同步使用commit）
    type:'change_loading',
    payload:false
  })
  return Promise.reject(error);
});