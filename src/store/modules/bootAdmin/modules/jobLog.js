import api from "@/api"

export default {
    namespaced: true,
    actions: {
        /**
         * 定时任务日志分页查询
         * @param {*} dispatch 
         * @param {*} data 
         */
        jobLogPage({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                api.JOB_LOG_LIST_PAGE(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        }
    }
}