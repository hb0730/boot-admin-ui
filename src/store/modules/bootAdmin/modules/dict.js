import { DictSave, DictPageAll, DictDataPageAll, DictUpdate, DictDelete, DictMap } from "@/api/bootAdmin/systemManager/dict"
import { dictMapPath } from "@/api/baseUrl"

export default {
    namespaced: true,
    actions: {
        /**
         *  保存数据字典
         * @param {*} dispatch
         * @param {*} url 
         * @param {*} data 
         */
        dictSave({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                DictSave(url, data).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        /**
         * 获取数据字典
         * @param {*} url 
         * @param {*} data 
         */
        dictPageAll({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                DictPageAll(url, data).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        /**
         * 获取字典项
         * @param {*} url,data
         */
        dictDataPageAll({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                DictDataPageAll(url, data).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        /**
         * 修改
         * @param {*} param0 
         */
        dictUpdate({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                DictUpdate(url, data).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        /**
         * 删除
         * @param {*} param0 
         * @param {*} param1 
         */
        dictDelete({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                DictDelete(url, data).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        /**
         * 字典类型
         * @param {*} param0 
         */
        dictMap({ dispatch },{url}) {
            return new Promise(async (resolve, reject) => {
                await DictMap(url,null).then(result => {
                    // db 存储
                    dispatch('d2admin/dict/set', JSON.parse(JSON.stringify(result)), { root: true })
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        }
    }
}