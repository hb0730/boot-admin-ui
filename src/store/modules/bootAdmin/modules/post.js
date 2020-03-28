import { PostAllPage, PostAll, PostSave, PostUpdate, PostDelete } from "@/api/bootAdmin/userManager/post"

export default {
    namespaced: true,
    actions: {
        /**
         * 分页后的岗位
         * @param {*} url 
         * @param {*} data 
         */
        postAllPage({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                PostAllPage(url, data).then(reuslt => {
                    resolve(reuslt)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        /**
        * 分页后的岗位
        * @param {*} url 
        * @param {*} data 
        */
        postAll({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                PostAll(url, data).then(reuslt => {
                    resolve(reuslt)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        /**
         * 岗位保存
         * @param {*} url 
         * @param {*} data 
         */
        postSave({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                PostSave(url, data).then(reuslt => {
                    resolve(reuslt)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        /**
         * 岗位修改
         * @param {*} url 
         * @param {*} data 
         */
        postUpdate({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                PostUpdate(url, data).then(reuslt => {
                    resolve(reuslt)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        /**
         * 岗位删除
         * @param {*} url 
         * @param {*} data 
         */
        postDelete({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                PostDelete(url, data).then(reuslt => {
                    resolve(reuslt)
                }).catch(err => {
                    reject(err)
                })
            })
        }
    }
}