<script setup lang="ts">
import type { Size } from '@/utils/enums'
import { useGlobalStore } from '@/store'

const globalStore = useGlobalStore()
const assemblySize = computed(() => globalStore.size)

const assemblySizeList = [
  { label: '默认', value: 'default' },
  { label: '大型', value: 'large' },
  { label: '小型', value: 'small' },
]

function setAssemblySize(item: Size) {
  if (assemblySize.value === item)
    return
  globalStore.setGlobalState('size', item)
}
</script>

<template>
  <el-dropdown trigger="click" @command="setAssemblySize">
    <ReIcon icon="svg-icon:size" class="toolBar-icon" size="16" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in assemblySizeList"
          :key="item.value"
          :command="item.value"
          :disabled="assemblySize === item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
