import { userOnlineServer } from "@/api/baseServer"
import { httpPost } from "@/api/http"

/**
 * 获取在线用户
 * @param {*} url 
 * @param {*} data 
 */
export function UserOnlineAllPage(url,data){
    url =baseUrl(url)
    return httpPost(url,data)
}

function baseUrl(url){
    if (url) {
        url = userOnlineServer + url
    } else {
        url = userOnlineServer
    }
    return url
}