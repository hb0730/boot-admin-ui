<script setup lang="ts">
import logo from '@/assets/images/logo.png'
import { useAuthStore } from '@/store'

const title = import.meta.env.VITE_APP_TITLE ?? ''

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const menuList = computed(() => authStore.showMenuListGet())
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string)

function handleClickMenu(subItem: Menu.MenuOptions) {
  if (subItem.meta.isLink)
    return window.open(subItem.meta.isLink, '_blank')
  router.push(subItem.path)
}
</script>

<template>
  <el-container class="layout">
    <el-header>
      <div class="logo flx-center">
        <img class="logo-img" :src="logo" alt="logo">
        <span class="logo-text">{{ title }}</span>
      </div>
      <el-menu mode="horizontal" :router="false" :default-active="activeMenu">
        <!-- 不能直接使用 SubMenu 组件，无法触发 el-menu 隐藏省略功能 -->
        <template v-for="subItem in menuList" :key="subItem.path">
          <el-sub-menu v-if="subItem.children?.length" :key="subItem.path" :index="`${subItem.path}el-sub-menu`">
            <template #title>
              <ReIcon v-if="subItem.meta.icon" :icon="subItem.meta.icon" />
              <span class="sle">{{ subItem.meta.title }}</span>
            </template>
            <SubMenu :menu-list="subItem.children" />
          </el-sub-menu>
          <el-menu-item v-else :key="`${subItem.path}el-menu-item`" :index="subItem.path" @click="handleClickMenu(subItem)">
            <ReIcon v-if="subItem.meta.icon" :icon="subItem.meta.icon" />
            <template #title>
              <span>{{ subItem.meta.title }}</span>
            </template>
          </el-menu-item>
        </template>
      </el-menu>
      <ToolBarRight />
    </el-header>
    <Main />
  </el-container>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
