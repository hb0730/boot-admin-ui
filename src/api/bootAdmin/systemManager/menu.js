import { menuServer } from '@/api/baseServer'
import { httpGet, httpPost } from '@/api/http'

/**
 * 获取树形菜单
 * @param {*} url 
 * @param {*} data 
 */
export function MenuTree(url, data) {
    url = baseUrl(url)
    return httpGet(url, data)
}

/**
 * 菜单新增
 * @param {*} url 
 * @param {*} data 
 */
export function MenuSave(url, data) {
    url = baseUrl(url);
    return httpPost(url, data)
}

/**
 * 菜单修改
 * @param {*} url 
 * @param {*} data 
 */
export function MenuUpdate(url, data) {
    url = baseUrl(url)
    return httpPost(url, data)
}

/**
 * 菜单删除
 * @param {*} url 
 * @param {*} data 
 */
export function MenuDelete(url, data) {
    url = baseUrl(url)
    return httpGet(url, data)
}

/**
 * 新增权限
 * @param {*} url 
 * @param {*} data 
 */
export function PermissionSave(url, data) {
    url = baseUrl(url)
    return httpPost(url, data)
}

/**
 * 获取全部权限
 * @param {*} url 
 * @param {*} data 
 */
export function PermissionList(url, data) {
    url = baseUrl(url)
    return httpGet(url, data)
}

/**
 * 修改权限
 * @param {*} url 
 * @param {*} data 
 */
export function PermissionUpdate(url, data) {
    url = baseUrl(url)
    return httpPost(url, data);
}

/**
 * 删除权限
 * @param {*} url 
 * @param {*} data 
 */
export function PermissionDelete(url,data){
    url = baseUrl(url)
    return httpGet(url,data)
}

function baseUrl(url) {
    if (url) {
        url = menuServer + url
    } else {
        url = menuServer
    }
    return url
}