import { DEFAULT_PRIMARY } from '@/config'
import { LayoutMode, Size, ThemeColorMode } from '@/utils/enums'
import { store } from '..'
import piniaPersistConfig from '../helper/persist'

type SettingsValue = LayoutMode | Size | ThemeColorMode | string | boolean | number
/**
 * @description 全局状态
 */
export const useGlobalStore = defineStore(
  'app-global',
  () => {
    // 布局模式 (纵向：vertical | 经典：classic | 横向：transverse | 分栏：columns)
    const layout = ref(LayoutMode.classic)
    // element 组件大小
    const size = ref(Size.default)
    // 当前页面是否全屏
    const maximize = ref(false)
    // 主题颜色
    const primary = ref(DEFAULT_PRIMARY)
    // 深色模式
    const isDark = ref(false)
    // 模式类型
    const colorMode = ref<ThemeColorMode>(ThemeColorMode.auto)
    // 灰色模式
    const isGrey = ref(false)
    // 色弱模式
    const isWeak = ref(false)
    // 侧边栏反转
    const asideInverted = ref(false)
    // 头部反转
    const headerInverted = ref(false)
    // 折叠菜单
    const isCollapse = ref(false)
    // 菜单手风琴
    const isAccordion = ref(true)
    // 页面水印
    const watermark = ref(false)
    // 面包屑导航
    const breadcrumb = ref(true)
    // 面包屑导航图标
    const breadcrumbIcon = ref(true)
    // 标签页
    const tabs = ref(true)
    // 标签页图标
    const tabsIcon = ref(true)
    // 页脚
    const footer = ref(true)
    // 未读消息
    const unreadCount = ref(0)
    // 设置更改函数
    const settingsMap: Record<string, Ref<SettingsValue>> = {
      layout,
      size,
      maximize,
      primary,
      isDark,
      colorMode,
      isGrey,
      isWeak,
      asideInverted,
      headerInverted,
      isCollapse,
      isAccordion,
      watermark,
      breadcrumb,
      breadcrumbIcon,
      tabs,
      tabsIcon,
      footer,
      unreadCount,
    }

    // 设置全局状态
    const setGlobalState = (key: string, value: SettingsValue) => {
      const target = settingsMap[key]
      if (target)
        target.value = value
    }

    return {
      layout,
      size,
      maximize,
      primary,
      isDark,
      colorMode,
      isGrey,
      isWeak,
      asideInverted,
      headerInverted,
      isCollapse,
      isAccordion,
      watermark,
      breadcrumb,
      breadcrumbIcon,
      tabs,
      tabsIcon,
      footer,
      unreadCount,
      setGlobalState,
    }
  },
  {
    persist: piniaPersistConfig('app-global'),
  },
)

export function globalStoreHook() {
  return useGlobalStore(store)
}
