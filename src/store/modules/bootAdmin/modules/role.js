import { RoleAll, RolePageAll, RoleSave, RoleUpdate, RoleDelete, RolePermissionAll, RolePermissionSave, RolePermissionMap, RoleOrgAll, RoleOrgSave } from "@/api/bootAdmin/systemManager/role"

export default {
    namespaced: true,
    actions: {
        /**
         * 获取全部角色
         * @param {*} url 
         * @param {*} data 
         */
        roleAll({dispatch},{url,data}={}){
            return new Promise((resolve,reject)=>{
                RoleAll(url,data).then(result=>{
                    resolve(result)
                }).catch(err=>{
                    reject(err)
                })
            })
        },
        /**
         * 分页后的角色
         * @param {*} url 
         * @param {*} data 
         */
        roleAllPage({dispatch},{url,data}={}){
            return new Promise((resolve,reject)=>{
                RolePageAll(url,data).then(result=>{
                    resolve(result)
                }).catch(err=>{
                    reject(err)
                })
            })
        },
        /**
         * 角色保存
         * @param {*} url 
         * @param {*} data 
         */
        roleSave({dispatch},{url,data}={}){
            return new Promise((resolve,reject)=>{
                RoleSave(url,data).then(result=>{
                    resolve(result)
                }).catch(err=>{
                    reject(err)
                })
            })
        },
         /**
         * 角色修改
         * @param {*} url 
         * @param {*} data 
         */
        roleUpdate({dispatch},{url,data}={}){
            return new Promise((resolve,reject)=>{
                RoleUpdate(url,data).then(result=>{
                    resolve(result)
                }).catch(err=>{
                    reject(err)
                })
            })
        },
        /**
         * 角色删除
         * @param {*} url 
         * @param {*} data 
         */
        roleDelete({dispatch},{url,data}={}){
            return new Promise((resolve,reject)=>{
                RoleDelete(url,data).then(result=>{
                    resolve(result)
                }).catch(err=>{
                    reject(err)
                })
            })
        },
        /**
         * 获取角色权限
         * @param {*} url 
         * @param {*} data 
         */
        rolePermissionAll({dispatch},{url,data}={}){
            return new Promise((resolve,reject)=>{
                RolePermissionAll(url,data).then(result=>{
                    resolve(result)
                }).catch(err=>{
                    reject(err)
                })
            })
        },
        /**
         * 更新角色权限
         * @param {*} url 
         * @param {*} data 
         */
        rolePermissionSave({dispatch},{url,data}={}){
            return new Promise((resolve,reject)=>{
                RolePermissionSave(url,data).then(result=>{
                    resolve(result)
                }).catch(err=>{
                    reject(err)
                })
            })
        },
        /**
         * 获取键值对方式的权限
         * @param {*} url 
         * @param {*} data 
         */
        rolePermissionMap({dispatch},{url,data}){
            return new Promise((resolve,reject)=>{
                RolePermissionMap(url,data).then(result=>{
                    resolve(result)
                }).catch(err=>{
                    reject(err)
                })
            })
        },
        /**
         * 获取角色的数据范围
         * @param {*} url 
         * @param {*} data 
         */
        roleOrgAll({dispatch},{url,data}){
            return new Promise((resolve,reject)=>{
                RoleOrgAll(url,data).then(result=>{
                    resolve(result)
                }).catch(err=>{
                    reject(err)
                })
            })
        },
        /**
         * 保存角色的数据范围
         * @param {*} url 
         * @param {*} data 
         */
        roleOrgSave({dispatch},{url,data}){
            return new Promise((resolve,reject)=>{
                RoleOrgSave(url,data).then(result=>{
                    resolve(result)
                }).catch(err=>{
                    reject(err)
                })
            })
        }
    }
}