import type { PageInfo, PlusColumn } from 'plus-pro-components'
import * as operatorLogApi from '@/api/modules/system/operatorLog'
import { useDictStore } from '@/store'
import { clone } from '@/utils'
import { ElTag } from 'element-plus'
import { dictKeys, operatorModuleDictKey, operatorResultDictKey, operatorRiskDictKey, operatorTypeDictKey } from './const'

export function useOperatorLog() {
  const { loadDict, getDict, toOptions } = useDictStore()

  const tableColumns: PlusColumn[] = [
    {
      label: '操作模块',
      prop: 'module',
      valueType: 'select',
      options: computed(() => toOptions(operatorModuleDictKey)),
      render: (value, { row }) => {
        const moduleItem = getDict(operatorModuleDictKey, value)
        const typeItem = getDict(operatorTypeDictKey, row.type)
        return `${moduleItem.label} - ${typeItem.label}`
      },
    },
    {
      label: '风险等级',
      prop: 'riskLevel',
      valueType: 'select',
      options: computed(() => toOptions(operatorRiskDictKey)),
      render: (value) => {
        const item = getDict(operatorRiskDictKey, value)
        return h(ElTag, { type: item.color }, () => item.label)
      },
    },
    {
      label: '执行结果',
      prop: 'result',
      valueType: 'select',
      options: computed(() => toOptions(operatorResultDictKey)),
      render: (value) => {
        const item = getDict(operatorResultDictKey, value)
        return h(ElTag, { type: item.color }, () => item.label)
      },
    },
    {
      label: '操作日志',
      prop: 'logInfo',
      hideInSearch: true,
    },
    {
      label: '留痕地址',
      prop: 'url',
      render: (_, { row }) => {
        // h渲染， 两个span标签
        const { address, location } = row
        return h('div', {
          class: 'flex items-center overflow-hidden whitespace-nowrap overflow-ellipsis',
        }, [
          h('span', {}, location),
          h('span', {
            class: 'text-gray-400 ml-2 truncate cursor-pointer hover:underline',
            // 双击复制
            onDblclick: () => {
              copy(address)
              ElMessage.success('复制成功')
            },
          }, address),
        ])
      },
      hideInSearch: true,
    },
    {
      label: '操作时间',
      prop: 'startTime',
      hideInSearch: true,
    },
    {
      label: '执行时间',
      prop: 'executeTime',
      valueType: 'plus-date-picker',
      hideInTable: true,
      fieldProps: {
        valueFormat: 'YYYY-MM-DD',
        type: 'date',
      },
    },
  ]

  function copy(data: string) {
    navigator.clipboard.writeText(data)
  }

  async function onLoad(query: PageInfo & any) {
    const params = clone(query, true)
    Reflect.set(params, 'current', Reflect.get(query, 'page'))
    Reflect.deleteProperty(params, 'page')
    Reflect.set(params, 'size', Reflect.get(query, 'pageSize'))
    Reflect.deleteProperty(params, 'pageSize')
    params.sorts = 'created desc'

    const { success, data } = await operatorLogApi.currentPage(params)
    if (success) {
      return {
        data: data.records,
        total: data.total,
      }
    }
    return {
      data: [],
      total: 0,
    }
  }

  onBeforeMount(() => {
    loadDict(dictKeys)
  })

  return {
    tableColumns,
    onLoad,
  }
}
