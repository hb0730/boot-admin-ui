import api from "@/api"
export default {
    namespaced: true,
    actions: {
        /**
         * 分页查询
         * @param {*} dispatch 
         * @param {*} data 
         */
        operLogListPage({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                api.OPER_LOG_LIST_PAGE(data).then(result => {
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
        operLogDelete({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                api.OPER_LOG_DELETE(data).then(result => {
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
        operLogClean({ dispatch }) {
            return new Promise((resolve, reject) => {
                api.OPER_LOG_CLEAN().then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        }
    }
}