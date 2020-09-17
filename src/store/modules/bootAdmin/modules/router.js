import api from "@/api";
import router, { createRoutesInLayout, routesOutLayout, resetRouter } from '@/router'
import utils from '@/libs/util.js'
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
            // 取消请求 - 没有登录
            if (!data && !rootState.d2admin.account.isLogged) return
            // 取消请求 - 已经加载过动态路由
            if (!focus && state.isLoaded) return
            // 获取接口原始数据
            const source = data || await api.MENU_CURRENT_ROUTER();
            //  [ 路由 ] 计算路由
            const routes = createRoutesInLayout(getRoutes(source)).concat(routesOutLayout)
            // [ 路由 ] 重新设置路由
            resetRouter(routes)
            // [ 路由 ] 重新设置多标签页池
            commit('d2admin/page/init', routes, { root: true })
            // [ 标签页 ] 重新计算多标签页数据
            dispatch('d2admin/page/openedLoad', { filter: true }, { root: true })
            // [ 搜索 ] 初始化搜索数据
            // commit('d2admin/search/init', menus, { root: true })
            // [ 路由 ] 重新访问
            if (to) router.replace(to)
            // 标记已经加载过动态路由
            commit('isLoadedSet', true)
        },

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
/**
 * @description 从接口返回的数据中计算出路由
 * @param {Array} menuSource 接口返回的原始菜单数据
 */
export function getRoutes(menuSource) {
    /**
     * @description 检验是否为合法路由
     * @param {Object} sourceItem 原始数据的一项
     */
    function isEffectiveRoute(sourceItem) {
        // if (sourceItem.menu_type !== context.env.VUE_APP_DICT_MENU_TYPE_MENU) return
        // const sourceItemKeys = keys(sourceItem)
        // const hasAllRequiredProperties = [
        //     'menu_name',
        //     'route_name',
        //     'route_path',
        //     'route_component'
        // ].reduce((res, keyname) => res && sourceItemKeys.includes(keyname) && sourceItem[keyname], true)
        // if (!hasAllRequiredProperties) return
        return true
    }
    /**
     * @description 检验是否已经注册过此路由
     * @description 在 vue-router 中路由的 name 不允许重复
     * @param {Array} registered 已经注册的路由
     * @param {Object} sourceItem 原始数据的一项
     */
    function isUnregistered(registered, sourceItem) {
        return !registered.find(item => item.name === sourceItem.name)
    }
    /**
     * @description 依次处理原始数据，返回处理后的路由
     * @param {Array} routes 上次处理返回的结果
     * @param {Object} sourceItem 原始数据的一项
     */
    function maker(routes, sourceItem) {
        if (hasRouteChildren(sourceItem)) {
            // 有子菜单 递归获取所有子菜单的路由
            routes = routes.concat(sourceItem.children.reduce(maker, []))
        } else if (isUnregistered(routes, sourceItem)) {
            try {
                let route = {
                    path: sourceItem.path,
                    name: sourceItem.name,
                    meta: {
                        title: sourceItem.meta.title,
                        auth: sourceItem.meta.auth,
                        cache: sourceItem.meta.cache
                        // cache: true
                    },
                    component: utils.import(sourceItem.component)
                }
                routes.push(route)
            } catch (error) {
                utils.log.capsule('菜单', '文件不存在', 'danger')
                utils.log.danger(error.message)
            }
        }
        return routes
    }
    return menuSource.reduce(maker, [])
}
/**
 * @description 检查一个菜单是否有子菜单
 * @param {Object} item 接口返回菜单中的一项原始数据
 */
export function hasRouteChildren(item = {}, keyname = 'children') {
    return utils.helper.hasChildren(item, keyname)
}