import api from "@/api"

export default {
    namespaced: true,
    actions: {
        /**
         * 保存
         * @param {context} dispatch 
         * @param {*} data 
         */
        dictEntrySave({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                api.DICT_ENTRY_SAVE(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 修改
         * @param {context} dispatch 
         * @param {*} { id,data } 
         */
        dictEntryUpdate({ dispatch }, { id, data }) {
            return new Promise((resolve, reject) => {
                api.DICT_ENTRY_UPDATE_ID(id, data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 分页查询
         * @param {context} dispatch 
         * @param {*} data 
         */
        dictEntryPage({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                api.DICT_ENTRY_PAGE_LIST(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 删除
         * @param {context} dispatch 
         * @param {*} data 
         */
        dictEntryDelete({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                api.DICT_ENTRY_DELETE(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
    }
}