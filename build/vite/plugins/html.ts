import { createHtmlPlugin } from 'vite-plugin-html'

export function configHtmlPlugin(env: ViteEnv) {
  const htmlPlugin = createHtmlPlugin({
    minify: true,
    inject: {
      data: {
        title: env.VITE_APP_TITLE,
      },
    },
  })
  return htmlPlugin
}
