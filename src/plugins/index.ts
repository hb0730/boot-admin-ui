import type { App } from 'vue'
import { MotionPlugin } from '@vueuse/motion'
import router from '@/router'
import { setupStore } from '@/store'
import { setupContextmenu } from './modules/contextmenu'
import { setupDirectives } from './modules/directives'

// 其他引用
import './modules/element-plus'
import './modules/svg'
import './modules/unocss'

export default {
  install(app: App<Element>) {
    // 注册指令
    setupDirectives(app)
    // 注册右键菜单
    setupContextmenu(app)
    // 注册动画
    app.use(MotionPlugin)

    // 注册状态管理
    setupStore(app)
    // router
    app.use(router)
  },
}
