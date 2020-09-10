import api from "@/api"

export default {
    namespaced: true,
    actions: {
        /**
         * 分页查询
         * @param {context} dispatch 
         * @param {*} data 
         */
        userPage({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                api.USER_PAGE_LIST(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 保存
         * @param {context} dispatch 
         * @param {*} data 
         */
        userSave({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                api.USER_SAVE(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 修改
         * @param {context} dispatch 
         * @param {*} {id,data} 
         */
        userUpdate({ dispatch }, { id,data }) {
            return new Promise((resolve, reject) => {
                api.USER_UPDATE_ID(id,data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 删除
         * @param {context} dispatch 
         * @param {*} data
         */
        userDelete({ dispatch }, {data }) {
            return new Promise((resolve, reject) => {
                api.USER_DELETE(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 重置密码
         * @param {*} dispatch 
         * @param {long} id
         */
        userRestPassword({dispatch},{id}){
            return new Promise((resolve, reject) => {
                api.USER_REST_PASSWORD(id).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        }

    }
}