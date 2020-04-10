import { UserInfo, UserUpdateInfo, UserUpdatePassword, UserAllPage, UserSave, UserUpdate, UserInfoAll, UserResetPassword, UserDelete, UserUpload } from '@/api/bootAdmin/userManager/user'
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
        },
        /**
         * 用户保存
         * @param {*} url 
         * @param {*} data 
         */
        userSave({ dispatch }, { url, data } = {}) {
            return new Promise((resolve, reject) => {
                UserSave(url, data).then(result => {
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        /**
         * 用户更新
         * @param {*} url 
         * @param {*} data 
         */
        userUpdate({ dispatch }, { url, data } = {}) {
            return new Promise((resolve, reject) => {
                UserUpdate(url, data).then(result => {
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        /**
         * 用户详情
         * @param {*} url 
         * @param {*} data 
         */
        userInfoAll({ dispatch }, { url, data } = {}) {
            return new Promise((resolve, reject) => {
                UserInfoAll(url, data).then(result => {
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        /**
         * 
         * 重置密碼
         * @param {*} param0 
         * @param {*} param1 
         */
        userResetPassword({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                UserResetPassword(url, data).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        /**
         * 用户删除
         * @param {*} param0 
         * @param {*} param1 
         */
        userDelete({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                UserDelete(url, data).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        /**
         * 导入
         * @param {*} param0 
         * @param {*} param1 
         */
        userUpload({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                UserUpload(url, data).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            })
        },
    }
}