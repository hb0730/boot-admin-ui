import { dictServer } from "@/api/baseServer"
import { httpPost, httpGet } from "@/api/http"
/**
 * 保存
 * @param {*} url 
 * @param {*} data 
 */
export function DictSave(url,data){
    url = baseUrl(url)
     return httpPost(url,data)
}
/**
 * 分页字典
 * @param {*} url 
 * @param {*} data 
 */
export function DictPageAll(url,data){
    url = baseUrl(url)
    return httpPost(url,data)
}

/**
 * 分页字典项
 * @param {*} url 
 * @param {*} data 
 */
export function DictDataPageAll(url,data){
    url =baseUrl(url)
    return httpPost(url,data)
}

/**
 * 修改
 * @param {*} url 
 * @param {*} data 
 */
export function DictUpdate(url,data){
    url = baseUrl(url)
    return httpPost(url,data)
}

/**
 * 删除
 * @param {*} url 
 * @param {*} data 
 */
export function DictDelete(url,data){
    url =baseUrl(url)
    return httpPost(url,data)
}

/**
 * 字典类型
 * @param {*} url 
 * @param {*} data 
 */
export function DictMap(url,data){
    url = baseUrl(url)
    return httpGet(url,data)
}
function baseUrl(url) {
    if (url) {
        url = dictServer + url
    } else {
        url = dictServer
    }
    return url
}