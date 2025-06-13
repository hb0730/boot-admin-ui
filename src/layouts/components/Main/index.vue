<script setup lang="ts">
import type { Component } from 'vue'
import { useGlobalStore, useKeepAliveStore } from '@/store'

const globalStore = useGlobalStore()
const keepAliveStore = useKeepAliveStore()

const { maximize, isCollapse, layout, tabs, footer } = storeToRefs(globalStore)
const { keepAliveName } = storeToRefs(keepAliveStore)

// 注入刷新页面方法
const isRouterShow = ref(true)
const refreshCurrentPage = (val: boolean) => (isRouterShow.value = val)
provide('refreshPage', refreshCurrentPage)

// 解决详情页 keep-alive 问题
const wrapperMap = new Map()
function createComponentWrapper(component: Component, route: any) {
  if (!component)
    return
  const wrapperName = route.fullPath
  let wrapper = wrapperMap.get(wrapperName)
  if (!wrapper) {
    wrapper = { name: wrapperName, render: () => h(component) }
    wrapperMap.set(wrapperName, wrapper)
  }
  return h(wrapper)
}

// 监听当前页面是否最大化，动态添加 class
watch(
  () => maximize.value,
  () => {
    const app = document.getElementById('app') as HTMLElement
    if (maximize.value)
      app.classList.add('main-maximize')
    else app.classList.remove('main-maximize')
  },
  { immediate: true },
)

// 监听布局变化，在 body 上添加相对应的 layout class
watch(
  () => layout.value,
  () => {
    const body = document.body as HTMLElement
    body.setAttribute('class', layout.value)
  },
  { immediate: true },
)

// 监听窗口大小变化，折叠侧边栏
const screenWidth = ref(0)
const listeningWindow = useDebounceFn(() => {
  screenWidth.value = document.body.clientWidth
  if (!isCollapse.value && screenWidth.value < 1200)
    globalStore.setGlobalState('isCollapse', true)
  if (isCollapse.value && screenWidth.value > 1200)
    globalStore.setGlobalState('isCollapse', false)
}, 100)
window.addEventListener('resize', listeningWindow, false)
onBeforeUnmount(() => {
  window.removeEventListener('resize', listeningWindow)
})
</script>

<template>
  <Maximize v-show="maximize" />
  <Tabs v-show="tabs" />
  <ElMain>
    <router-view v-slot="{ Component, route }">
      <transition appear name="fade-transform" mode="out-in">
        <keep-alive :include="keepAliveName">
          <component :is="createComponentWrapper(Component, route)" v-if="isRouterShow" :key="route.name" />
        </keep-alive>
      </transition>
    </router-view>
  </ElMain>
  <ElFooter v-show="footer">
    <Footer />
  </ElFooter>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
