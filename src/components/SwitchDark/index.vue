<script setup lang="ts">
import { useTheme } from '@/hooks/useTheme'
import { useGlobalStore } from '/src/store'

const globalStore = useGlobalStore()

const { switchDark } = useTheme()

function changeDark() {
  switchDark()
  globalStore.setGlobalState('colorMode', globalStore.isDark ? 'dark' : 'light')
}
</script>

<template>
  <ElSwitch v-model="globalStore.isDark" inline-prompt @change="changeDark">
    <template #active-action>
      <ReIcon icon="svg-icon:moon" class="el-icon" />
    </template>
    <template #inactive-action>
      <ReIcon icon="svg-icon:sunny" class="el-icon" />
    </template>
  </ElSwitch>
</template>
