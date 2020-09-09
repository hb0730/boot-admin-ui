import { baseServer, operLogServer } from "@/api/baseServer"
import { operLogListPageUrl } from "@/api/baseUrl"

export default ({ https }) => ({
    /**
     * 分页查询
     * @param {jsonString} data 
     */
    OPER_LOG_LIST_PAGE(data) {
        let url = baseUrl(operLogListPageUrl);
        return https.httpPost({ url: url, data: data });
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