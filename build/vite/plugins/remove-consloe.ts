import removeConsole from 'vite-plugin-remove-console'

// 生成环境移除 console.log
// https://github.com/xiaoxian521/vite-plugin-remove-console
export function configRemoveConsolePlugin() {
  return removeConsole()
}
