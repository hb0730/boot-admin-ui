import { UserOnlineAllPage } from "@/api/bootAdmin/monitor/userOnline"

export default {
    namespaced: true,
    actions: {
        /**
         * 在线用户
         * @param {*} param0 
         * @param {*} param1 
         */
        userOnlineAllPage({dispatch},{url,data}){
            return new Promise((resolve,reject)=>{
                UserOnlineAllPage(url,data).then(result=>{
                    resolve(result)
                }).catch(err=>{
                    reject(err)
                })
            })
        }
    }
  }