import { imagePage, imageList, imageDelete, imageDeletes, imageUpload, imageUploads } from "@/api/bootAdmin/systemManager/img"

export default {
    namespaced: true,
    actions: {
        /**
         * 分页查询
         * @param {*} param0 
         * @param {*} param1 
         */
        ImgPage({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                return imagePage(url, data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
            * 列表查询
            * @param {*} param0 
            * @param {*} param1 
            */
        ImgList({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                return imageList(url, data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 删除
         * @param {*} param0 
         * @param {*} param1 
         */
        ImgDelete({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                return imageDelete(url, data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 删除
         * @param {*} param0 
         * @param {*} param1 
         */
        ImgDeletes({ dispatch }, { url, data }) {
            return new Promise((resolve, reject) => {
                return imageDeletes(url, data).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 上传
         * @param {*} param0 
         * @param {*} param1 
         */
        ImgUpload({ dispatch }, { url, formData, uploadProgress, cancelToken }) {
            return new Promise((resolve, reject) => {
                return imageUpload(url, formData, uploadProgress, cancelToken).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * 上传
         * @param {*} param0 
         * @param {*} param1 
         */
        ImgUploads({ dispatch }, { url, formData, uploadProgress, cancelToken }) {
            return new Promise((resolve, reject) => {
                return imageUploads(url, formData, uploadProgress, cancelToken).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
    }
}