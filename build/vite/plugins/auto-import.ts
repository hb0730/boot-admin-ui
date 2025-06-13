import path from 'node:path'
import { PlusProComponentsResolver } from '@plus-pro-components/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
// 自动导入

export function configAutoImportPlugin(dirname: string) {
  const autoImport = AutoImport({
    // 指定自动导入的库
    imports: [
      'vue',
      'vue-router',
      'vue-i18n',
      'pinia',
      '@vueuse/core',
    ],
    resolvers: [
      // 按需导入 Element Plus
      ElementPlusResolver({
        importStyle: 'sass',
      }),
      // 按需导入 plus-pro-components
      PlusProComponentsResolver({}),
    ],
    // 在vue模板中自动导入
    vueTemplate: true,
    // 指定自动导入函数TS类型声明文件路径 (false:关闭自动生成)
    dts: path.resolve(dirname, 'types/auto-imports.d.ts'),
  })
  const autoimportComponents = Components({
    resolvers: [
      ElementPlusResolver({
        importStyle: 'sass',
      }),
      PlusProComponentsResolver({}),
    ],
    // 指定自定义组件位置(默认:src/components)
    dirs: ['src/**/components', 'src/components'],
    // 指定自动导入组件TS类型声明文件路径 (false:关闭自动生成)
    dts: path.resolve(dirname, 'types/components.d.ts'),

  })

  return [autoImport, autoimportComponents]
}
