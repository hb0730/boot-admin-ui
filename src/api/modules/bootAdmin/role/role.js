import { baseServer, roleServer } from "@/api/baseServer"
import { roleSaveUrl, rolePageUrl, roleUpdateByIdUrl, rolePermissionUpdateUrl, roleDeleteUrl, roleListUrl } from "@/api/baseUrl"

export default ({ https }) => ({
    /**
     * 角色新增
     * @param {jsonString} data 
     */
    ROLE_SAVE(data) {
        let url = baseUrl(roleSaveUrl);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 分页查询
     * @param {jsonString} data 
     */
    ROLE_LIST_PAGE(data) {
        let url = baseUrl(rolePageUrl);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 角色列表
     * @param {jsonString} data 
     */
    ROLE_LIST(data) {
        let url = baseUrl(roleListUrl);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 根据id修改
     * @param {long} id 
     * @param {jsonString} data 
     */
    ROLE_UPDATE_ID(id, data) {
        let url = baseUrl(roleUpdateByIdUrl + '/' + id);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 根据id修改权限
     * @param {long} id 
     * @param {array} data 
     */
    ROLE_PERMISSION_UPDATE_ID(id, data) {
        let url = baseUrl(rolePermissionUpdateUrl + '/' + id);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 删除
     * @param {array} data 
     */
    ROLE_DELETE(data) {
        let url = baseUrl(roleDeleteUrl);
        return https.httpPost({ url: url, data: data });
    }
})

function baseUrl(url) {
    if (url) {
        url = baseServer + roleServer + url
    } else {
        url = baseServer + roleServer
    }
    return url
}