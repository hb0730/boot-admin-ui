import api from "@/api"

export default {
    namespaced: true,
    actions: {
        /**
         * 分页查询
         * @param {*} dispatch 
         * @param {*} data 
         */
        jobListPage({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                api.JOB_LIST_PAGE(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 列表查询
         * @param {*} dispatch 
         * @param {*} data 
         */
        jobList({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                api.JOB_LIST(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 保存查询
         * @param {*} dispatch 
         * @param {*} data 
         */
        jobSave({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                api.JOB_SAVE(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 修改查询
         * @param {*} dispatch 
         * @param {*} {id,data} 
         */
        jobUpdate({ dispatch }, { id, data }) {
            return new Promise((resolve, reject) => {
                api.JOB_UPDATE_ID(id, data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 删除查询
         * @param {*} dispatch 
         * @param {*} data
         */
        jobDelete({ dispatch }, { data }) {
            return new Promise((resolve, reject) => {
                api.JOB_DELETE(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 立即执行
         * @param {context} dispatch 
         * @param {*} id 
         */
        jobExec({ dispatch }, { id }) {
            return new Promise((resolve, reject) => {
                api.JOB_EXEC(id).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        }
    }
}