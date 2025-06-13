import * as authApi from '@/api/modules/auth'
import { HOME_URL } from '@/config'
import router from '@/router'
import { initDynamicRouter } from '@/router/modules/dynamicRouter'
import { store, useKeepAliveStore, useTabsStore } from '..'
import piniaPersistConfig from '../helper/persist'

export const useUserStore = defineStore('app-user', () => {
  const tabsStore = useTabsStore()
  const keepAliveStore = useKeepAliveStore()

  
  const token = ref('')
  function setToken(value: string) {
    token.value = value
  }

  const userInfo = ref<any>({})

  /**
   * 登录成功后的操作
   */
  async function afterLogin() {
    // 1.添加动态路由
    await initDynamicRouter()
    // 2.清空 tabs、keepAlive 数据
    tabsStore.setTabs([])
    keepAliveStore.setKeepAliveName([])
    // 3.跳转到首页
    router.push(HOME_URL)
    // 4. 获取用户信息
    _userInfo()
    // 5. 获取按钮权限
  }

  async function afterLogout() {
    // 1.清空 tabs、keepAlive 数据
    userInfo.value = {}
    token.value = ''
  }

  async function _userInfo() {
    const { data, success } = await authApi.getCurrentUser()
    if (success) {
      userInfo.value = data
    }
  }

  return {
    token,
    userInfo,
    setToken,
    afterLogin,
    afterLogout,
  }
}, {
  persist: piniaPersistConfig('zoom-user'),
})

export function useStoreHook() {
  return useUserStore(store)
}
