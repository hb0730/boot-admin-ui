import { jobLogServer } from "@/api/baseServer"
import { httpPost, httpGet } from "@/api/http"

/**
 * 调度日志
 * @param {*} url 
 * @param {*} data 
 */
export function JobLogAllPage(url,data){
    url =baseUrl(url)
    return httpPost(url,data)
}

/**
 * 删除
 * @param {*} url 
 * @param {*} data 
 */
export function JobLogDelete(url,data){
    url = baseUrl(url)
    return httpPost(url,data)
}

/**
 * 清空
 * @param {*} url 
 * @param {*} data 
 */
export function JobLogClean(url,data){
    url =baseUrl(url);
    return httpGet(url,data)
}

/**
 * 基础url
 * @param {*} url 
 */
function baseUrl(url) {
    if (url) {
        url = jobLogServer + url
    } else {
        url = jobServer
    }
    return url
}