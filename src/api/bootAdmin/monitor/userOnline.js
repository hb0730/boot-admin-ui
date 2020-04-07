import { userOnlineServer } from "@/api/baseServer"
import { httpPost, httpGet } from "@/api/http"

/**
 * 获取在线用户
 * @param {*} url 
 * @param {*} data 
 */
export function UserOnlineAllPage(url, data) {
    url = baseUrl(url)
    return httpPost(url, data)
}

/**
 * 强退
 * @param {*} url 
 * @param {*} data 
 */
export function UserOnlineDelete(url, data) {
    url = baseUrl(url)
    return httpGet(url, data);
}

/**
 * 强退
 * @param {*} url 
 * @param {*} data 
 */
export function UserOnlineDeleteIds(url, data) {
    url = baseUrl(url)
    return httpPost(url, data)
}

function baseUrl(url) {
    if (url) {
        url = userOnlineServer + url
    } else {
        url = userOnlineServer
    }
    return url
}