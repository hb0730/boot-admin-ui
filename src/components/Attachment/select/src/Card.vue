<script setup lang="ts">
import type { AttachmentList } from '@/api/modules/system/attachment/types'

const props = defineProps({
  data: {
    type: Object as PropType<AttachmentList.ResPage>,
    required: true,
  },
  selected: {
    type: Boolean,
    required: false,
    default: false,
  },
  canSelect: {
    type: Boolean,
    required: false,
    default: true,
  },
})
const emits = defineEmits(['select'])
const loaded = ref(false)
function handleSelect() {
  emits('select', props.data)
}
</script>

<template>
  <div
    class="card-wrapper hover:shadow"
    :class="[
      !canSelect && !selected ? 'pointer-events-none !cursor-not-allowed opacity-50' : '',
      selected ? 'ring-1 ring-primary' : '',
    ]"
  >
    <div class="card-body !p-0">
      <div class="group relative bg-white">
        <div class="aspect-h-8 aspect-w-10 block h-full w-full cursor-pointer overflow-hidden bg-gray-100" @click="handleSelect">
          <img
            class="pointer-events-none transform-gpu object-cover group-hover:opacity-75"
            :src="data.permalink" :alt="data.displayName"
            @load="() => $nextTick(() => loaded = true)"
          >
          <!-- image 加载中 -->
          <div v-if="!loaded" class="h-full flex items-center justify-center object-cover">
            <span class="text-xs text-gray-400">加载中....</span>
          </div>
        </div>
        <p class="pointer-events-none block truncate px-2 py-1 text-center text-xs text-gray-700 font-medium">
          {{ data.displayName }}
        </p>
        <div :class="selected ? '!flex' : ''" class="absolute left-0 top-0 hidden h-1/3 w-full justify-end from-gray-300 to-transparent bg-gradient-to-b ease-in-out group-hover:flex">
          <span hover:color="$el-color-primary" class="i-ep:view iconify hover:text-primary mr-1 mt-1 hidden h-6 w-6 cursor-pointer text-white transition-all group-hover:block" />
          <span
            :color="selected ? '$el-color-primary' : 'white'"
            hover:color="$el-color-primary"
            class="i-ep:circle-check iconify hover:text-primary mr-1 mt-1 h-6 w-6 cursor-pointer text-white transition-all"
            @click.stop="handleSelect"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card-wrapper {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .card-body {
    border-radius: 0.5rem;
    overflow: hidden;
  }
  .aspect-w-10 {
    position: relative;
    padding-bottom: 100%;
  }
  .aspect-w-10 > * {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .pointer-events-none {
    pointer-events: none;
  }
}
</style>
