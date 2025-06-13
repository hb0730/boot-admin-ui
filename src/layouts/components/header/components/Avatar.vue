<script setup lang="ts">
import * as authApi from '@/api/modules/auth'
import { LOGIN_URL } from '@/config'
import router from '@/router'
import { useUserStore } from '@/store'

const userStore = useUserStore()

const avatar = computed(() => userStore.userInfo.avatar)
const nickname = computed(() => userStore.userInfo.nickname)

const avatarsStyle = computed(() => {
  if (nickname.value) {
    return {
      marginRight: '10px',
    }
  }
  return ''
})

function logout() {
  ElMessageBox.confirm('您是否确认退出登录?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    // 1.执行退出登录接口
    await authApi.logout()
    // 2.执行退出登录后的操作
    await userStore.afterLogout()
    // 3.重定向到登陆页
    router.replace(LOGIN_URL)
    ElMessage.success('退出登录成功！')
  })
}

function handleUserInfo() {
  router.push('/userInfo')
}
</script>

<template>
  <ElDropdown trigger="click">
    <span class="el-dropdown-link navbar-bg-hover select-none">
      <template v-if="avatar">
        <img :src="avatar" :style="avatarsStyle">
        <p v-if="nickname" class="dark:text-white">{{ nickname }}</p>
      </template>
      <ElAvatar
        v-else
        :size="32"
        :style="{ cursor: 'pointer', backgroundColor: 'var(--el-color-primary)', userSelect: 'none' }"
      >
        <span> {{ nickname?.[0] }}</span>
      </ElAvatar>
    </span>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem @click="handleUserInfo">
          <ReIcon icon="svg-icon:user" class="icon" />
          个人中心
        </ElDropdownItem>
        <ElDropdownItem divided @click="logout">
          <ReIcon icon="svg-icon:shutdown" class="icon" />
          退出登录
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<style scoped lang="scss">
.el-dropdown-link {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 48px;
  padding: 10px;
  color: #000000d9;
  cursor: pointer;

  p {
    font-size: 14px;
  }

  img {
    width: 22px;
    height: 22px;
    border-radius: 50%;
  }
}
.icon {
  margin-right: 5px;
}
</style>
