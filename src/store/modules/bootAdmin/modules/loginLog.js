import api from "@/api"

export default {
    namespaced: true,
    actions: {
        /**
         * 分页查询
         * @param {*} dispatch 
         * @param {*} data 
         */
        loginLogPage({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                api.LOGIN_LOG_LIST_PAGE(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
          /**
         * 删除
         * @param {*} dispatch 
         * @param {*} data 
         */
        loginLogDelete({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                api.LOGIN_LOG_DELETE(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
          /**
         * 清除
         * @param {*} dispatch 
         */
        loginLogClean({ dispatch }) {
            return new Promise((resolve, reject) => {
                api.LOGIN_LOG_CLEAN().then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
    }
}