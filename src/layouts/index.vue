<script setup lang="ts">
import type { LayoutMode } from '@/utils/enums'
import { useGlobalStore } from '@/store'
import LayoutClassic from './LayoutClassic/index.vue'
import LayoutColumns from './LayoutColumns/index.vue'
import LayoutTransverse from './LayoutTransverse/index.vue'
import LayoutVertical from './LayoutVertical/index.vue'

const globalStore = useGlobalStore()

const LayoutComponents: Record<LayoutMode, Component> = {
  classic: LayoutClassic,
  vertical: LayoutVertical,
  transverse: LayoutTransverse,
  columns: LayoutColumns,
}

const watermark = computed(() => globalStore.watermark)
const isDark = computed(() => globalStore.isDark)

const font = reactive({ color: 'rgba(0, 0, 0, .15)' })
watch(
  isDark,
  () => (font.color = isDark.value ? 'rgba(255, 255, 255, .15)' : 'rgba(0, 0, 0, .15)'),
  {
    immediate: true,
  },
)
</script>

<template>
  <ElWatermark id="watermark" :font="font" :content="watermark ? ['ZOOM'] : ''">
    <component :is="LayoutComponents[globalStore.layout]" />
    <ThemeDrawer />
  </ElWatermark>
</template>

<style scoped lang="scss">
.layout {
  min-width: 600px;
}
</style>
