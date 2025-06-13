<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps<{ menuList: Menu.MenuOptions[] }>()

const router = useRouter()
function handleClickMenu(subItem: Menu.MenuOptions) {
  if (subItem.meta.isLink)
    return window.open(subItem.meta.isLink, '_blank')
  router.push(subItem.path)
}
</script>

<template>
  <template v-for="subItem in menuList" :key="subItem.path">
    <ElSubMenu v-if="subItem.children?.length" :index="subItem.path">
      <template #title>
        <ReIcon v-if="subItem.meta.icon" :icon="subItem.meta.icon" class="el-icon" />
        <span class="sle">{{ subItem.meta.title }}</span>
      </template>
      <SubMenu :menu-list="subItem.children" />
    </ElSubMenu>
    <ElMenuItem v-else :index="subItem.path" @click="handleClickMenu(subItem)">
      <ReIcon v-if="subItem.meta.icon" :icon="subItem.meta.icon" class="el-icon" />
      <template #title>
        <span class="sle">{{ subItem.meta.title }}</span>
      </template>
    </ElMenuItem>
  </template>
</template>

<style lang="scss">
.el-sub-menu .el-sub-menu__title:hover {
  color: var(--el-menu-hover-text-color) !important;
  background-color: transparent !important;
}
.el-menu--collapse {
  .is-active {
    .el-sub-menu__title {
      color: #ffffff !important;
      background-color: var(--el-color-primary) !important;
    }
  }
}
.el-menu-item {
  &:hover {
    color: var(--el-menu-hover-text-color);
  }
  &.is-active {
    color: var(--el-menu-active-color) !important;
    background-color: var(--el-menu-active-bg-color) !important;
    &::before {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 4px;
      content: '';
      background-color: var(--el-color-primary);
    }
  }
}
.vertical,
.classic,
.transverse {
  .el-menu-item {
    &.is-active {
      &::before {
        left: 0;
      }
    }
  }
}
.columns {
  .el-menu-item {
    &.is-active {
      &::before {
        right: 0;
      }
    }
  }
}
</style>
