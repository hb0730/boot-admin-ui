import { operLogServer } from "@/api/baseServer"
import { httpPost } from "@/api/http"

/**
 * 获取操作日志
 * @param {*} url 
 * @param {*} data 
 */
export function OperLogAllPage(url,data){
    url = baseUrl(url)
    return httpPost(url,data)
}


function baseUrl(url){
    if (url) {
        url = operLogServer + url
    } else {
        url = operLogServer
    }
    return url
}