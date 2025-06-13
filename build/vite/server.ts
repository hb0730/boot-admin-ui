import type { ServerOptions } from 'vite'

/**
 *  创建服务器配置
 * @returns .
 */
export function createViteServer(env: ViteEnv): ServerOptions {
  const server: ServerOptions = {
    // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
    host: '0.0.0.0',
    // 服务器端口号
    port:env.VITE_PORT,
    // 端口已被占用时是否尝试使用下一个可用的端口 true：直接退出，而不是尝试下一个可用端口 false：尝试下一个可用端口
    strictPort: false,
    // 是否自动在浏览器打开
    open: true,
    // boolean | CorsOptions  为开发服务器配置 CORS。默认启用并允许任何源，传递一个 选项对象 来调整行为或设为 false 表示禁用。
    // cors: true,
    // 设置为 true 强制使依赖预构建。
    // force: false,
    // 自定义代理规则
    proxy: {
      // '/api': {
      //   target: 'http://jsonplaceholder.typicode.com',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, '')
      // }
    },

  }
  return server
}
