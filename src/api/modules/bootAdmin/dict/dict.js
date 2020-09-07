import { baseServer, dictServer } from "@/api/baseServer"
import { dictSaveUrl, dictUpdateByIdUrl, dictDeleteUrl, dictPageListUrl, dictUpdateCacheUrl,dictGetCacheUrl } from "@/api/baseUrl"

export default ({ https }) => ({
    /**
     * 保存
     * @param {jsonString} data 
     */
    DICT_SAVE(data) {
        let url = baseUrl(dictSaveUrl);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 根据id修改
     * @param {long} id 
     * @param {jsonString} data 
     */
    DICT_UPDATE_ID(id, data) {
        let url = baseUrl(dictUpdateByIdUrl + '/' + id);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 分页查询
     * @param {jsonString} data 
     */
    DICT_PAGE_LIST(data) {
        let url = baseUrl(dictPageListUrl);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 删除
     * @param {long} data 
     */
    DICT_DELETE(data) {
        let url = baseUrl(dictDeleteUrl);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 更新缓存
     */
    DICT_CACHE_UPDATE() {
        let url = baseUrl(dictUpdateCacheUrl);
        return https.httpGet({ url: url, params: null });
    },
    /**
     * 获取缓存
     */
    DICT_CACHE_GET(){
        let url  = baseUrl(dictGetCacheUrl)
        return https.httpGet({ url: url, params: null });
    }
})

function baseUrl(url) {
    if (url) {
        url = baseServer + dictServer + url
    } else {
        url = baseServer + dictServer
    }
    return url
}