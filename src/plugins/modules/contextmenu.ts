import type { App } from 'vue'
import Contextmenu from 'v-contextmenu'
import 'v-contextmenu/dist/themes/default.css'

/**
 * @description 注册右键菜单
 * @param app {App}
 */
export function setupContextmenu(app: App<Element>) {
  app.use(Contextmenu)
}
