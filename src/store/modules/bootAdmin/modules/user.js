import api from "@/api"

export default {
    namespaced: true,
    actions: {
        /**
         * 获取当前登录用户
         * @param {*} dispatch 
         */
        currentUserInfo({ dispatch }) {
            return new Promise((resolve, reject) => {
                api.USER_CURRENT().then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err)
                });
            })
        },
        /**
         * 根据id获取用户详情
         * @param {*} param0 
         * @param {*} param1 
         */
        userInfoBuyId({ dispatch }, { id }) {
            return new Promise((resolve, reject) => {
                api.USER_INFO_ID(id).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err)
                });
            })
        },
        /**
         * 根据id修改用户
         * @param {*} param0 
         * @param {*} param1 
         */
        updateUserInfoById({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                api.USER_UPDATE_INFO(url, data).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        /**
         * 修改密码
         * @param {*} param0 
         * @param {*} param1 
         */
        updatePassword({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                api.USER_PASSWORD_UPDATE(url, data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        }
    }
}