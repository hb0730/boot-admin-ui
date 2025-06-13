import type { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(piniaPluginPersistedstate)

export function setupStore(app: App<Element>) {
  app.use(store)
}

export * from './modules/auth'
export * from './modules/dict'
export * from './modules/global'
export * from './modules/keepAlive'
export * from './modules/tabs'
export * from './modules/user'

export { store }
