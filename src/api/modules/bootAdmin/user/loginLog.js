import { baseServer, loginLogServer } from "@/api/baseServer"
import { loginLogListPageUrl, loginLogDeleteUrl, loginLogCleanUrl } from "@/api/baseUrl"

export default ({ https }) => ({
    /**
     * 分页查询
     * @param {jsonString} data 
     */
    LOGIN_LOG_LIST_PAGE(data) {
        let url = baseUrl(loginLogListPageUrl);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 删除
     * @param {array} data 
     */
    LOGIN_LOG_DELETE(data) {
        let url = baseUrl(loginLogDeleteUrl);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 清除
     */
    LOGIN_LOG_CLEAN() {
        let url = baseUrl(loginLogCleanUrl);
        return https.httpGet({ url: url, params: null })
    }
})
function baseUrl(url) {
    if (url) {
        url = baseServer + loginLogServer + url
    } else {
        url = baseServer + loginLogServer
    }
    return url
}