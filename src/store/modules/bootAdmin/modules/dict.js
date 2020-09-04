import api from "@/api"

export default {
    namespaced: true,
    actions: {
        /**
         * 保存
         * @param {context} dispatch 
         * @param {*} data 
         */
        dictSave({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                api.DICT_SAVE(data).then(result => {
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
        dictUpdate({ dispatch }, { id, data }) {
            return new Promise((resolve, reject) => {
                api.DICT_UPDATE_ID(id, data).then(result => {
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
        dictPage({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                api.DICT_PAGE_LIST(data).then(result => {
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
        dictDelete({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                api.DICT_DELETE(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
    }
}