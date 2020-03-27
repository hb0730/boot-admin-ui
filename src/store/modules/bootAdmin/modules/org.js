import { OrgSave, OrgTreeAll, OrgUpdate, OrgDelete } from "@/api/bootAdmin/systemManager/org"

export default {
    namespaced: true,
    actions: {
        /**
         * 组织保存
         * @param {*} url 
         * @param {*} data 
         */
        orgSave({ dispatch }, { url, data } = {}) {
            return new Promise((resolve, reject) => {
                OrgSave(url, data).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        /**
         * 组织树
         * @param {*} url 
         * @param {*} data 
         */
        orgTreeAll({ dispatch }, { url, data } = {}) {
            return new Promise((resolve, reject) => {
                OrgTreeAll(url, data).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        /**
         * 修改组织
         * @param {*} url 
         * @param {*} data 
         */
        orgUpdate({ dispatch }, { url, data } = {}) {
            return new Promise((resolve, reject) => {
                OrgUpdate(url, data).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        /**
         *  删除
         * @param {*} url 
         * @param {*} data 
         */
        orgDelete({ dispatch }, { url, data } = {}) {
            return new Promise((resolve, reject) => {
                OrgDelete(url, data).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            })
        }
    }
}
