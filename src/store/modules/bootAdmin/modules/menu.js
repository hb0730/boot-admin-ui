import { MenuTree, MenuSave, MenuUpdate, MenuDelete, PermissionSave, PermissionList,PermissionUpdate,PermissionDelete } from '@/api/bootAdmin/systemManager/menu'
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
        },
        /**
         * 保存权限
         * @param {*} param0 
         * @param {*} param1 
         */
        permissionSave({ dispatch }, { url, data } = {}) {
            return new Promise((resolve, reject) => {
                PermissionSave(url, data).then(result => {
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        /**
         * 获取全部权限(分页)
         * @param {*} url 
         * @param {*} data 
         */
        permissionPageList({ dispatch }, { url, data }={}) {
            return new Promise((resolve, reject) => {
                PermissionList(url, data).then(result => {
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        /**
         * 修改权限
         * @param {*} url 
         * @param {*} data 
         */
        permissionUpdate({dispatch},{url,data}={}){
            return new Promise((resolve, reject) => {
                PermissionUpdate(url, data).then(result => {
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        /**
         * 删除权限
         * @param {*} url 
         * @param {*} data 
         */
        permissionDelete({dispatch},{url,data}={}){
            return new Promise((resolve, reject) => {
                PermissionDelete(url, data).then(result => {
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
}