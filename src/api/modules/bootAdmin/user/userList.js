import { baseServer, userServer } from "@/api/baseServer"
import { userPageUrl, userSaveUrl, userUpdateUrl, userDeleteUrl } from "@/api/baseUrl"

export default ({ https }) => ({
    /**
     * 列表查询
     * @param {jsonString} data 
     */
    USER_PAGE_LIST(data) {
        let url = baseUrl(userPageUrl);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 用户保存
     * @param {jsonString} data 
     */
    USER_SAVE(data) {
        let url = baseUrl(userSaveUrl);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 根据id修改
     * @param {long} id 
     * @param {jsonString} data 
     */
    USER_UPDATE_ID(id, data) {
        let url = baseUrl(userUpdateUrl + '/' + id);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 删除
     * @param {jsonString} data 
     */
    USER_DELETE(data) {
        let url = baseUrl(userDeleteUrl);
        return https.httpPost({ url: url, data: data });
    }
})


function baseUrl(url) {
    if (url) {
        url = baseServer + userServer + url
    } else {
        url = baseServer + userServer
    }
    return url
}