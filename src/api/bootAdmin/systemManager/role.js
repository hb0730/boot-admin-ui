import { roleServer } from "@/api/baseServer"
import { httpGet, httpPost } from "@/api/http"

/**
 * 获取全部角色
 * @param {*} url 
 * @param {*} data 
 */
export function RoleAll(url, data) {
    url = baseUrl(url)
    return httpPost(url, data)
}

/**
 * 分页后的全部角色
 * @param {*} url 
 * @param {*} data 
 */
export function RolePageAll(url, data) {
    url = baseUrl(url)
    return httpPost(url, data)
}

/**
 * 保存角色
 * @param {*} url 
 * @param {*} data 
 */
export function RoleSave(url, data) {
    url = baseUrl(url)
    return httpPost(url, data)
}

/**
 * 修改角色
 * @param {*} url 
 * @param {*} data 
 */
export function RoleUpdate(url, data) {
    url = baseUrl(url)
    return httpPost(url, data)
}

/**
 * 删除角色
 * @param {*} url 
 * @param {*} data 
 */
export function RoleDelete(url, data) {
    url = baseUrl(url)
    return httpGet(url, data)
}


function baseUrl(url) {
    if (url) {
        url = roleServer + url
    } else {
        url = userServer
    }
    return url
}