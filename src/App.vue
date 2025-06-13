<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import plusZhCn from 'plus-pro-components/es/locale/lang/zh-cn'
import { useTheme } from './hooks/useTheme'
import { useGlobalStore } from './store'

const globalStore = useGlobalStore()

const zhCnLocales = {
  ...zhCn,
  ...plusZhCn,
}

// init theme
const { initTheme } = useTheme()
initTheme()

const size = computed(() => globalStore.size)

// element button config
const buttonConfig = reactive({ autoInsertSpace: false })
</script>

<template>
  <ElConfigProvider :size="size" :button="buttonConfig" :locale="zhCnLocales">
    <RouterView />
  </ElConfigProvider>
</template>

<style scoped>
</style>
