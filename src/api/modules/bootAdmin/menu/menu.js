import { baseServer, menuServer } from "@/api/baseServer"
import { menuCurrentTreeUrl, menuCurrentRouterUrl, menuQueryTreeUrl, menuUpdateByIdUrl, menuSaveUrl, menuDeleteByIdUrl, menuPermissionQueryTreeUrl, menuCurrentUpdateUrl } from "@/api/baseUrl"
export default ({ https }) => ({
    /***
     * 获取当前用户菜单树
     */
    MENU_CURRENT() {
        let url = menuCurrentTreeUrl;
        url = baseUrl(menuCurrentTreeUrl);
        return https.httpGet({ url: url, params: null });
    },
    /**
     * 更新当前用户
     */
    MENU_CURRENT_UPDATE() {
        let url = baseUrl(menuCurrentUpdateUrl)
        return https.httpGet({ url: url, params: null });
    },
    /**
     * 当前用户路由
     */
    MENU_CURRENT_ROUTER() {
        let url = menuCurrentRouterUrl;
        url = baseUrl(menuCurrentRouterUrl);
        return https.httpGet({ url: url, params: null });
    },
    /**
     * 菜单树
     */
    MENU_QUERY_TREE() {
        let url = menuQueryTreeUrl;
        url = baseUrl(url);
        return https.httpGet({ url: url, params: null });
    },
    /**
     * 根据id修改
     * @param {long} id 
     * @param {JsonString} data 
     */
    MENU_UPDATE_ID(id, data) {
        let url = menuUpdateByIdUrl + id;
        url = baseUrl(url);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 新增菜单
     * @param {JsonString} data 
     */
    MENU_SAVE(data) {
        let url = menuSaveUrl;
        url = baseUrl(url);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 根据id删除
     * @param {String} id 
     */
    MENU_DELETE_ID(id) {
        let url = menuDeleteByIdUrl + '/' + id;
        url = baseUrl(url);
        return https.httpGet({ url: url, params: null });
    },
    /**
     * 菜单权限树
     */
    MENU_PERMISSION_TREE() {
        let url = baseUrl(menuPermissionQueryTreeUrl);
        return https.httpGet({ url: url, params: null });
    }
})
function baseUrl(url) {
    if (url) {
        url = baseServer + menuServer + url
    } else {
        url = baseServer + menuServer
    }
    return url
}