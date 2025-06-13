import type { FormRules } from 'element-plus'
import type { ActionBarButtonsRow, PageInfo, PlusColumn, PlusDialogFormInstance, PlusPageInstance } from 'plus-pro-components'
import { ElTag } from 'element-plus'
import { resolveDirective } from 'vue'
import * as dictAPi from '@/api/modules/system/dict'
import { useDictStore } from '@/store'
import { dictKeys, dictStatus, dictValueTypeKey, innerKeys, ValueType } from './const'
import { clone } from '/src/utils'

export function useDict() {
  const {
    toOptions,
    getDict,
    loadDict,
  } = useDictStore()
  const auth = resolveDirective('auth')
  const plusPageRef = ref<PlusPageInstance | null>()
  const dialogFormRef = ref<PlusDialogFormInstance | null>()
  const searchModel = ref({})
  const tableColumns: PlusColumn[] = [
    {
      label: '关键字',
      prop: 'keyword',
      hideInTable: true,
      hideInForm: true,
      fieldProps: {
        placeholder: '支持字典名称，字典编码搜索',
      },
    },
    {
      label: '字典编码',
      prop: 'dictCode',
      hideInSearch: true,
    },
    {
      label: '字典名称',
      prop: 'dictName',
      hideInSearch: true,
    },
    {
      label: '字典类型',
      prop: 'dictType',
      hideInSearch: true,
      valueType: 'select',
      options: computed(() => {
        return toOptions(dictValueTypeKey)
      }),
      render: (val) => {
        const item = getDict(dictValueTypeKey, val)
        return h(ElTag, { type: item.type }, () => item.label)
      },
    },
    {
      label: '状态',
      prop: 'status',
      valueType: 'select',
      options: computed(() => {
        return toOptions(dictStatus)
      }),
      render: (val) => {
        const item = getDict(dictStatus, val)
        return h(ElTag, { type: item.type }, () => item.label)
      },
    },
    {
      label: '描述',
      prop: 'description',
      hideInSearch: true,
      valueType: 'textarea',
    },
  ]
  const formColumns: PlusColumn[] = [
    {
      label: '字典编码',
      prop: 'dictCode',
      hideInSearch: true,
    },
    {
      label: '字典名称',
      prop: 'dictName',
      hideInSearch: true,
    },
    {
      label: '字典类型',
      prop: 'dictType',
      hideInSearch: true,
      valueType: 'select',
      options: computed(() => {
        return toOptions(dictValueTypeKey)
      }),
    },
    {
      label: '状态',
      prop: 'status',
      valueType: 'plus-radio',
      options: computed(() => {
        return toOptions(dictStatus)
      }),
    },
    {
      label: '描述',
      prop: 'description',
      hideInSearch: true,
      valueType: 'textarea',
    },
    {
      prop: 'extraParams',
      hasLabel: false,
      hideInSearch: true,
    },
  ]

  const formVisible = ref(false)
  const formModel = ref<any>({
    extraParams: [],
  })
  const submitLoading = ref(false)
  // const extraSchemaArr = ref<Array<ExtraParamType>>([])
  const formRules: FormRules = {
    dictName: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
    dictCode: [
      { required: true, message: '请输入字典编码', trigger: 'blur' },
      {
        validator: (_, value, callback) => {
          if (!value) {
            return callback(new Error('请输入字典编码'))
          }
          dictAPi.hasCode(value, formModel.value?.id ?? '').then((success) => {
            if (!success) {
              callback(new Error('字典编码已存在'))
            }
            else {
              callback()
            }
          }).catch(() => {
            callback(new Error('字典编码校验失败'))
          })
        },
      },
    ],
    dictType: [{ required: true, message: '请选择字典类型', trigger: 'change' }],
    status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
  }

  const validateExtraParams = (_: any, value: any, callback: any) => {
    if (!value) {
      callback(new Error('请输入额外参数'))
      return
    }
    // eslint-disable-next-line prefer-regex-literals
    if (!new RegExp(/^\w{2,32}$/).test(value)) {
      callback(new Error('请输入正确的额外参数'))
      return
    }
    // 不能为内置参数
    if (innerKeys.includes(value)) {
      callback(new Error('不能为内置参数'))
      return
    }

    callback()
  }

  const dictValueTypeOptions = computed(() => {
    return toOptions(dictValueTypeKey)
  })

  const dictItemVisible = ref(false)

  // 渲染表单
  const renderForm = (record: any) => {
    formModel.value = Object.assign({}, record)
  }

  const tableActions: ActionBarButtonsRow[] = [
    {
      text: '查看',
      props: {
        type: 'primary',
        underline: 'never',
      },
      directives: [
        [auth, 'sys:dict:item:query'],
      ],
      onClick: ({ row }) => {
        console.log('row', row)
        renderForm(row)
        dictItemVisible.value = true
      },
    },
    {
      text: '编辑',
      props: {
        type: 'primary',
        underline: 'never',
      },
      directives: [
        [auth, 'sys:dict:update'],
      ],
      onClick: ({ row }) => {
        renderForm(row)
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
        [auth, 'sys:dict:delete'],
      ],
      confirm: {
        title: '删除提示',
        message: '确定删除该数据吗？',
      },
      onConfirm: async ({ row }) => {
        const { success } = await dictAPi.del(row.id)
        if (success) {
          ElMessage.success('删除成功')
          plusPageRef.value?.getList()
        }
      },
    },
  ]

  async function addNew() {
    formModel.value = {
      status: true,
      extraParams: [],
    }
    formVisible.value = true
  }

  async function formSave() {
    submitLoading.value = true
    const { success } = formModel.value.id ? await _update() : await _save()
    submitLoading.value = false
    if (success) {
      ElMessage.success('保存成功')
      plusPageRef.value?.getList()
      formVisible.value = false
    }
  }

  async function _save() {
    // return dictAPi.save({ ...formModel.value, extraSchema: JSON.stringify(extraSchemaArr.value) })
    return dictAPi.save(formModel.value)
  }
  async function _update() {
    // return dictAPi.update(formModel.value.id, { ...formModel.value, extraSchema: JSON.stringify(extraSchemaArr.value) })
    return dictAPi.update(formModel.value.id, formModel.value)
  }

  async function refreshCache() {
    const { success } = await dictAPi.refreshCache()
    if (success) {
      ElMessage.success('刷新成功')
    }
  }

  // 添加额外参数
  const addExtraParam = (name: string | undefined, type: any) => {
    const extraParams = formModel.value.extraParams || []
    const exist = extraParams.find((v: any) => v.name === name)
    if (name && exist) {
      return
    }
    extraParams.push({
      name: name as string,
      type: type || ValueType.STRING,
    })
    formModel.value.extraParams = extraParams
  }

  // 移除额外参数
  const removeExtraParam = (index: number) => {
    formModel.value.extraParams.splice(index, 1)
  }
  async function onLoad(query: PageInfo & any) {
    const params = clone(query, true)
    Reflect.set(params, 'current', Reflect.get(query, 'page'))
    Reflect.deleteProperty(params, 'page')
    Reflect.set(params, 'size', Reflect.get(query, 'pageSize'))
    Reflect.deleteProperty(params, 'pageSize')

    const { success, data } = await dictAPi.page(params)
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
    dialogFormRef,
    plusPageRef,
    tableColumns,
    tableActions,
    dictValueTypeOptions,
    searchModel,
    formColumns,
    formVisible,
    validateExtraParams,
    formModel,
    submitLoading,
    formRules,
    dictItemVisible,
    formSave,
    addNew,
    refreshCache,
    addExtraParam,
    removeExtraParam,
    onLoad,
  }
}
