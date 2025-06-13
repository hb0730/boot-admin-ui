import * as authApi from '@/api/modules/auth'
import { getAllBreadcrumbList, getFlatMenuList, getShowMenuList } from '@/utils'
import { store } from '..'

export const useAuthStore = defineStore('app-auth', () => {
  // 按钮权限列表
  const authButtonList = ref([])
  // 菜单权限列表
  const authMenuList = ref<Menu.MenuOptions[]>([])
  // 当前页面的 router name，用来做按钮权限筛选
  const routeName = ref('')

  // Get AuthButtonList
  async function getAuthButtonList() {
    // const { data } = await getAuthButtonListApi();
    // this.authButtonList = data;
  }
  // Get AuthMenuList
  async function getAuthMenuList() {
    const { data } = await authApi.getAuthMenuList()
    authMenuList.value = data.menu
    authButtonList.value = data.auth
  }
  // Set RouteName
  async function setRouteName(name: string) {
    routeName.value = name
  }

  // 递归处理后的所有面包屑导航列表
  function breadcrumbListGet() {
    return getAllBreadcrumbList(authMenuList.value)
  }
  // 菜单权限列表 ==> 扁平化之后的一维数组菜单，主要用来添加动态路由
  function flatMenuListGet() {
    return getFlatMenuList(authMenuList.value)
  }

  // 菜单权限列表 ==> 左侧菜单栏渲染，需要剔除 isHide == true
  function showMenuListGet() {
    return getShowMenuList(authMenuList.value)
  }

  return {
    authButtonList,
    authMenuList,
    routeName,
    getAuthButtonList,
    getAuthMenuList,
    setRouteName,
    breadcrumbListGet,
    flatMenuListGet,
    showMenuListGet,
  }
})

export function authStoreHook() {
  return useAuthStore(store)
}
