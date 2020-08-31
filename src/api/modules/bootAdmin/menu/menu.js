import { baseServer, menuServer } from "@/api/baseServer"
import { menuCurrentTreeUrl, menuCurrentRouterUrl } from "@/api/baseUrl"
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
     * 当前用户路由
     */
    MENU_CURRENT_ROUTER() {
        let url = menuCurrentRouterUrl;
        url = baseUrl(menuCurrentRouterUrl);
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