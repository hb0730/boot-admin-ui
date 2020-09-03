import api from "@/api"
export default {
    namespaced: true,
    actions: {
        /**
         * 组织树
         * @param {*} dispatch 
         * @param {*} {} 
         */
        deptTree({ dispatch }) {
            return new Promise((resolve, reject) => {
                api.DEPT_TREE_ALL().then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 根据id修改
         * @param {*} dispatch 
         * @param {*} {id,data}) 
         */
        deptUpdate({ dispatch }, { id, data }) {
            return new Promise((resolve, reject) => {
                api.DEPT_UPDATE_ID(id, data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 新增
         * @param {*} dispatch 
         * @param {*} data 
         */
        deptSave({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                api.DEPT_SAVE(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                });
            })
        },
        /**
         * 根据id删除
         * @param {*} dispatch 
         * @param {*} id 
         */
        deptDelete({ dispatch }, { id }) {
            return new Promise((resolve, reject) => {
                api.DEPT_DELETE_ID(id).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err);
                });
            })
        }
    }
}