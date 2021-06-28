import axios from "axios";
axios.defaults.baseURL = "http://localhost:5000"
axios.defaults.timeout = 5000;
//请求头
// axios.defaults.headers
// 请求之前
// axios.interceptors.request.use
//响应之后
// axios.interceptors.response.use