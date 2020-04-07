import { operLogServer } from "@/api/baseServer"
import { httpPost, httpGet } from "@/api/http"

/**
 * 获取操作日志
 * @param {*} url 
 * @param {*} data 
 */
export function OperLogAllPage(url, data) {
    url = baseUrl(url)
    return httpPost(url, data)
}

/**
 * 删除
 * @param {*} url 
 * @param {*} data 
 */
export function OperLogDelete(url, data) {
    url = baseUrl(url)
    return httpPost(url, data)
}


/**
 * 清空
 * @param {*} url 
 * @param {*} data 
 */
export function OperLogClean(url, data) {
    url = baseUrl(url)
    return httpGet(url, data)
}

function baseUrl(url) {
    if (url) {
        url = operLogServer + url
    } else {
        url = operLogServer
    }
    return url
}