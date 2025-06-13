import type { ActionBarButtonsRow, PageInfo, PlusColumn, PlusPageInstance } from 'plus-pro-components'
import { resolveDirective } from 'vue'
import { clone } from '@/utils'
import * as dictItemApi from '/src/api/modules/system/dictItem'

export function useDictItems() {
  const currentDict = ref<any>({})
  const auth = resolveDirective('auth')
  const title = computed(() => `${currentDict.value.dictName} - 字典项`)
  const plusPageRef = ref<PlusPageInstance | null>()
  const dialogLoading = ref(false)
  const formModel = ref<any>({
    extraParams: {},
  })
  const formVisible = ref(false)
  const formRules = {
    itemText: [{ required: true, message: '请输入字典项名称', trigger: 'blur' }],
    itemValue: [{ required: true, message: '请输入字典项值', trigger: 'blur' }],
  }
  const tableColumns: PlusColumn[] = [
    {
      label: '字典项名称',
      prop: 'itemText',
      hideInSearch: false,
      formItemProps: {
        labelWidth: '100px',
      },
    },
    {
      label: '字典项值',
      prop: 'itemValue',
      hideInSearch: false,
    },
    {
      prop: 'extraParams',
      hasLabel: false,
      hideInSearch: true,
      label: '扩展参数',
    },
    {
      label: '排序',
      prop: 'sort',
      hideInSearch: true,
      valueType: 'input-number',
      fieldProps: {
        min: 1,
        controlsPosition: 'right',
      },
    },
    {
      label: '描述',
      prop: 'description',
      hideInSearch: true,
      valueType: 'textarea',
    },
  ]

  const tableActionButtons: ActionBarButtonsRow[] = [
    {
      text: '编辑',
      props: {
        type: 'primary',
        underline: 'never',
      },
      directives: [
        [auth, 'sys:dict:item:edit'],
      ],
      onClick: ({ row }) => {
        formModel.value = clone(row)
        if (!row.extraParams) {
          formModel.value.extraParams = {}
        }
        formVisible.value = true
      },
    },
    {
      text: '删除',
      props: {
        type: 'primary',
        underline: 'never',
      },
      directives: [
        [auth, 'sys:dict:item:delete'],
      ],
      confirm: {
        title: '删除提示',
        message: '确定删除该数据吗？',
      },
      onConfirm: async ({ row }) => {
        const { success } = await dictItemApi.del(row.id)
        if (success) {
          ElMessage.success('删除成功')
          plusPageRef.value?.getList()
        }
      },
    },
  ]

  const keyExtraSchemas = computed(() => {
    return currentDict.value.extraParams
  })

  function addNew() {
    formModel.value = {
      sort: 1,
      status: true,
      extraParams: {},
    }
    formVisible.value = true
  }

  async function formSave() {
    dialogLoading.value = true
    const { success } = formModel.value.id ? await _update() : await _save()
    dialogLoading.value = false
    if (success) {
      ElMessage.success('保存成功')
      formVisible.value = false
      plusPageRef.value?.getList()
    }
  }

  async function _save() {
    const body = {
      ...formModel.value,
      dictId: currentDict.value.id,
    }
    return dictItemApi.save(body)
  }

  async function _update() {
    const body = {
      ...formModel.value,
      dictId: currentDict.value.id,
    }
    return dictItemApi.update(formModel.value.id, body)
  }

  async function onLoad(query: PageInfo & any) {
    const params = clone(query, true)
    Reflect.set(params, 'current', Reflect.get(query, 'page'))
    Reflect.deleteProperty(params, 'page')
    Reflect.set(params, 'size', Reflect.get(query, 'pageSize'))
    Reflect.deleteProperty(params, 'pageSize')
    params.dictId = currentDict.value.id
    params.sorts = 'sort asc,created desc'

    const { success, data } = await dictItemApi.page(params)
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

  return {
    plusPageRef,
    currentDict,
    title,
    dialogLoading,
    formModel,
    formVisible,
    formRules,
    tableColumns,
    tableActionButtons,
    keyExtraSchemas,
    addNew,
    onLoad,
    formSave,
  }
}
