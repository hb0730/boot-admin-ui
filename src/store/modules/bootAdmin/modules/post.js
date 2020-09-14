import api from "@/api"
export default {
    namespaced: true,
    actions: {
        /**
         * 保存
         * @param {*} dispatch 
         * @param {*} data 
         */
        postSave({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                api.POST_SAVE(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err)
                })
            })
        },
        /**
         * 分页查询
         * @param {*} dispatch 
         * @param {*} data 
         */
        postPage({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                api.POST_PAGE_LIST(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err)
                })
            })
        },
        /**
         * 列表查询
         * @param {context} param0 
         * @param {*} data 
         */
        postList({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                api.POST_LIST(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err)
                })
            })
        },
        /**
         * 根据id修改
         * @param {context} dispatch 
         * @param {*} {id,data} 
         */
        postUpdate({ dispatch }, { id, data }) {
            return new Promise((resolve, reject) => {
                api.POST_UPDATE_ID(id, data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err)
                })
            })
        },
        /**
         * 根据id删除
         * @param {context} dispatch 
         * @param {array} data 
         */
        postDelete({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                api.POST_DELETE(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err)
                })
            })
        },
        /**
         * 导出
         * @param {context} dispatch 
         * @param data 请求参数
         */
        postExport({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                api.POST_EXCEL_EXPORT(data);
            })
        }
    }
}