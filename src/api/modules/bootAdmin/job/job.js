import { baseServer, jobServer } from "@/api/baseServer"
import { jobSaveUrl, jobUpdateByIdUrl, jobDeleteUrl, jobListPageUrl, jobListUrl, jobExecUrl } from "@/api/baseUrl"

export default ({ https }) => ({
    /**
     * 分页查询
     * @param {jsonString} data 
     */
    JOB_LIST_PAGE(data) {
        let url = baseUrl(jobListPageUrl);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 列表查询
     * @param {jsonString} data 
     */
    JOB_LIST(data) {
        let url = baseUrl(jobListUrl);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 新增
     * @param {jsonString} data 
     */
    JOB_SAVE(data) {
        let url = baseUrl(jobSaveUrl);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 修改
     * @param {id} id 
     * @param {jsonString} data 
     */
    JOB_UPDATE_ID(id, data) {
        let url = baseUrl(jobUpdateByIdUrl + '/' + id);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 删除
     * @param {array} data 
     */
    JOB_DELETE(data) {
        let url = baseUrl(jobDeleteUrl);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * id
     * @param {long} id 
     */
    JOB_EXEC(id) {
        let url = baseUrl(jobExecUrl + '/' + id);
        return https.httpGet({ url: url, params: null })
    }
})

function baseUrl(url) {
    if (url) {
        url = baseServer + jobServer + url
    } else {
        url = baseServer + jobServer
    }
    return url
}