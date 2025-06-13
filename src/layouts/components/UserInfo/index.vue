<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGlobalStore, useUserStore } from '@/store'
import AccessToken from './components/AccessToken/index.vue'
import AccountManagement from './components/AccountManagement.vue'
import MessageList from './components/MessageList/index.vue'
import OperatorLog from './components/OperatorLog/index.vue'
import Preferences from './components/Preferences.vue'
import Profile from './components/Profile.vue'

const { userInfo, activeUserInfoPanel, setActiveUserInfoPanel } = useUserStore()
// const { unreadCount } = useGlobalStore()
const globalStore = useGlobalStore()
const unreadCount = ref(globalStore.unreadCount)
const router = useRouter()
const panes = [
  {
    key: 'profile',
    label: '个人信息',
    icon: 'svg-icon:user',
    component: Profile,
  },
  {
    key: 'preferences',
    label: '偏好设置',
    icon: 'i-ep:setting',
    component: Preferences,
  },
  {
    key: 'accountManagement',
    label: '账户管理',
    icon: 'svg-icon:profile-line',
    component: AccountManagement,
  },
  {
    key: 'messageList',
    label: '我的消息',
    icon: 'svg-icon:message',
    component: MessageList,
  },
  {
    key: 'securityLog',
    label: '安全日志',
    icon: 'svg-icon:security-shield-fill',
    component: OperatorLog,
  },
  {
    key: 'accessToken',
    label: '个人令牌',
    icon: 'svg-icon:lock-access',
    component: AccessToken,
  },
]
const witchPane = ref('profile')

watchEffect(() => {
  setActiveUserInfoPanel(witchPane.value)
})

watchEffect(() => {
  witchPane.value = activeUserInfoPanel
})

watch(() => globalStore.unreadCount, (val) => {
  unreadCount.value = val
}, {
  immediate: true,
})
</script>

<template>
  <ElContainer class="h-full">
    <ElAside class="w-240px overflow-hidden border-r-[1px] px-2 dark:!bg-[var(--el-bg-color)]">
      <ElMenu :default-active="witchPane" class="aside-menu">
        <el-menu-item
          class="!h-[50px] hover:!text-base hover:!transition-all hover:!duration-200"
          index="back"
          @click="() => router.go(-1)"
        >
          <div class="flex items-center">
            <ReIcon icon="svg-icon:arrow-left" />
            <span class="ml-2">返回</span>
          </div>
        </el-menu-item>
        <div class="mb-4 ml-8 mt-4 flex items-center">
          <ElAvatar v-if="userInfo.avatar" :size="48" :src="userInfo.avatar" />
          <ElAvatar v-else :size="48" :style="{ backgroundColor: 'var(--el-color-primary)', userSelect: 'none' }">
            <span>{{ userInfo.nickname?.[0] }}</span>
          </ElAvatar>
          <div class="ml-4 max-w-[130px] flex flex-col">
            <span class="el-text is-truncated font-bold !self-baseline">{{ userInfo.nickname }}</span>
            <span class="el-text el-text--info is-truncated !self-baseline">{{ userInfo.username }}</span>
          </div>
        </div>
        <ElMenuItem
          v-for="item in panes"
          :key="item.key"
          :index="item.key"
          @click="witchPane = item.key"
        >
          <div class="z-10 flex items-center">
            <ReIcon :icon="item.icon" class="el-icon" />
            <span>{{ item.label }}</span>
            <el-badge v-if="item.key === 'messageList' && unreadCount > 0" :value="unreadCount" class="badge ml-2" />
          </div>
        </ElMenuItem>
      </ElMenu>
    </ElAside>
    <ElMain>
      <component :is="panes.find((item) => item.key === witchPane)?.component" />
    </ElMain>
  </ElContainer>
</template>

<style scoped lang="scss">
:deep(.el-aside) {
  background-color: var(--el-menu-bg-color);
  .aside-menu {
    background-color: transparent;
    border: none;
    transition: width 0.3s ease;
    .el-menu-item {
      color: var(--el-menu-text-color);
      height: 48px !important;
      background-color: transparent !important;
      transition: color 0.2s;

      &:hover {
        color: var(--el-menu-hover-text-color);
      }
      &.is-active {
        color: var(--el-menu-active-color) !important;
        background-color: var(--el-menu-active-bg-color) !important;
      }
    }
  }
}

.el-icon {
  margin-right: 5px;
  width: var(--el-menu-icon-width);
  text-align: center;
  font-size: 18px;
  vertical-align: middle;
}

.badge {
  display: inline-flex;
  :deep(sup) {
    top: 0;
  }
}
</style>
