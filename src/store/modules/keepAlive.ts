import { store } from '..'

export const useKeepAliveStore = defineStore(
  'app-keepAlive',
  () => {
    const keepAliveName = ref<string[]>([])
    // Add KeepAliveName
    async function addKeepAliveName(name: string) {
      !keepAliveName.value.includes(name) && keepAliveName.value.push(name)
    }

    // Remove KeepAliveName
    async function removeKeepAliveName(name: string) {
      keepAliveName.value = keepAliveName.value.filter(item => item !== name)
    }

    // Set KeepAliveName
    async function setKeepAliveName(data: string[] = []) {
      keepAliveName.value = data
    }

    return {
      keepAliveName,
      addKeepAliveName,
      removeKeepAliveName,
      setKeepAliveName,
    }
  },
)

export function keepAliveStoreHook() {
  return useKeepAliveStore(store)
}
