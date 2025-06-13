<script setup lang="ts">
import { useGlobalStore } from '@/store'

const globalStore = useGlobalStore()
// const changeCollapse = () => globalStore.setGlobalState('isCollapse', !globalStore.isCollapse)
function changeCollapse(){
  globalStore.setGlobalState('isCollapse', !globalStore.isCollapse)
}
</script>

<template>
  <ReIcon
    class="collapse-icon"
    :icon="globalStore.isCollapse ? 'i-ep:expand' : 'i-ep:fold'"
    :size="22"
    @click.stop="changeCollapse"
  />
</template>

<style scoped lang="scss">
.collapse-icon {
  margin-right: 20px;
  font-size: 22px;
  color: var(--el-header-text-color);
  cursor: pointer;
}
</style>
