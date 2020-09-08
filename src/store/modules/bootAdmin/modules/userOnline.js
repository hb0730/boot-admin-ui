import api from "@/api"

export default {
    namespaced: true,
    actions: {
        /**
         * 在线用户分页
         * @param {*} dispatch 
         * @param {*} data 
         */
        userOnlinePage({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                api.USER_ONLINE_LIST_PAGE(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 登出
         * @param {*} dispatch 
         * @param {*} key 
         */
        userOnlineLogoutKey({ dispatch }, { key }) {
            return new Promise((resolve, reject) => {
                api.USER_ONLINE_LOGOUT_KEY(key).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 登出
         * @param {*} dispatch 
         * @param {*} key 
         */
        userOnlineLogout({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                api.USER_ONLINE_LOGOUT(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
    }
}