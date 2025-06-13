<script setup lang="ts">
import { HOME_URL } from '@/config'
import { useAuthStore, useGlobalStore } from '@/store'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const globalStore = useGlobalStore()

const breadcrumbList = computed(() => {
  const breadcrumbData = authStore.breadcrumbListGet()[route.matched[route.matched.length - 1].path] ?? []
  if (breadcrumbData[0].path !== HOME_URL) {
    breadcrumbData.unshift({ path: HOME_URL, meta: { icon: 'i-ep:home-filled', title: '首页' } })
  }
  return breadcrumbData
})

// Click Breadcrumb
function onBreadcrumbClick(item: Menu.MenuOptions, index: number) {
  if (index !== breadcrumbList.value.length - 1)
    router.push(item.path)
}
</script>

<template>
  <div class="breadcrumb-box mask-image" :class="[!globalStore.breadcrumbIcon && 'no-icon']">
    <ElBreadcrumb>
      <transition-group name="breadcrumb">
        <ElBreadcrumbItem v-for="(item, index) in breadcrumbList" :key="item.path">
          <div
            class="el-breadcrumb__inner is-link"
            :class="{ 'item-no-icon': !item.meta.icon }"
            @click="onBreadcrumbClick(item, index)"
          >
            <ReIcon v-if="item.meta.icon && globalStore.breadcrumbIcon" :icon="item.meta.icon" class="breadcrumb-icon" />
            <span class="breadcrumb-title">{{ item.meta?.title ?? '' }}</span>
          </div>
        </ElBreadcrumbItem>
      </transition-group>
    </ElBreadcrumb>
  </div>
</template>

<style scoped lang="scss">
.breadcrumb-box {
  display: flex;
  align-items: center;
  overflow: hidden;
  .el-breadcrumb {
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    text-align: center;
    .el-breadcrumb__item {
      position: relative;
      display: inline-flex;
      align-items: center;
      float: none;
      .item-no-icon {
        transform: translateY(-3px);
      }
      .el-breadcrumb__inner {
        display: inline-flex;
        align-items: center;
        text-align: center;
        &.is-link {
          color: var(--el-header-text-color);
          &:hover {
            color: var(--el-color-primary);
          }
        }
        .breadcrumb-icon {
          margin-top: 1px;
          margin-right: 6px;
          font-size: 18px;
        }
        .breadcrumb-title {
          margin-top: 2px;
          font-size: var(--el-menu-item-font-size);
        }
      }
      &:last-child .el-breadcrumb__inner,
      &:last-child .el-breadcrumb__inner:hover {
        color: var(--el-header-text-color-regular);
      }
      :deep(.el-breadcrumb__separator) {
        transform: translateY(-1px);
      }
    }
  }
}
.no-icon {
  .el-breadcrumb {
    .el-breadcrumb__item {
      top: -2px;
      :deep(.el-breadcrumb__separator) {
        top: 4px;
      }
      .item-no-icon {
        transform: translateY(0);
      }
    }
  }
}
</style>
