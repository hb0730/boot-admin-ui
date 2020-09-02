import { permissionServer, baseServer } from "@/api/baseServer"
import { permsisionSaveUrl, permissionUpdateByIdUrl, permissionDeleteUrl, permissionPageByMenuIdUrl } from "@/api/baseUrl"

export default ({ https }) => ({
    /**
     * 根据菜单id分页获取权限
     * @param {long} id 
     * @param {JsonString} data 
     */
    PERMISSION_MENU_PAGE(id, data) {
        let url = baseUrl(permissionPageByMenuIdUrl + '/' + id);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 权限新增
     * @param {jsonString} data 
     */
    PERMISSION_SAVE(data) {
        let url = baseUrl(permsisionSaveUrl);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 根据id修改
     * @param {*} id 
     * @param {*} data 
     */
    PERMISSION_UPDATE_ID(id, data) {
        let url = baseUrl(permissionUpdateByIdUrl + '/' + id);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 根据id删除
     * @param {long} id 
     */
    PERMISSION_DELETE_ID(id) {
        let url = baseUrl(permissionDeleteUrl + '/' + id);
        return https.httpGet({ url: url, params: null });
    }
})
function baseUrl(url) {
    if (url) {
        url = baseServer + permissionServer + url
    } else {
        url = baseServer + permissionServer
    }
    return url
}