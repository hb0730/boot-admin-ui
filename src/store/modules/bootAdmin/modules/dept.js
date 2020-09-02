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
        }
    }
}