import type { IconType } from './types'
import ReIcon from './index.vue'

/**
 * @description: 渲染图标
 * @param props
 * @returns
 */
export function useRenderIcon(props: IconType) {
  return h(ReIcon, props)
}
