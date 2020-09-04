import { baseServer, postServer } from "@/api/baseServer"
import { postSaveUrl, postPageListUrl, postUpdateByIdUrl, postDeleteUrl } from "@/api/baseUrl"

export default ({ https }) => ({
    /**
     * 新增
     * @param {jsonString} data 
     */
    POST_SAVE(data) {
        let url = baseUrl(postSaveUrl);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 分页查询
     * @param {jsonString} data 
     */
    POST_PAGE_LIST(data) {
        let url = baseUrl(postPageListUrl);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 根据id修改
     * @param {long} id 
     * @param {jsonString} data 
     */
    POST_UPDATE_ID(id, data) {
        let url = baseUrl(postUpdateByIdUrl + '/' + id);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 删除
     * @param {array} ids 
     */
    POST_DELETE(ids) {
        let url = baseUrl(postDeleteUrl);
        return https.httpPost({ url: url, data: ids });
    }
})

function baseUrl(url) {
    if (url) {
        url = baseServer + postServer + url
    } else {
        url = baseServer + postServer
    }
    return url
}