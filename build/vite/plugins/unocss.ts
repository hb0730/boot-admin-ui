import type { Plugin } from 'vite'
import UnoCSS from 'unocss/vite'

export function configUnoCssPlugin(): Plugin | Plugin[] {
  return UnoCSS()
}
