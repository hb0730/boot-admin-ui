export default {
    namespaced: true,
    state: {
        // 数据字典信息
        info: {}
    },
    actions: {
        /**
         * 设置数据字典
         * @param {*} param0 
         * @param {*} info 
         */
        set({ state, dispatch }, info) {
            return new Promise(async resolve => {
                // store 赋值
                state.info = info
                // 持久化
                await dispatch('d2admin/db/set', {
                    dbName: 'sys',
                    path: 'dict',
                    value: info,
                    user: false
                }, { root: true })
                // end
                resolve()
            })
        },
        /**
         * 从数据库取数据字典
         * @param {*} param0 
         */
        getDictMap({ state, dispatch }) {
            return new Promise(async resolve => {
                // store 赋值
                state.info = await dispatch('d2admin/db/get', {
                    dbName: 'sys',
                    path: 'dict',
                    defaultValue: {},
                    user: false
                }, { root: true })
                // end
                resolve(state.info)
            })
        }
    }
}