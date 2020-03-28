import { postServer } from "@/api/baseServer"
import { httpPost, httpGet } from "@/api/http"

/**
 * 分页后的岗位
 * @param {*} url 
 * @param {*} data 
 */
export function PostAllPage(url,data){
    url = baseUrl(url)
    return httpPost(url,data)
}

/**
 * 全部岗位
 * @param {*} url 
 * @param {*} data 
 */
export function PostAll(url,data){
    url = baseUrl(url)
    return httpPost(url,data)
}
/**
 * 岗位保存
 * @param {*} url 
 * @param {*} data 
 */
export function PostSave(url,data){
    url =baseUrl(url);
    return  httpPost(url,data)
}

/**
 * 岗位修改
 * @param {*} url 
 * @param {*} data 
 */
export function PostUpdate(url,data){
    url= baseUrl(url);
    return httpPost(url,data)
}

/**
 * 岗位删除
 * @param {*} url 
 * @param {*} data 
 */
export function PostDelete(url,data){
    url =baseUrl(url)
    return httpGet(url,data)
}


function baseUrl(url) {
    if (url) {
        url = postServer + url
    } else {
        url = userServer
    }
    return url
}