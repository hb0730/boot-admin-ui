import { baseServer, operLogServer } from "@/api/baseServer"
import { operLogListPageUrl, operLogDeleteUrl, operLogCleanUrl } from "@/api/baseUrl"

export default ({ https }) => ({
    /**
     * 分页查询
     * @param {jsonString} data 
     */
    OPER_LOG_LIST_PAGE(data) {
        let url = baseUrl(operLogListPageUrl);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 删除
     * @param {array} data 
     */
    OPER_LOG_DELETE(data) {
        let url = baseUrl(operLogDeleteUrl);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 清除
     */
    OPER_LOG_CLEAN() {
        let url = baseUrl(operLogCleanUrl);
        return https.httpGet({ url: url, params: null });
    }
})
function baseUrl(url) {
    if (url) {
        url = baseServer + operLogServer + url
    } else {
        url = baseServer + operLogServer
    }
    return url
}