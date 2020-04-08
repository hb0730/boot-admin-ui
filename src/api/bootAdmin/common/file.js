import { httpPost } from "@/api/http";

/**
 * 图片上传
 * @param {*} url 
 * @param {*} data 
 */
export function ImageFileUpload(url, data) {
    return httpPost(url, data)
}