import { permissionServer, baseServer } from "@/api/baseServer"
import { permissionByMenuIdUrl } from "@/api/baseUrl"

export default ({ https }) => ({
    /**
     * 根据菜单id分页获取权限
     * @param {long} id 
     * @param {JsonString} data 
     */
    PERMISSION_MENU_PAGE(id, data) {
        let url = baseUrl(permissionByMenuIdUrl + '/' + id);
        return https.httpPost({ url: url, data: data });
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