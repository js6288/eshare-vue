import axios from "axios";
import {getAccessToken, getRefreshToken, setToken, userLogout} from "../auth/auth";
import {refreshToken} from "../api/login";
import {message} from "ant-design-vue";
import router from "../config/router";

const isDev = process.env.NODE_ENV === "development"

const myAxios = axios.create({
    baseURL: isDev?'http://localhost:9001/api':'http://120.48.29.51/api'
})



// 添加请求拦截器
myAxios.interceptors.request.use(function (config) {
    console.log("我要发送请求了,",config)
    //首先判断 config.headers.isToken 是否为 false，如果是，则表示当前请求不需要携带 token，直接返回 config 对象，不做任何处理。
    const isAccessToken = (config.headers || {}).isAccessToken === false;
    const isRefreshToken = (config.headers || {}).isRefreshToken === false;
    if (getAccessToken()&&!isAccessToken){
        config.headers['access_token'] = getAccessToken();
    }
    if (getRefreshToken() && !isRefreshToken){
        config.headers['refresh_token'] = getRefreshToken();
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

myAxios.interceptors.response.use(function (response){
    console.log("我收到你的响应了,",response)


    return response.data;
}, async function (error) {

    const {config, response: {status}} = error
    console.log(config, status)
    //access_token 过期 无感知刷新token
    if (status === 401) {
        const res = await refreshToken();
        // @ts-ignore
        if (res.code === 200 && res.data) {
            console.log("reset token");
            setToken(res.data);
            return myAxios.request(config);
            // @ts-ignore
        } else if (res.code === 401502) {
            //refresh_token也过期了需要重新登录
            // @ts-ignore
            message.warn(res.message).then(()=>{
                setTimeout("location.href = '/login'",50);
                //清楚缓存用户信息
                userLogout()
                }
            );
        }
    }
    //901错误接口访问过于频繁\
    if (status === 901){
        message.warn("操作过于频繁，请稍后重试")
    }

    // 对响应错误做点什么
    return Promise.reject(error);
})


export default myAxios;
