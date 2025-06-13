import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { configAutoImportPlugin } from './auto-import'
import { configCompressPlugin } from './compromise'
import { configHtmlPlugin } from './html'
import { configImageminPlugin } from './imagemin'
import { configRemoveConsolePlugin } from './remove-consloe'
import { configSvgPlugin } from './svg'
import { configUnoCssPlugin } from './unocss'

export function createVitePlugins(env: ViteEnv, dirname: string): PluginOption[] {
  const vitePlugins: PluginOption[] = []
  vitePlugins.push(
    vue(),
    vueJsx(), // 如果需要
  )

  // unocss
  vitePlugins.push(configUnoCssPlugin())
  // 图片压缩
  vitePlugins.push(configImageminPlugin())
  // 用于打包和输出gzip
  vitePlugins.push(configCompressPlugin('gzip', true))
  // 移除consloe
  vitePlugins.push(configRemoveConsolePlugin())
  // 自动导入
  vitePlugins.push(configAutoImportPlugin(dirname))
  // svg图标
  vitePlugins.push(configSvgPlugin(dirname))
  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin(env))

  return vitePlugins
}
