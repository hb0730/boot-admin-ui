import { baseServer, userOnlineServer } from "@/api/baseServer"
import { userOnlineListPageUrl, userOnlineLogoutUrl } from "@/api/baseUrl"

export default ({ https }) => ({
    /**
     * 分页查询
     * @param {jsonString} data 
     */
    USER_ONLINE_LIST_PAGE(data) {
        let url = baseUrl(userOnlineListPageUrl);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 登出
     * @param {string} key 
     */
    USER_ONLINE_LOGOUT_KEY(key) {
        let url = baseUrl(userOnlineLogoutUrl + '/' + key);
        return https.httpGet({ url: url, params: null });
    },
    /**
     * 批量登出
     * @param {array} data 
     */
    USER_ONLINE_LOGOUT(data) {
        let url = baseUrl(userOnlineLogoutUrl);
        return https.httpPost({ url: url, data: data });
    }
})
function baseUrl(url) {
    if (url) {
        url = baseServer + userOnlineServer + url
    } else {
        url = baseServer + userOnlineServer
    }
    return url
}