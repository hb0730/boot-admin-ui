import type { App } from 'vue'

import VueTippy from 'vue-tippy'
import directivesList from '@/directives'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light.css'

/**
 *  @description 注册全局指令
 * @param app
 */
export function setupDirectives(app: App) {
  // 注册vue-tippy 指令
  app.use(VueTippy)
  // 注册自定义指令
  Object.keys(directivesList).forEach((key) => {
    app.directive(key, directivesList[key])
  })
}
