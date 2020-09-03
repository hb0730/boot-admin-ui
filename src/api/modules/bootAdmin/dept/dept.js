import { deptServer, baseServer } from "@/api/baseServer"
import { deptTreeAllUrl, deptUpdateById, deptSaveUrl, deptDeleteUrl } from "@/api/baseUrl"

export default ({ https }) => ({
    /**
     * 组织树
     */
    DEPT_TREE_ALL() {
        let url = baseUrl(deptTreeAllUrl);
        return https.httpGet({ url: url, params: null });
    },
    /**
     * 根据id修改
     * @param {long} id 
     * @param {jsonString} data 
     */
    DEPT_UPDATE_ID(id, data) {
        let url = baseUrl(deptUpdateById + '/' + id);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 新增
     * @param {jsonString} data 
     */
    DEPT_SAVE(data) {
        let url = baseUrl(deptSaveUrl);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 根据id删除
     * @param {long} id 
     */
    DEPT_DELETE_ID(id) {
        let url = baseUrl(deptDeleteUrl + '/' + id);
        return https.httpGet({ url: url, params: null });
    }
})
function baseUrl(url) {
    if (url) {
        url = baseServer + deptServer + url
    } else {
        url = baseServer + deptServer
    }
    return url
}