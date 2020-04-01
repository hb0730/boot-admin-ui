import { loginInfoServer } from "@/api/baseServer"
import { httpPost } from "@/api/http"

/**
 * 分页的访问日志
 * @param {*} url 
 * @param {*} data 
 */
export function LoginInfoAllPage(url,data){
    url = baseUrl(url)
    return httpPost(url,data)
}

/**
 * 基础url
 * @param {*} url 
 */
function baseUrl(url){
    if (url) {
        url = loginInfoServer + url
    } else {
        url = loginInfoServer
    }
    return url
}