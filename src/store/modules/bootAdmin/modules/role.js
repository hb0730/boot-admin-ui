import api from "@/api"
export default {
    namespaced: true,
    actions: {
        /**
         * 角色保存
         * @param {*} dispatch 
         * @param {*} data 
         */
        roleSave({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                api.ROLE_SAVE(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 分页查询
         * @param {*} dispatch 
         * @param {*} data 
         */
        rolePage({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                api.ROLE_LIST_PAGE(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 角色列表
         * @param {*} dispatch 
         * @param {*} data 
         */
        roleList({dispatch},{data}){
            return new Promise((resolve, reject) => {
                api.ROLE_LIST(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 根据id修改
         * @param {*} dispatch 
         * @param {*} { url, data } 
         */
        roleUpdate({ dispatch }, { id, data }) {
            return new Promise((resolve, reject) => {
                api.ROLE_UPDATE_ID(id, data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 删除
         * @param {*} dispatch 
         * @param {*} data 
         */
        roleDelete({dispatch},{data}){
            return new Promise((resolve, reject) => {
                api.ROLE_DELETE(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 根据id修改权限
         * @param {*} dispatch 
         * @param {*} {id,data} 
         */
        rolePermissionUpdate({dispatch},{id,data}){
            return new Promise((resolve, reject) => {
                api.ROLE_PERMISSION_UPDATE_ID(id, data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        }
    }
}