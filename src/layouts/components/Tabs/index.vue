<script setup lang="ts">
import type { TabPaneName, TabsPaneContext } from 'element-plus'
import { HOME_URL } from '@/config'
import { useAuthStore, useGlobalStore, useKeepAliveStore, useTabsStore } from '@/store'

const route = useRoute()
const router = useRouter()
const tabStore = useTabsStore()
const authStore = useAuthStore()
const globalStore = useGlobalStore()
const keepAliveStore = useKeepAliveStore()

const { proxy } = getCurrentInstance()!
const tabsMenuValue = ref(route.fullPath)
const tabsMenuList = computed(() => tabStore.tabsMenuList)
const tabsIcon = computed(() => globalStore.tabsIcon)

// 右键菜单
const contextMenuRef = ref(null)
const contextMenuVisible = ref(false)
const buttonLeft = ref(0)
const buttonTop = ref(0)
const selectedTag = ref()

// 初始化需要固定的 tabs
function initTabs() {
  authStore.flatMenuListGet().forEach((item) => {
    if (item.meta.isAffix && !item.meta.isHide && !item.meta.isFull) {
      const tabsParams = {
        icon: item.meta.icon,
        title: item.meta.title,
        path: item.path,
        name: item.name,
        close: !item.meta.isAffix,
        isKeepAlive: item.meta.isKeepAlive,
      }
      tabStore.addTabs(tabsParams)
    }
  })
}

// 监听路由的变化（防止浏览器后退/前进不变化 tabsMenuValue）
watch(
  () => route.fullPath,
  () => {
    if (route.meta.isFull)
      return
    tabsMenuValue.value = route.fullPath
    const tabsParams = {
      icon: route.meta.icon as string,
      title: route.meta.title as string,
      path: route.fullPath,
      name: route.name as string,
      close: !route.meta.isAffix,
      isKeepAlive: route.meta.isKeepAlive as boolean,
    }
    tabStore.addTabs(tabsParams)
  },
  { immediate: true },
)

// tabs 拖拽排序
function tabsDrop() {
  // Sortable.create(document.querySelector('.el-tabs__nav') as HTMLElement, {
  //   draggable: '.el-tabs__item',
  //   animation: 300,
  //   onEnd({ newIndex, oldIndex }) {
  //     const tabsList = [...tabStore.tabsMenuList]
  //     const currRow = tabsList.splice(oldIndex as number, 1)[0]
  //     tabsList.splice(newIndex as number, 0, currRow)
  //     tabStore.setTabs(tabsList)
  //   },
  // })
}

// Tab Click
function tabClick(tabItem: TabsPaneContext) {
  const fullPath = tabItem.props.name as string
  router.push(fullPath)
}

// Remove Tab
function tabRemove(fullPath: TabPaneName) {
  tabStore.removeTabs(fullPath as string, fullPath === route.fullPath)
}

// 右键菜单
function openContextMenu(e: MouseEvent) {
  // 查找当前点击的 tab
  // 找到当前点击的标签
  let path = (e.target as HTMLElement).getAttribute('id')
  if (path) {
    path = path.replace('tab-', '')
    selectedTag.value = tabsMenuList.value.find(item => item.path === path)
  }

  const menuMinWidth = 140
  const offsetLeft = proxy?.$el.getBoundingClientRect().left
  const offsetWidth = proxy?.$el.offsetWidth
  const maxLeft = offsetWidth - menuMinWidth
  const left = e.clientX - offsetLeft + 5
  if (left > maxLeft) {
    buttonLeft.value = maxLeft
  }
  else {
    buttonLeft.value = left
  }

  buttonTop.value = e.clientY - 40

  contextMenuVisible.value = true
}

// 监听右键菜单的显示隐藏
watch(contextMenuVisible, (val) => {
  if (val) {
    document.addEventListener('click', closeContextMenu)
  }
  else {
    document.removeEventListener('click', closeContextMenu)
  }
})

// 关闭右键菜单
function closeContextMenu() {
  contextMenuVisible.value = false
}

/**
 *  是否固定标签
 */
function isAffix(tag?: Tabs.TabsMenuProps) {
  return tag?.close === false
}

/**
 * 是否是第一个视图
 */
function isFirstView() {
  try {
    return (
      selectedTag?.value?.path === '/dashboard'
      || selectedTag?.value?.path === tabsMenuList.value[1].path
    )
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (error) {
    return false
  }
}

/**
 * 是否是最后一个视图
 */
function isLastView() {
  try {
    return (
      selectedTag?.value?.path
      === tabsMenuList.value[tabsMenuList.value.length - 1].path
    )
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (error) {
    return false
  }
}

// refresh current page
// eslint-disable-next-line ts/no-unsafe-function-type
const refreshCurrentPage: Function = inject('refreshPage') as Function
function refreshTag() {
  setTimeout(() => {
    route.meta.isKeepAlive && keepAliveStore.removeKeepAliveName(route.fullPath as string)
    refreshCurrentPage(false)
    nextTick(() => {
      route.meta.isKeepAlive && keepAliveStore.addKeepAliveName(route.fullPath as string)
      refreshCurrentPage(true)
    })
  }, 0)
}

// Close Current
function closeCurrentTab() {
  tabStore.removeTabs(selectedTag.value.path as string, true)
}

// Close Other
function closeOtherTab() {
  tabStore.closeMultipleTab(selectedTag.value.path as string)
}

// Close Left
function closeLeftTab() {
  tabStore.closeTabsOnSide(selectedTag.value.path as string, 'left')
}

// Close Right
function closeRightTab() {
  tabStore.closeTabsOnSide(selectedTag.value.path as string, 'right')
}

// Close All
function closeAllTab() {
  tabStore.closeMultipleTab()
  router.push(HOME_URL)
}

onMounted(() => {
  tabsDrop()
  initTabs()
})
</script>

<template>
  <div class="tabs-box">
    <div class="tabs-menu">
      <ElTabs
        v-model="tabsMenuValue"
        type="card"
        @tab-click="tabClick"
        @tab-remove="tabRemove"
        @contextmenu.prevent="openContextMenu($event)"
      >
        <ElTabPane
          v-for="item in tabsMenuList"
          :key="item.path"
          :label="item.title"
          :name="item.path"
          :closable="item.close"
        >
          <template #label>
            <ReIcon v-if="item.icon && tabsIcon" :icon="item.icon" class="tabs-icon" />
            {{ item.title }}
          </template>
        </ElTabPane>
      </ElTabs>
      <!-- 右键菜单按钮 -->
      <transition name="el-zoom-in-top">
        <ul
          v-show="contextMenuVisible"
          ref="contextMenuRef"
          :key="Math.random()"
          class="contextmenu"
          :style="{ left: `${buttonLeft}px`, top: `${buttonTop}px` }"
        >
          <li @click="refreshTag">
            <ReIcon icon="svg-icon:refresh" class="tabs-icon" />
            重新加载
          </li>
          <li v-if="!isAffix(selectedTag)" @click="closeCurrentTab">
            <ReIcon icon="svg-icon:close" class="tabs-icon" />
            关闭当前标签页
          </li>
          <li @click="closeOtherTab">
            <ReIcon icon="svg-icon:close_other" class="tabs-icon" />
            关闭其他标签页
          </li>
          <li v-if="!isFirstView()" @click="closeLeftTab">
            <ReIcon icon="svg-icon:close_left" class="tabs-icon" />
            关闭左侧标签页
          </li>
          <li v-if="!isLastView()" @click="closeRightTab">
            <ReIcon icon="svg-icon:close_right" class="tabs-icon" />
            关闭右侧标签页
          </li>
          <li @click="closeAllTab">
            <ReIcon icon="svg-icon:close_all" class="tabs-icon" />
            关闭所有标签页
          </li>
        </ul>
      </transition>
      <MoreButton />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
