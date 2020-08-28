import { baseServer, userServer } from "@/api/baseServer"
import { userLoginUrl, userLogoutUrl, currentUserInfoUrl, userUpdateByIdUrl, updatePasswordUrl } from "@/api/baseUrl"

export default ({ https }) => ({
    /**
     * 用户登录
     * @param {*} data 请求参数 
     */
    USER_LOGIN(data) {
        var url = userLoginUrl;
        return https.httpPost({ url: url, data: data })
    },
    /**
     * 登出
     */
    USER_LOGOUT() {
        var url = userLogoutUrl
        return https.httpPost({ url: url, data: null });
    },
    /**
     * 获取当前已认证的用户信息
     */
    USER_CURRENT() {
        var url = currentUserInfoUrl;
        url = baseUrl(url);
        return https.httpGet({ url: url, params: null });
    },
    /**
     * 根据id获取用户
     * @param {*} id 
     */
    USER_INFO_ID(id) {
        var url = "/" + id;
        url = baseUrl(url);
        return https.httpGet({ url: url, params: null });
    },
    /**
     * 根据id修改
     * @param {*} url 
     * @param {*} params 
     */
    USER_UPDATE_INFO(url, params) {
        var url = userUpdateByIdUrl + '/' + url;
        url = baseUrl(url);
        return https.httpPost({ url: url, data: params });
    },
    /**
     * 修改密码
     * @param {*} url 
     * @param {*} data 
     */
    USER_PASSWORD_UPDATE(url, data) {
        var url = updatePasswordUrl + '/' + url;
        url = baseUrl(url);
        return https.httpPost({ url: url, data: data });
    }
})

function baseUrl(url) {
    if (url) {
        url = baseServer + userServer + url
    } else {
        url = baseServer + userServer
    }
    return url
}