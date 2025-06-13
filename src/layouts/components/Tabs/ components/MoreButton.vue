<script setup lang="ts">
import { HOME_URL } from '@/config'
import { useKeepAliveStore, useTabsStore } from '@/store'
// import { useGlobalStore } from '@/store'

const route = useRoute()
const router = useRouter()
const tabStore = useTabsStore()
// const globalStore = useGlobalStore()
const keepAliveStore = useKeepAliveStore()

// refresh current page
// eslint-disable-next-line ts/no-unsafe-function-type
const refreshCurrentPage: Function = inject('refreshPage') as Function
function refresh() {
  setTimeout(() => {
    route.meta.isKeepAlive && keepAliveStore.removeKeepAliveName(route.fullPath as string)
    refreshCurrentPage(false)
    nextTick(() => {
      route.meta.isKeepAlive && keepAliveStore.addKeepAliveName(route.fullPath as string)
      refreshCurrentPage(true)
    })
  }, 0)
}

// maximize current page
// function maximize() {
//   globalStore.setGlobalState('maximize', true)
// }

// Close Current
function closeCurrentTab() {
  if (route.meta.isAffix)
    return
  tabStore.removeTabs(route.fullPath)
}

// Close All
function closeAllTab() {
  tabStore.closeMultipleTab()
  router.push(HOME_URL)
}
</script>

<template>
  <ElDropdown trigger="click" :teleported="false">
    <div class="more-button">
      <ReIcon class="more-icon" icon="i-ep:arrow-down-bold" />
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem @click="refresh">
          <ReIcon icon="svg-icon:refresh" class="action-icon" />重新加载
        </ElDropdownItem>
        <!-- <el-dropdown-item @click="maximize">
          <ReIcon icon="svg-icon:fullscreen" class="action-icon" /> 最大化
        </el-dropdown-item> -->
        <ElDropdownItem divided @click="closeCurrentTab">
          <ReIcon icon="svg-icon:close" class="action-icon" /> 关闭当前标签页
        </ElDropdownItem>
        <ElDropdownItem @click="tabStore.closeTabsOnSide(route.fullPath, 'left')">
          <ReIcon icon="svg-icon:close_left" class="action-icon" /> 关闭左侧标签页
        </ElDropdownItem>
        <ElDropdownItem @click="tabStore.closeTabsOnSide(route.fullPath, 'right')">
          <ReIcon icon="svg-icon:close_right" class="action-icon" /> 关闭右侧标签页
        </ElDropdownItem>
        <ElDropdownItem divided @click="tabStore.closeMultipleTab(route.fullPath)">
          <ReIcon icon="svg-icon:close_other" class="action-icon" /> 关闭其他标签页
        </ElDropdownItem>
        <ElDropdownItem @click="closeAllTab">
          <ReIcon icon="svg-icon:close_all" class="action-icon" /> 关闭全部标签页
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<style scoped lang="scss">
@use '../index.scss';
</style>
