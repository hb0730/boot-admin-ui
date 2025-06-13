<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed } from 'vue'

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  iconClass: {
    type: String,
    required: false,
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
  size: {
    type: [Number, String],
    default: 16,
  },
})

const symbolId = computed(() => `#${props.prefix}-${props.iconClass}`)

const getStyle = computed((): CSSProperties => {
  const { size } = props
  let s = `${size}`
  s = `${s.replace('px', '')}px`
  return {
    width: s,
    height: s,
  }
})
</script>

<template>
  <svg
    aria-hidden="true"
    class="svg-icon"
    :style="getStyle"
  >
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<style scoped>
.svg-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  overflow: hidden;
  vertical-align: -0.15em; /* 因icon大小被设置为和字体大小一致，而span等标签的下边缘会和字体的基线对齐，故需设置一个往下的偏移比例，来纠正视觉上的未对齐效果 */
  outline: none;
  fill: currentcolor; /* 定义元素的颜色，currentColor是一个变量，这个变量的值就表示当前元素的color值，如果当前元素未设置color值，则从父元素继承 */
}
</style>
