import type { ConfigEnv, UserConfig } from 'vite'
import { resolve } from 'node:path'
import dayjs from 'dayjs'
import { defineConfig, loadEnv } from 'vite'
import { createViteBuild } from './build/vite/build'
import { createViteCSS } from './build/vite/css'
import { createVitePlugins } from './build/vite/plugins/index'
import { createViteServer } from './build/vite/server'
import { wrapperEnv } from './build/vite/utils'
import pkg from './package.json'

const { dependencies, devDependencies, name, version } = pkg
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const viteEnv = wrapperEnv(env)

  return {
    root,
    base: viteEnv.VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '#': resolve(__dirname, 'types'),
      },
    },
    // 服务配置
    server: createViteServer(viteEnv),
    // 插件配置
    plugins: createVitePlugins(viteEnv, __dirname),
    // css配置
    css: createViteCSS(),
    // esbuild配置
    // esbuild: {},
    // build配置
    build: createViteBuild(viteEnv),
    // 优化配置
    // optimizeDeps: {},
    // 环境变量配置
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },

  }
})
