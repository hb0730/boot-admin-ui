import type { PersistenceOptions } from 'pinia-plugin-persistedstate'

/**
 * @description pinia 持久化参数配置
 * @param {string} key 存储到持久化的 name
 * @return persist
 */
function piniaPersistConfig(key: string) {
  const persist: PersistenceOptions = {
    key,
    storage: localStorage,
  }
  return persist
}

export default piniaPersistConfig
