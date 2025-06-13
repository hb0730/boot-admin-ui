import type { CSSOptions } from 'vite'

// 创建Vite CSS配置
export function createViteCSS(): CSSOptions {
  const options = {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/styles/var/index.scss" as *;',
        api:"modern-compiler"
      },
    },
  }
  return options
}
