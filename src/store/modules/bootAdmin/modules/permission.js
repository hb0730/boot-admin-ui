import api from "@/api"
export default {
    namespaced: true,
    actions: {
        /**
         * 根据菜单获取权限
         * @param {*} dispatch 
         * @param {*}  { id, data } 
         */
        permissionByMenuId({ dispatch }, { id, data }) {
            return new Promise((resolve, reject) => {
                api.PERMISSION_MENU_PAGE(id,data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        }
    }
}