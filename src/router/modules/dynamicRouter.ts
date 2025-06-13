import type { RouteRecordRaw } from 'vue-router'
import { ElNotification } from 'element-plus'
import { LOGIN_URL } from '@/config'
import { useAuthStore, useUserStore } from '@/store'
import router from '..'

// 引入 views 文件夹下所有 vue 文件
const modules = import.meta.glob('@/views/**/*.vue')

/**
 * @description 初始化动态路由
 */
export async function initDynamicRouter() {
  const userStore = useUserStore()
  const authStore = useAuthStore()
  try {
    await authStore.getAuthMenuList()
    // 2.判断当前用户有没有菜单权限
    if (!authStore.authMenuList.length) {
      ElNotification({
        title: '无权限访问',
        message: '当前账号无任何菜单权限，请联系系统管理员！',
        type: 'warning',
        duration: 3000,
      })
      userStore.setToken('')
      router.replace(LOGIN_URL)
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject('No permission')
    }

    // 3.添加动态路由
    authStore.flatMenuListGet().forEach((item: any) => {
      item.children && delete item.children
      if (item.component && typeof item.component == 'string') {
        item.component = modules[`/src/views${item.component}.vue`]
      }
      if (item.meta.isFull) {
        router.addRoute(item as unknown as RouteRecordRaw)
      }
      else {
        router.addRoute('layout', item as unknown as RouteRecordRaw)
      }
    })
  }
  catch (error) {
    // 当按钮 || 菜单请求出错时，重定向到登陆页
    userStore.setToken('')
    // 当按钮 || 菜单请求出错时，重定向到登陆页
    router.replace(LOGIN_URL)
    return Promise.reject(error)
  }
}
