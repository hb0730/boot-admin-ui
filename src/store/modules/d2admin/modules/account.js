import { Message, MessageBox } from 'element-ui'
import util from '@/libs/util.js'
import router from '@/router'
import api from '@/api'

export default {
  namespaced: true,
  state: {
    // 用户登录状态
    isLogged: !!util.cookies.get("token")
  },
  actions: {
    /**
     * @description 登录
     * @param {Object} context
     * @param {Object} payload username {String} 用户账号
     * @param {Object} payload password {String} 密码
     * @param {Object} payload route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
     */
    async login({ commit, dispatch }, {
      username = '',
      password = '',
      to = "/"
    } = {}) {
      var data = { "username": username, "password": password }
      const res = await api.USER_LOGIN(JSON.parse(JSON.stringify(data)))
      // 设置 cookie 一定要存 uuid 和 token 两个 cookie
      // 整个系统依赖这两个数据进行校验和存储
      // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
      // token 代表用户当前登录状态 建议在网络请求中携带 token
      // 如有必要 token 需要定时更新，默认保存一天
      util.cookies.set('uuid', res.id)
      util.cookies.set('token', res.accessToken)
      // 设置 vuex 用户信息
      await dispatch('d2admin/user/set', { name: res.nickName, user: res }, { root: true })
      // 用户登录后从持久化数据加载一系列的设置
      await dispatch('load')
      // 设置用户已经登陆
      commit('isLoggedSet', true)
      await dispatch('updateCache', { to: to })
    },
    /**
     * @description 注销用户并返回登录页面
     * @param {Object} context
     * @param {Object} payload confirm {Boolean} 是否需要确认
     */
    logout({ commit, dispatch }, { confirm = false } = {}) {
      /**
       * @description 注销
       */
      async function logout() {
        // 设置用户登陆状态
        commit('isLoggedSet', false)

        await api.USER_LOGOUT().then(result => {
          // 删除cookie
          util.cookies.remove('token')
          util.cookies.remove('uuid')
          dispatch('clean')
          // 重置权限并且跳转到登录页 通过 back 参数指定在登陆之后是否需要跳转回原来的页面
          let redirect = router.app.$route.fullPath
          dispatch('bootAdmin/router/load', {
            focus: true,
            to: {
              name: 'login',
              query: redirect ? { redirect } : {}
            },
            data: []
          }, { root: true })
        });

      }
      // 判断是否需要确认
      if (confirm) {
        commit('d2admin/gray/set', true, { root: true })
        MessageBox.confirm('确定要注销当前用户吗', '注销用户', { type: 'warning' })
          .then(() => {
            commit('d2admin/gray/set', false, { root: true })
            logout()
          })
          .catch(() => {
            commit('d2admin/gray/set', false, { root: true })
            Message({ message: '取消注销操作' })
          })
      } else {
        logout()
      }

    },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} context
     */
    async load({ dispatch }) {
      // 加载用户名
      await dispatch('d2admin/user/load', null, { root: true })
      // 加载主题
      await dispatch('d2admin/theme/load', null, { root: true })
      // 加载页面过渡效果设置
      await dispatch('d2admin/transition/load', null, { root: true })
      // 持久化数据加载上次退出时的多页列表
      await dispatch('d2admin/page/openedLoad', null, { root: true })
      // 持久化数据加载侧边栏配置
      await dispatch('d2admin/menu/asideLoad', null, { root: true })
      // 持久化数据加载全局尺寸
      await dispatch('d2admin/size/load', null, { root: true })
      // 持久化数据加载颜色设置
      await dispatch('d2admin/color/load', null, { root: true })
    },
    /**
     * 清理缓存
     * @param {*} param0 
     */
    clean({ dispatch }) {
      return new Promise(async resolve => {
        //  清空页面快照
        await dispatch('d2admin/db/pageClear', {}, { root: true })
        // 清空页面缓存设置
        await dispatch('d2admin/page/closeAll', {}, { root: true })
        // 清空 vuex 用户信息
        await dispatch('d2admin/user/set', { name: "", user: "" }, { root: true })
        resolve();
      })
    },
    /**
     * 更新缓存
     * @param {*} dispatch 
     */
    updateCache({ dispatch }, { to = "/" }) {
      return new Promise(async resolve => {
        // 先更新
        await api.MENU_CURRENT_UPDATE().then(result=>{
        // 加载菜单
          dispatch('bootAdmin/menu/currentMenu', {}, { root: true })
        })
        //路由
        await api.MENU_CURRENT_ROUTER().then(result => {
          dispatch('bootAdmin/router/load', { focus: true, to: to, data: result }, { root: true })
        });
        await api.DICT_CACHE_UPDATE();
        await api.DICT_CACHE_GET().then(resutl => {
          dispatch('d2admin/dict/set',resutl, { root: true });
        })
        resolve();
      })

    }
  },
  mutations: {
    /**
     * @description 设置用户登陆状态
     * @param {Object} state state
     * @param {Boolean} value 是否登录
     */
    isLoggedSet(state, value) {
      state.isLogged = value
    }
  }
}
