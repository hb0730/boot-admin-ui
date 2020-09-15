import api from "@/api"
export default {
    namespaced: true,
    actions: {
        /**
         * 获取当前用户菜单树
         * @param {*} dispatch 
         */
        currentMenu({ dispatch }) {
            return new Promise((resolve, reject) => {
                api.MENU_CURRENT().then(result => {
                    dispatch('d2admin/menu/set', result, { root: true })
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        /**
         * 更新当前用户
         * @param {context} dispatch 
         */
        currentUpdate({dispatch}){
            return new Promise((resolve, reject) => {
                api.MENU_UPDATE_CURRENT().then(result => {
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        /**
         * 当前用户路由
         * @param {*} dispatch 
         */
        currentRouter({ dispatch }) {
            return new Promise((resolve, reject) => {
                api.MENU_CURRENT_ROUTER().then(result => {

                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 菜单树
         * @param {*} dispatch 
         */
        queryTree({ dispatch }) {
            return new Promise((resolve, reject) => {
                api.MENU_QUERY_TREE().then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                });
            })
        },
        /**
         * 菜单权限树
         * @param {*} dispatch 
         */
        queryPermissionTree({ dispatch }) {
            //MENU_PERMISSION_TREE
            return new Promise((resolve, reject) => {
                api.MENU_PERMISSION_TREE().then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 根据id修改
         * @param {*} dispatch 
         * @param {*} url
         * @param {*} data  
         */
        updateById({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                api.MENU_UPDATE_ID(url, data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 新增菜单
         * @param {*} dispatch 
         * @param {*} data 
         */
        save({ dispatch }, { data }) {
            return new Promise((resolve, rejcet) => {
                api.MENU_SAVE(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 根据id删除
         * @param {*} dispatch 
         * @param {*} id 
         */
        deleteById({ dispatch }, { id }) {
            return new Promise((resolve, reject) => {
                api.MENU_DELETE_ID(id).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        }
    }
}