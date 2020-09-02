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
                api.PERMISSION_MENU_PAGE(id, data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 保存权限
         * @param {*} dispatch 
         * @param {*} data 
         */
        permissionSave({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                console.info(data)
                api.PERMISSION_SAVE(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 根据id修改
         * @param {*} dispatch 
         * @param {*} {id,data} 
         */
        permissionUpdate({ dispatch }, { id, data }) {
            return new Promise((resolve, reject) => {
                api.PERMISSION_UPDATE_ID(id,data).then(result => {
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
        permissionDelete({dispatch},{id}){
            return new Promise((resolve, reject) => {
                api.PERMISSION_DELETE_ID(id).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        }
    }
}