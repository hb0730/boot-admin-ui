<script setup lang="ts">
import type { AttachmentSelectProps } from './types'
import type { AttachmentList } from '@/api/modules/system/attachment/types'
import SelectBox from './SelectBox.vue'

const prop = withDefaults(defineProps<AttachmentSelectProps>(), {})
const emits = defineEmits(['update:modelValue'])
const modelValue = ref(prop.modelValue)
const dialogVisible = ref(false)

function handleOpenDialog() {
  dialogVisible.value = true
}
function handleConfirm(data: AttachmentList.ResPage[]) {
  dialogVisible.value = false
  // 将link已，拼接成字符串
  modelValue.value = data.map(item => item.permalink).join(',')
  emits('update:modelValue', modelValue.value)
}

watch(() => prop.modelValue, (val) => {
  modelValue.value = val
})

watch(modelValue, (val) => {
  emits('update:modelValue', val)
})
</script>

<template>
  <div relative w-full inline-flex items-center>
    <el-input
      v-model="modelValue"
      :placeholder="prop.placeholder"
      :readonly="readonly"
      :clearable="prop.clearable"
    >
      <template #append>
        <div flex items-center pl-5 pr-5 @click="handleOpenDialog">
          <ReIcon h-full w-full :size="20" icon="i-ep:folder" class="el-icon" />
        </div>
      </template>
    </el-input>
  </div>
  <SelectBox v-model:visible="dialogVisible" @confirm="handleConfirm" />
</template>

<style lang="scss" scoped>
:deep(.el-input-group__append) {
  background-color: inherit;
  cursor: pointer;
  padding: 0;
  &:hover {
    background-color: var(--el-fill-color-light);
  }
}
</style>
