import api from "@/api"

export default {
    namespaced: true,
    actions: {
        /**
         * mail详情
         * @param {context} dispatch 
         */
        mailInfo({ dispatch }) {
            return new Promise((resolve, reject) => {
                api.MAIL_INFO().then(result => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        /**
         * mail保存
         * @param {context} dispatch 
         * @param {jsonString} data
         */
        mailSave({ dispatch }, { data }) {
            return new Promise((resolve, rejcet) => {
                api.MAIL_SAVE(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    rejcet(err);
                })
            })
        },
        /**
         * mail测试
         * @param {context} dispatch 
         * @param {jsonString} data
         */
        mailTest({ dispatch }, { data }) {
            return new Promise((resolve, rejcet) => {
                api.MAIL_TEST(data).then(result => {
                    resolve(result);
                }).catch(err => {
                    rejcet(err);
                })
            })
        }
    }
}