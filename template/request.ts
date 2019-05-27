import Axios, { AxiosRequestConfig } from "axios";
import qs from 'qs';



let instance = Axios.create({
    headers: { "Content-Type": "application/json;charset=UTF-8" }
});


/**
 * 请求发起时拦截
 */
instance.interceptors.request.use((config: AxiosRequestConfig) => {
    if (config.headers["Content-Type"] === "application/json;charset=UTF-8") {
        config.data = qs.stringify(config.data || {}, { encode: false });
    }
    return config;
});

/**
 * 返回值拦截
 */
instance.interceptors.response.use((config: any) => {
    return config;
});

export default instance;