import router from '@/router'
import { getUrlWithParams } from '@/utils'
import { store, useKeepAliveStore } from '..'
import piniaPersistConfig from '../helper/persist'

export const useTabsStore = defineStore(
  'app-tabs',
  () => {
    const keepAliveStore = useKeepAliveStore()

    const tabsMenuList = ref<Tabs.TabsMenuProps[]>([])

    // Add Tabs
    async function addTabs(tabItem: Tabs.TabsMenuProps) {
      if (tabsMenuList.value.every(item => item.path !== tabItem.path)) {
        tabsMenuList.value.push(tabItem)
      }
      // add keepalive
      if (!keepAliveStore.keepAliveName.includes(tabItem.name) && tabItem.isKeepAlive) {
        keepAliveStore.addKeepAliveName(tabItem.path)
      }
    }
    // Remove Tabs
    async function removeTabs(tabPath: string, isCurrent: boolean = true) {
      if (isCurrent) {
        tabsMenuList.value.forEach((item, index) => {
          if (item.path !== tabPath)
            return
          const nextTab = tabsMenuList.value[index + 1] || tabsMenuList.value[index - 1]
          if (!nextTab)
            return
          router.push(nextTab.path)
        })
      }
      // remove keepalive
      const tabItem = tabsMenuList.value.find(item => item.path === tabPath)
      tabItem?.isKeepAlive && keepAliveStore.removeKeepAliveName(tabItem.path)
      // set tabs
      tabsMenuList.value = tabsMenuList.value.filter(item => item.path !== tabPath)
    }
    // Close Tabs On Side
    async function closeTabsOnSide(path: string, type: 'left' | 'right') {
      const currentIndex = tabsMenuList.value.findIndex(item => item.path === path)
      if (currentIndex !== -1) {
        const range = type === 'left' ? [0, currentIndex] : [currentIndex + 1, tabsMenuList.value.length]
        tabsMenuList.value = tabsMenuList.value.filter((item, index) => {
          return index < range[0] || index >= range[1] || !item.close
        })
      }
      // set keepalive
      const keepAliveList = tabsMenuList.value.filter(item => item.isKeepAlive)
      keepAliveStore.setKeepAliveName(keepAliveList.map(item => item.path))
    }

    // Close MultipleTab
    async function closeMultipleTab(tabsMenuValue?: string) {
      tabsMenuList.value = tabsMenuList.value.filter((item) => {
        return item.path === tabsMenuValue || !item.close
      })
      // set keepalive
      const keepAliveList = tabsMenuList.value.filter(item => item.isKeepAlive)
      keepAliveStore.setKeepAliveName(keepAliveList.map(item => item.path))
    }

    // Set Tabs
    async function setTabs(data: Tabs.TabsMenuProps[]) {
      tabsMenuList.value = data
    }
    // Set Tabs Title
    async function setTabsTitle(title: string) {
      tabsMenuList.value.forEach((item) => {
        if (item.path === getUrlWithParams()) {
          item.title = title
        }
      })
    }

    return {
      tabsMenuList,
      addTabs,
      removeTabs,
      closeTabsOnSide,
      closeMultipleTab,
      setTabs,
      setTabsTitle,
    }
  },
  {
    persist: piniaPersistConfig('app-tabs'),
  },
)

export function tabsStoreHook() {
  return useTabsStore(store)
}
