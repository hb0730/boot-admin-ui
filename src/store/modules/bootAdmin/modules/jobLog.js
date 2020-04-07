import {JobLogAllPage, JobLogDelete, JobLogClean} from "@/api/bootAdmin/monitor/jobLog"
export default {
    namespaced: true,
    actions: {
        /**
         * 调度日志
         * @param {*} context 
         * @param {*} url,data
         */
        jobLogAllPage({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                JobLogAllPage(url, data).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        /**
         * 调度日志删除
         * @param {*} context 
         * @param {*} url,data
         */
        jobLogDelete({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                JobLogDelete(url, data).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        /**
         * 调度日志清空
         * @param {*} context 
         * @param {*} url,data
         */
        jobLogClean({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                JobLogClean(url, data).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            })
        }
    }
}