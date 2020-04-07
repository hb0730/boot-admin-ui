import { OperLogAllPage, OperLogDelete, OperLogClean } from "@/api/bootAdmin/monitor/operLog"

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
        },
        /**
         * 删除
         * @param {*} context 
         * @param {*} url,data
         */
        operLogDelete({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                OperLogDelete(url, data).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        /**
         * 清空
         * @param {*} context 
         * @param {*} url,data
         */
        operLogClean({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                OperLogClean(url, data).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            })
        }
    }
}