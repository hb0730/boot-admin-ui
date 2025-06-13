<script setup lang="ts">
import { useUserStore } from '@/store'
import RestEmail from './RestEmail.vue'
import RestPassword from './RestPassword.vue'
import Social from './Social/index.vue'

const { userInfo } = useUserStore()

const restPasswordVisible = ref(false)
const restEmailVisible = ref(false)

const list = ref([
  {
    key: 'password',
    title: '账户密码',
    illustrate: userInfo.username ? '已设置密码' : '未设置密码',
    button: '修改',
  },
  {
    key: 'phone',
    title: '密保手机',
    illustrate: userInfo.phone ? `已绑定手机：${userInfo.phone}` : '未绑定手机',
    button: '修改',
  },
  {
    key: 'email',
    title: '备用邮箱',
    illustrate: userInfo.email ? `已绑定邮箱：${userInfo.email}` : '未绑定邮箱',
    button: '修改',
  },
])

function handleClick(_: any, key?: string) {
  switch (key) {
    case 'password':
      handleUpdatePassword()
      break
    case 'phone':
      handleUpdatePhone()
      break
    case 'email':
      handleUpdateEmail()
      break
  }
}

function handleUpdatePassword() {
  restPasswordVisible.value = true
}

function handleUpdatePhone() {
}

function handleUpdateEmail() {
  restEmailVisible.value = true
}
</script>

<template>
  <div>
    <LayInfo title="账户管理">
      <div v-for="(item, index) in list" :key="index">
        <div class="flex items-center">
          <div class="flex-1">
            <p>{{ item.title }}</p>
            <el-text class="mx-1" type="info">
              {{ item.illustrate }}
            </el-text>
          </div>
          <el-button type="primary" text @click="handleClick(item, item.key)">
            {{ item.button }}
          </el-button>
        </div>
        <el-divider />
      </div>
      <RestPassword v-model:visible="restPasswordVisible" />
      <RestEmail v-model="restEmailVisible" />
    </LayInfo>
    <Social />
  </div>
</template>

<style lang="scss" scoped>
.el-divider--horizontal {
  border-top: 0.1px var(--el-border-color) var(--el-border-style);
}
</style>
