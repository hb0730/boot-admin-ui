import { LoginInfoAllPage, LoginInfoDelete, LoginInfoClean } from "@/api/bootAdmin/monitor/loginInfo"

export default {
    namespaced: true,
    actions: {
        /**
         * 分页获取访问日志
         * @param {*} context 
         * @param {*} url,data
         */
        loginInfoAllPage({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                LoginInfoAllPage(url, data).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        /**
        * 删除日志
        * @param {*} context 
        * @param {*} url,data
        */
        loginInfoDelete({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                LoginInfoDelete(url, data).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        /**
        * 清空日志
        * @param {*} context 
        * @param {*} url,data
        */
        loginInfoClean({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                LoginInfoClean(url, data).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            })
        }
    }
}
