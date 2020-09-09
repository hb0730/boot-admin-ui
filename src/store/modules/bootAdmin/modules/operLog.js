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
        }
    }
}