import { request } from "@/api/service";
import { Export } from "@/api/export";

/**
 * post请求
 *@param url 请求路径
 *@param data 请求参数
 */
export function httpPost({ url, data = {} }) {
    return request({
        url,
        method: 'post',
        data
    })
}
/**
 * get请求
 *@param url 请求路径
 *@param params 请求参数
 */
export function httpGet({ url, params = {} }) {
    return request({
        url,
        method: 'get',
        params
    })
}
/**
 * 导出
 * @param url 请求路径
 * @param data 请求参数
 */
export function httpExport({ url, data = {} }) {
    return Export({
        method: 'post',
        url: url,
        params: data
    })
}