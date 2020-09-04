import { baseServer, dictEntryServer } from "@/api/baseServer";
import { dictEntrySaveUrl, dictEntryUpdateByIdUrl, dictEntryPageListUrl, dictEntryDeleteUrl } from "@/api/baseUrl";

export default ({ https }) => ({

    /**
    * 保存
    * @param {jsonString} data 
    */
    DICT_ENTRY_SAVE(data) {
        let url = baseUrl(dictEntrySaveUrl);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 根据id修改
     * @param {long} id 
     * @param {jsonString} data 
     */
    DICT_ENTRY_UPDATE_ID(id, data) {
        let url = baseUrl(dictEntryUpdateByIdUrl + '/' + id);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 分页查询
     * @param {jsonString} data 
     */
    DICT_ENTRY_PAGE_LIST(data) {
        let url = baseUrl(dictEntryPageListUrl);
        return https.httpPost({ url: url, data: data });
    },
    /**
     * 删除
     * @param {long} data 
     */
    DICT_ENTRY_DELETE(data) {
        let url = baseUrl(dictEntryDeleteUrl);
        return https.httpPost({ url: url, data: data });
    }
})

function baseUrl(url) {
    if (url) {
        url = baseServer + dictEntryServer + url
    } else {
        url = baseServer + dictEntryServer
    }
    return url
}