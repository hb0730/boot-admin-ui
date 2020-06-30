import { imgServer } from "@/api/baseServer"
import { httpPost, httpGet, upload } from "@/api/http"
/**
 * 分页
 * @param {*} url 
 * @param {*} data 
 */
export function imagePage(url, data) {
    url = baseUrl(url)
    return httpPost(url, data);
}
/**
 * 列表
 * @param {*} url 
 * @param {*} data 
 */
export function imageList(url, data) {
    url = baseUrl(url);
    return httpPost(url, data)
}
/**
 * 删除
 * @param {*} url 
 * @param {*} data 
 */
export function imageDelete(url, data) {
    url = baseUrl(url);
    return httpGet(url, data);
}
/**
 * 删除
 * @param {*} url 
 * @param {*} data 
 */
export function imageDeletes(url, data) {
    url = baseUrl(url)
    return httpPost(url, data);
}
/**
 * 上传
 * @param {*} url 
 * @param {*} data 
 */
export function imageUpload(url,formData, uploadProgress, cancelToken){
    url = baseUrl(url);
    return upload(url, formData, uploadProgress, cancelToken);
}

/**
 * 上传
 * @param {*} url 
 * @param {*} data 
 */
export function imageUploads(url,formData, uploadProgress, cancelToken){
    url = baseUrl(url);
    return upload(url, formData, uploadProgress, cancelToken);
}


function baseUrl(url) {
    if (url) {
        url = imgServer + url
    } else {
        url = dictServer
    }
    return url
}