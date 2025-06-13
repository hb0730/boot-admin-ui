<script setup lang="ts">
import logo from '@/assets/images/logo.png'
import { useAuthStore, useGlobalStore } from '@/store'

const title = import.meta.env.VITE_APP_TITLE ?? ''
const route = useRoute()
const authStore = useAuthStore()
const globalStore = useGlobalStore()

const isCollapse = computed(() => globalStore.isCollapse)
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string)
const accordion = computed(() => globalStore.isAccordion)
const menuList = authStore.showMenuListGet()
</script>

<template>
  <ElContainer class="layout">
    <ElHeader>
      <div class="header-lf mask-image">
        <div class="logo flx-center">
          <img class="logo-img" :src="logo" alt="logo">
          <span class="logo-text">{{ title }}</span>
        </div>
        <ToolBarLeft />
      </div>
      <div class="header-ri">
        <ToolBarRight />
      </div>
    </ElHeader>
    <ElContainer class="classic-content">
      <ElAside>
        <div class="aside-box" :style="{ width: isCollapse ? '65px' : '210px' }">
          <el-scrollbar>
            <ElMenu
              :router="false"
              :default-active="activeMenu"
              :collapse="isCollapse"
              :unique-opened="accordion"
              :collapse-transition="false"
            >
              <SubMenu :menu-list="menuList" />
            </ElMenu>
          </el-scrollbar>
        </div>
      </ElAside>
      <ElContainer class="classic-main">
        <Main />
      </ElContainer>
    </ElContainer>
  </ElContainer>
</template>

<style lang="scss" scoped>
@use './index.scss';
</style>
