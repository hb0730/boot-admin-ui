import { JobServer } from "@/api/baseServer"
import { httpPost, httpGet } from "@/api/http"

/**
 * 分页定时任务
 * @param {*} url 
 * @param {*} data 
 */
export function JobAllPage(url, data) {
    url = baseUrl(url)
    return httpPost(url, data)
}

/**
 * 保存定时任务
 * @param {*} url 
 * @param {*} data 
 */
export function JobSave(url, data) {
    url = baseUrl(url)
    return httpPost(url, data)
}

/**
 * 更新定时任务
 * @param {*} url 
 * @param {*} data 
 */
export function JobUpdate(url, data) {
    url = baseUrl(url)
    return httpPost(url, data)
}

/**
 * 删除定时任务
 * @param {*} url 
 * @param {*} data 
 */
export function JobDelete(url, data) {
    url = baseUrl(url)
    return httpGet(url, data);
}

/**
 * 删除定时任务
 * @param {*} url 
 * @param {*} data 
 */
export function JobDeleteIds(url, data) {
    url = baseUrl(url)
    return httpPost(url, data)
}

/**
 * 基础url
 * @param {*} url 
 */
function baseUrl(url) {
    if (url) {
        url = JobServer + url
    } else {
        url = JobServer
    }
    return url
}