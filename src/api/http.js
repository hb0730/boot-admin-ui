import request from '@/plugin/axios'
/**
 * get 请求
 * @param url 请求路径
 * @param params 请求参数
 */
export function httpGet(url, params = {}) {
  return request({
    url,
    method: 'get',
    params
  })
}

/**
 * post请求
 * @param url 请求路径
 * @param data 请求参数
 */
export function httpPost(url, data = {}) {
  return request({
    url,
    method: 'post',
    data
  })
}

/**
 * 导出(废弃)
 * 具体请看export.js
 * @param {*} url 
 * @param {*} data 
 */
export function httpExport(url, data) {
  return request({
    url,
    method: 'post',
    responseType: 'blob',
    data
  })
}

/**
 * 文件上传
 * @param {*} url 
 * @param {*} data 
 */
export function httpUpload(url, data) {
  return request({
    url,
    method: 'post',
    headers: {
      "Content-Type": 'multipart/form-data'
    },
    data: data
  })
}
export function upload(url, formData, uploadProgress, cancelToken) {
  return request({
    headers: {
      "Content-Type": 'multipart/form-data'
    },
    url: url,
    timeout: 8640000, // 24 hours
    data: formData, // form data
    onUploadProgress: uploadProgress,
    cancelToken: cancelToken,
    method: 'post'
  })
}

export function uploads(url,formdatas,uploadProgress, cancelToken){
  return request({
    headers: {
      "Content-Type": 'multipart/form-data',
    },
    url: url,
    timeout: 8640000, // 24 hours
    data: formdatas, // form data
    onUploadProgress: uploadProgress,
    cancelToken: cancelToken,
    method: 'post'
  })
}