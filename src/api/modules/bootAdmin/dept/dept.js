import { deptServer, baseServer } from "@/api/baseServer"
import { deptTreeAllUrl } from "@/api/baseUrl"

export default ({ https }) => ({
    /**
     * 组织树
     */
    DEPT_TREE_ALL() {
        let url = baseUrl(deptTreeAllUrl);
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