import { ImageFileUpload } from "@/api/bootAdmin/common/file"

export default {
    namespaced: true,
    actions: {
        /**
         * 图片上传
         * @param {*} param0 
         * @param {*} param1 
         */
        imageFileUpload({ dispatch }, { url, data }) {
            return Promise((resolve, reject) => {
                return ImageFileUpload(url, data).then(result => {
                    resolve(result)
                }).catch(err => {
                    reject(err)
                })
            })
        }
    }
}