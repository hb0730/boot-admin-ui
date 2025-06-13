import path from 'node:path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import svgLoader from 'vite-svg-loader'
// 配置svg图标插件
// vite-plugin-svg-icons 用于将svg文件转换为svg sprite https://github.com/vbenjs/vite-plugin-svg-icons
// vite-svg-loader 用于加载svg文件，支持url、raw、component等模式，https://github.com/jpkleemans/vite-svg-loader
export function configSvgPlugin(dirname: string) {
  const svgPlugin = createSvgIconsPlugin({
    // 指定需要缓存的图标文件夹
    iconDirs: [path.resolve(dirname, 'src/assets/svgs')],
    // 压缩配置
    // svgoOptions: false,
    // 指定symbolId格式
    symbolId: 'icon-[dir]-[name]',
  })
  const svgLoaderPlugin = svgLoader()
  return [svgPlugin, svgLoaderPlugin]
}
