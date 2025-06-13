import type { DictOptions, DictState } from './types'
import { loadDictItem } from '@/api/modules/system/dict'
import { store } from '../..'

export const useDictStore = defineStore(
  'dict',
  () => {
    const state = ref<DictState>({})
    // 加载字典值
    async function loadDict(keys: string[]) {
      // 检测是否已经加载过
      const keysToLoad = keys.filter(key => !state.value[key])
      if (!keysToLoad.length)
        return
      // 加载字典值
      keysToLoad.forEach(async (key) => {
        const { data } = await loadDictItem(key)
        state.value[key] = data.map((item) => {
          return {
            ...item,
            ...item.attrs,
          }
        })
      })
    }

    // 获取字典值
    function toOptions(key: string): DictOptions[] {
      return state.value[key] || []
    }

    // 获取字典项值
    function getDictValue(dict: string, value: any, key = 'label', defaultValue = value) {
      const dictData = toOptions(dict)
      if (!dictData)
        return defaultValue
      const item = dictData.find((item: any) => item.value === value)
      return item ? item[key] : defaultValue
    }

    // 获取字典值对象
    function getDict(key: string, value: any) {
      const dictData = toOptions(key)
      if (!dictData)
        return value
      const item = dictData.find((item: any) => item.value === value)
      return item || {
        value,
      } as DictOptions
    }

    return {
      state,
      toOptions,
      loadDict,
      getDict,
      getDictValue,
    }
  },
)

export function useDictStoreHook() {
  return useDictStore(store)
}
