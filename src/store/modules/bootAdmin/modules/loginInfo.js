import { LoginInfoAllPage } from "@/api/bootAdmin/monitor/loginInfo"

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
        }
    }
}
