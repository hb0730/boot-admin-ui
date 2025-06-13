<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  size: {
    type: [Number, String],
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
})

const isLocal = computed(() => props.icon?.startsWith('svg-icon:'))
// 是否使用在线图标
const isUseOnline = computed(() => props.icon?.startsWith('iconify-'))

const svgClass = computed(() => {
  return props.icon.replace('svg-icon:', '')
})

const onlineClass = computed(() => {
  return props.icon.replace('iconify-', '')
})

const getIconifyStyle = computed(() => {
  let s = `${props.size}`
  s = `${s.replace('px', '')}px`

  return {
    fontSize: s,
    color: props.color,
  }
})
</script>

<template>
  <ElIcon :size="size" :color="color">
    <Icon v-if="isUseOnline" :icon="onlineClass" :style="getIconifyStyle" />
    <SvgIcon v-else-if="isLocal" :icon-class="svgClass" :size="size" :color="color" />
    <span v-else :class="`${icon} iconify`" :style="getIconifyStyle" />
  </ElIcon>
</template>
