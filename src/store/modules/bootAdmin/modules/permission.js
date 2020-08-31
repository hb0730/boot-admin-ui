import api from "@/api";
const permission = {
    namespaced: true,
    state: {
        // 是否已经加载
        isLoaded: false,
        // 用户权限
        permissions: []
    },
    actions: {
        /**
         * @description 加载用户菜单
         * @param {Object} vuex context
         * @param {Object} payload focus {Boolean} 强制重新加载动态路由 此项有值的时候加载状态校验跳过
         * @param {Object} payload to {String} 动态路由加载完成后跳转的页面
         * @param {Object} payload data {Array} 手动设置数据源 用来人工模拟权限数据或者重置权限设置 此项有值的时候登陆状态校验跳过
         */
        async load({ state, rootState, commit, dispatch }, { focus = false, to = '', data }) {
            // 取消请求 - 已经加载过动态路由
            if (!focus && state.isLoaded) return
            // 获取接口原始数据
            const source = data || await api.MENU_CURRENT_ROUTER();
            console.info(source)
        }
    },
    mutations: {
        /**
         * @description 设置动态路由加载状态
         * @param {Object} state state
         * @param {Boolean} value 是否已经加载动态路由
         */
        isLoadedSet(state, value) {
            state.isLoaded = value
        }
    }
}

export default permission;