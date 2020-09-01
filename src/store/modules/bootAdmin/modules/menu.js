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
        }
    }
}