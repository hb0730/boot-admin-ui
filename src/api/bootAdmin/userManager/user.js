import { userServer } from '@/api/baseServer'
import { httpGet, httpPost } from '@/api/http'
/**
 * 用户详情
 * /info/{id}
 * @param {url} url 
 * @param {params} data 
 */
export function UserInfo(url, data) {
    url = baseUrl(url)
    return httpGet(url, data)
}
/**
 * 修改详情（不包含密码）
 * /update/info/{id}
 * @param {*} url 
 * @param {*} data 
 */
export function UserUpdateInfo(url, data) {
    url = baseUrl(url);
    return httpPost(url, data)
}
/**
 * 修改用户密码
 * /update/password/{id}
 * @param {*} url 
 * @param {*} data 
 */
export function UserUpdatePassword(url, data) {
    url = baseUrl(url);
    url+='?oldPassword='+data.oldPassword+'&newPassword='+data.newPassword+'&newPassword2='+data.newPassword2
    data=null
    return httpPost(url, data)
}

/**
 * 分页后的用户
 * @param {*} url 
 * @param {*} data 
 */
export function UserAllPage(url,data){
    url = baseUrl(url);
    return httpPost(url,data);
}

function baseUrl(url) {
    if (url) {
        url = userServer + url
    } else {
        url = userServer
    }
    return url
}