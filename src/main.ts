import { createApp } from 'vue'
import setupPlugins from '@/plugins'
import App from './App.vue'

// 公共样式
import '@/styles/main.scss'

const app = createApp(App)
// 注册全局插件

app.use(setupPlugins).mount('#app')
