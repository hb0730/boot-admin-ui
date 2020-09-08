import { baseServer, jobLogServer } from "@/api/baseServer"
import { jobLogListPageUrl } from "@/api/baseUrl"

export default ({ https }) => ({
    /**
     * 分页查询
     * @param {jsonString} data 
     */
    JOB_LOG_LIST_PAGE(data) {
        let url = baseUrl(jobLogListPageUrl);
        return https.httpPost({ url: url, data: data });
    }
})

function baseUrl(url) {
    if (url) {
        url = baseServer + jobLogServer + url
    } else {
        url = baseServer + jobLogServer
    }
    return url
}