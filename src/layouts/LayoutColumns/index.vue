<script setup lang="ts">
import logo from '@/assets/images/logo.png'
import { useAuthStore, useGlobalStore } from '@/store'

const title = import.meta.env.VITE_APP_TITLE ?? ''

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const globalStore = useGlobalStore()
const accordion = computed(() => globalStore.isAccordion)
const isCollapse = computed(() => globalStore.isCollapse)
const menuList = computed(() => authStore.showMenuListGet())
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string)

const subMenuList = ref<Menu.MenuOptions[]>([])
const splitActive = ref('')
watch(
  () => [menuList, route],
  () => {
    // 当前菜单没有数据直接 return
    if (!menuList.value.length)
      return
    splitActive.value = route.path
    const menuItem = menuList.value.filter((item: Menu.MenuOptions) => {
      return route.path === item.path || `/${route.path.split('/')[1]}` === item.path
    })
    if (menuItem[0].children?.length)
      return (subMenuList.value = menuItem[0].children)
    subMenuList.value = []
  },
  {
    deep: true,
    immediate: true,
  },
)

// change SubMenu
function changeSubMenu(item: Menu.MenuOptions) {
  splitActive.value = item.path
  if (item.children?.length)
    return (subMenuList.value = item.children)
  subMenuList.value = []
  router.push(item.path)
}
</script>

<template>
  <el-container class="layout">
    <div class="aside-split">
      <div class="logo flx-center">
        <img class="logo-img" :src="logo" alt="logo">
      </div>
      <el-scrollbar>
        <div class="split-list">
          <div
            v-for="item in menuList"
            :key="item.path"
            class="split-item"
            :class="{ 'split-active': splitActive === item.path || `/${splitActive.split('/')[1]}` === item.path }"
            @click="changeSubMenu(item)"
          >
            <ReIcon v-if="item.meta.icon" :icon="item.meta.icon" class="el-icon" />
            <span class="title">{{ item.meta.title }}</span>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <el-aside :class="{ 'not-aside': !subMenuList.length }" :style="{ width: isCollapse ? '65px' : '210px' }">
      <div class="logo flx-center">
        <span v-show="subMenuList.length" class="logo-text">{{ isCollapse ? "G" : title }}</span>
      </div>
      <el-scrollbar>
        <el-menu
          :router="false"
          :default-active="activeMenu"
          :collapse="isCollapse"
          :unique-opened="accordion"
          :collapse-transition="false"
        >
          <SubMenu :menu-list="subMenuList" />
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-header>
        <ToolBarLeft />
        <ToolBarRight />
      </el-header>
      <Main />
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
