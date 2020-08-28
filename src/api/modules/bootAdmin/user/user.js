import { baseServer, userServer } from "@/api/baseServer"
import { userLoginUrl, userLogoutUrl } from "@/api/baseUrl"

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
})

function baseUrl(url) {
    if (url) {
        url = baseServer + userServer + url
    } else {
        url = baseServer + userServer
    }
    return url
}