import { UserInfo, UserUpdateInfo, UserUpdatePassword, UserAllPage } from '@/api/bootAdmin/userManager/user'
export default {
    namespaced: true,
    actions: {
        /**
         * 用户详情
         * @param {*} url 
         * @param {*} data 
         */
        userInfo({ dispatch }, { url, data } = {}) {
            return new Promise((resolve, reject) => {
                UserInfo(url, data).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        /**
         * 修改用户详情
         * @param {*} url 
         * @param {*} data 
         */
        userUpdateInfo({ dispatch }, { url, data } = {}) {
            return new Promise((resolve, reject) => {
                UserUpdateInfo(url, data).then(result => {
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        /**
         * 修改用户密码
         * @param {*} url 
         * @param {*} data 
         */
        userUpdatePassword({ dispatch }, { url, data } = {}) {
            return new Promise((resolve, reject) => {
                UserUpdatePassword(url, data).then(result => {
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        /**
         * 分页后的用户
         * @param {*} url 
         * @param {*} data 
         */
        userAllPage({ dispatch }, { url, data } = {}) {
            return new Promise((resolve, reject) => {
                UserAllPage(url, data).then(result => {
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            })
        }

    }
}