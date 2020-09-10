import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'
import util from '@/libs/util.js'

// 路由数据
import routerList from './routes'

import layoutHeaderAside from '@/layout/header-aside'
import { Message, MessageBox, Notification } from 'element-ui'

// fix vue-router NavigationDuplicated
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return VueRouterPush.call(this, location).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location) {
  return VueRouterReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

/**
 * 创建路由
 * @param {*} routers 路由设置
 */
const createRouter = (routes = []) => new VueRouter({
  routes
})

// 导出路由 在 main.js 里使用
const router = createRouter(routerList);

/**
 * @description 创建在 layout 中显示的路由设置
 * @param {Array} routes 动态路由设置
 */
export function createRoutesInLayout(routes = []) {
  return [
    {
      path: '/',
      redirect: { name: 'index' },
      component: layoutHeaderAside,
      children: [
        { path: 'index', name: 'index', meta: { title: '首页', auth: true }, component: util.import('system/index') },
        { path: 'log', name: 'log', meta: { title: '前端日志', auth: true }, component: util.import('system/log') },
        ...routes
      ]
    },
    {
      path: "/boot/admin/system/user",
      name: 'userManager',
      auth: true,
      redirect: {
        name: 'user-manager-index'
      },
      component: layoutHeaderAside,
      children: [
        {
          path: '/boot/admin/system/user/setting',
          name: `user-setting`,
          component: util.import('bootAdmin/system/user/info/setting/index'),
          meta: {
            auth: true,
            title: '用户设置'
          }
        }, {
          path: '/boot/admin/monitor/log/job',
          name: 'job-log',
          component: util.import('bootAdmin/monitor/log/job/index'),
          meta: {
            auth: true,
            title: '调度日志'
          }
        }
      ]
    }
  ]
}
// 在 layout 之外显示的路由
export const routesOutLayout = [
  { path: '/refresh', name: 'refresh', component: util.import('system/function/refresh'), hidden: true },
  { path: '/redirect/:route*', name: 'redirect', component: util.import('system/function/redirect'), hidden: true },
  { path: '/login', name: 'login', component: util.import('system/login'), hidden: true },
  { path: '*', name: '404', component: util.import('system/error/404'), hidden: true }
]
/**
 * @description 重新设置路由
 * @param {Array} routes 额外追加的路由
 */
export function resetRouter(routes = []) {
  router.matcher = createRouter(routes).matcher
}
/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
  // 确认已经加载多标签页数据 https://github.com/d2-projects/d2-admin/issues/201
  await store.dispatch('d2admin/page/isLoaded')
  // 确认已经加载组件尺寸设置 https://github.com/d2-projects/d2-admin/issues/198
  await store.dispatch('d2admin/size/isLoaded')
  // 加载动态路由 内部已经做了对登录状态和是否已经加载动态路由的判断
  await store.dispatch('bootAdmin/router/load', { to: to.fullPath })
  // 进度条
  NProgress.start()
  // 关闭搜索面板
  store.commit('d2admin/search/set', false)
  // 验证当前路由所有的匹配中是否需要有登录验证的
  if (to.matched.some(r => r.meta.auth)) {
    // 这里暂时将cookie里是否存有token作为验证是否登录的条件
    // 请根据自身业务需要修改
    const token = util.cookies.get('token')
    if (token && token !== 'undefined') {
      next()
    } else {
      // 没有登录的时候跳转到登录界面
      // 携带上登陆成功之后需要跳转的页面完整路径
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
      // https://github.com/d2-projects/d2-admin/issues/138
      NProgress.done()
    }
  } else {
    // 不需要身份校验 直接通过
    next()
  }
})

router.afterEach(to => {
  // 进度条
  NProgress.done()
  // 多页控制 打开新的页面
  store.dispatch('d2admin/page/open', to)
  // 更改标题
  util.title(to.meta.title)
})

export default router
