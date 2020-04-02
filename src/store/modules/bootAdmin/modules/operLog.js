import { OperLogAllPage } from "@/api/bootAdmin/monitor/operLog"

export default {
    namespaced: true,
    actions: {
        /**
         * 获取操作日志
         * @param {*} context 
         * @param {*} url,data
         */
        operLogAllPage({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                OperLogAllPage(url, data).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            })
        }
    }
}