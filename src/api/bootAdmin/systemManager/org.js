import { httpPost, httpGet } from "@/api/http";
import { orgServer } from '@/api/baseServer'

/**
 * 组织保存
 * @param {*} url 
 * @param {*} data 
 */
export function OrgSave(url, data) {
    url = baseUrl(url);
    return httpPost(url, data)
}

/**
 * 组织树
 * @param {*} url 
 * @param {*} data 
 */
export function OrgTreeAll(url, data) {
    url = baseUrl(url)
    return httpGet(url, data)
}

/**
 * 修改组织信息
 * @param {*} url 
 * @param {*} data 
 */
export function OrgUpdate(url, data) {
    url = baseUrl(url)
    return httpPost(url, data)
}

/**
 * 组织删除
 * @param {*} url 
 * @param {*} data 
 */
export function OrgDelete(url, data) {
    url = baseUrl(url)
    return httpGet(url, data)
}

function baseUrl(url) {
    if (url) {
        url = orgServer + url
    } else {
        url = orgServer
    }
    return url
}