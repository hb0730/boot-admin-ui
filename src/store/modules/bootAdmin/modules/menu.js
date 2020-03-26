import { MenuTree, MenuSave, MenuUpdate, MenuDelete } from '@/api/bootAdmin/systemManager/menu'
export default {
    namespaced: true,
    actions: {
        /**
         * 获取树形菜单
         * @param {*} url 
         * @param {*} data 
         */
        menuTree({ dispatch }, { url, data } = {}) {
            return new Promise((resolve, reject) => {
                MenuTree(url, data).then(result => {
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        /**
         * 菜单新增
         * @param {} url 
         * @param {*} data 
         */
        menuSave({ dispatch }, { url, data } = {}) {
            return new Promise((resolve, reject) => {
                MenuSave(url, data).then(result => {
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        /**
         * 菜单修改
         * @param {*} url 
         * @param {*} data 
         */
        menuUpdate({ dispatch }, { url, data } = {}) {
            return new Promise((resolve, reject) => {
                MenuUpdate(url, data).then(result => {
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        /**
         * 菜单删除
         * @param {*} url 
         * @param {*} data 
         */
        menuDelete({ dispatch }, { url, data } = {}) {
            return new Promise((resolve, reject) => {
                MenuDelete(url, data).then(result => {
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
}