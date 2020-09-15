import { baseServer, mailServer } from "@/api/baseServer"
import { mailInfoUrl, mailSaveUrl, mailTestUrl } from "@/api/baseUrl"

export default ({ https }) => ({
    /**
     * 详情
     */
    MAIL_INFO() {
        let url = baseUrl(mailInfoUrl);
        return https.httpGet({ url: url, params: null });
    },
    /**
     * 保存
     * @param {jsonStirng} data 
     */
    MAIL_SAVE(data) {
        let url = baseUrl(mailSaveUrl);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 测试
     * @param {jsonString} data 
     */
    MAIL_TEST(data) {
        let url = baseUrl(mailTestUrl);
        return https.httpPost({ url: url, data: data });
    }
})
function baseUrl(url) {
    if (url) {
        url = baseServer + mailServer + url
    } else {
        url = baseServer + mailServer
    }
    return url
}