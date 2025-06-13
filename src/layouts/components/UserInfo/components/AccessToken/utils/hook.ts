import type { FormRules } from 'element-plus'
import type { ActionBarButtonsRow, PageInfo, PlusColumn, PlusDialogFormInstance, PlusPageInstance } from 'plus-pro-components'
import * as authApi from '@/api/modules/login'
import { group } from '@/api/modules/system/openApi'
import { clone } from '@/utils'

export function useAccessToken() {
  const plusPageRef = ref<PlusPageInstance | null>(null)
  const plusDialogFormRef = ref<PlusDialogFormInstance | null>(null)
  const dialogVisible = ref(false)
  const submitLoading = ref(false)

  const openApiRef = ref<any>(null)
  const openApisData = ref<any>([])
  const actionButtions: ActionBarButtonsRow[] = [
    {
      text: '撤销',
      props: {
        type: 'danger',
        underline: 'never',
      },
      show: row => row.status,
      confirm: {
        title: '撤销',
        message: '确定要撤销吗？',
      },
      onConfirm: ({ row }) => {
        handleCancelAccessToken(row)
      },
    },
    {
      text: '恢复',
      props: {
        type: 'success',
        underline: 'never',
      },
      show: row => !row.status,
      confirm: {
        title: '恢复',
        message: '确定要恢复吗？',
      },
      onConfirm: ({ row }) => {
        handleRestoreAccessToken(row)
      },
    },

    {
      text: '删除',
      props: {
        type: 'danger',
        underline: 'never',
      },
      confirm: {
        title: '删除',
        message: '确定要删除吗？',
      },
      onConfirm: ({ row }) => {
        handleRemoveAccessToken(row)
      },
    },

  ]
  const tableColumns: PlusColumn[] = [
    {
      label: '名称',
      prop: 'name',
    },
    {
      label: '有效期',
      prop: 'expireTime',
      hideInSearch: true,
      render: (value) => {
        return h('span', value || '永久有效')
      },
    },
    {
      label: '状态',
      prop: 'status',
      hideInSearch: true,
      render: (value) => {
        return h(ElTag, { type: value ? 'success' : 'info' }, () => value ? '正常' : '撤销')
      },
    },
    {
      label: '创建时间',
      prop: 'created',
      hideInSearch: true,
      hideInForm: true,
    },
  ]

  const formModel = ref<any>({})
  const formColumns: PlusColumn[] = [
    {
      label: '名称',
      prop: 'name',
    },
    {
      label: '有效期',
      prop: 'expireTime',
      valueType: 'date-picker',
      tooltip: '不填写则永久有效',
      fieldProps: {
        type: 'datetime',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },

    },
    {
      label: '描述',
      prop: 'description',
      valueType: 'textarea',
    },
    {
      label: '开放接口',
      prop: 'openApis',
    },
  ]
  const formRules: FormRules = {
    name: [
      { required: true, message: '请输入名称', trigger: 'blur' },
    ],
  }

  const accessToken = ref<string>('')
  const accessTokenVisible = ref(false)

  async function onLoad(query: PageInfo & any) {
    const params = clone(query, true)
    Reflect.set(params, 'current', Reflect.get(query, 'page'))
    Reflect.deleteProperty(params, 'page')
    Reflect.set(params, 'size', Reflect.get(query, 'pageSize'))
    Reflect.deleteProperty(params, 'pageSize')
    params.sorts = 'created desc'
    const { success, data } = await authApi.getUserAccessTokenApi(params)
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

  async function loadOpenApi() {
    const { success, data } = await group()
    if (success) {
      openApisData.value = data
    }
  }

  function handleAddNew() {
    formModel.value = { }
    dialogVisible.value = true
  }

  async function handleConfirm() {
    const body = clone(formModel.value, true)
    const openApis = openApiRef.value?.getValue()
    Reflect.set(body, 'openApiIds', openApis)
    submitLoading.value = true

    const { success, data } = await authApi
      .createAccessTokenApi(body)
      .finally(() => {
        submitLoading.value = false
      })
    if (success) {
      ElMessage.success('创建成功')
      dialogVisible.value = false
      plusPageRef.value?.getList()
      accessToken.value = data
      accessTokenVisible.value = true
    }
  }

  function handleCancel() {
    dialogVisible.value = false
    formModel.value = { }
    plusDialogFormRef.value?.formInstance?.resetFields()
  }

  function handleAccessTokenConfirm() {
    // copy
    navigator.clipboard.writeText(accessToken.value)
    ElMessage.success('复制成功')
    accessTokenVisible.value = false
  }

  async function handleCancelAccessToken(data: any) {
    const { success } = await authApi.cancelAccessTokenApi(data.id)
    if (success) {
      ElMessage.success('撤销成功')
      plusPageRef.value?.getList()
    }
  }

  async function handleRestoreAccessToken(data: any) {
    const { success } = await authApi.restoreAccessTokenApi(data.id)
    if (success) {
      ElMessage.success('恢复成功')
      plusPageRef.value?.getList()
    }
  }

  async function handleRemoveAccessToken(data: any) {
    const { success } = await authApi.removeAccessTokenApi(data.id)
    if (success) {
      ElMessage.success('删除成功')
      plusPageRef.value?.getList()
    }
  }

  onMounted(() => {
    loadOpenApi()
  })

  return {
    plusPageRef,
    plusDialogFormRef,
    openApiRef,
    dialogVisible,
    submitLoading,
    tableColumns,
    actionButtions,
    formModel,
    formColumns,
    formRules,
    openApisData,
    accessToken,
    accessTokenVisible,
    onLoad,
    handleAddNew,
    handleCancel,
    handleConfirm,
    handleAccessTokenConfirm,
    handleCancelAccessToken,
    handleRestoreAccessToken,
    handleRemoveAccessToken,
  }
}
