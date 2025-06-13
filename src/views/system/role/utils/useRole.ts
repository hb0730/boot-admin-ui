import type { FormRules } from 'element-plus'
import type { ActionBarButtonsRow, PlusColumn } from 'plus-pro-components'
import type { System } from '@/api/modules/system/role/types'
import { useTable } from 'plus-pro-components'
import { resolveDirective } from 'vue'
import * as roleApi from '@/api/modules/system/role'
import { useDictStore } from '@/store'
import { dictKeys, roleStatusDictKey } from './const'

export function useRole(onEdit: (row: any) => void) {
  const { loadDict, toOptions } = useDictStore()
  const { tableData, total, pageInfo } = useTable<any>()
  const auth = resolveDirective('auth')
  const pageSizeList = [10, 20, 50, 100]

  const currentRow = ref<any>({})
  const showPermission = ref(false)
  const tableLoading = ref(false)
  const tableColumns: PlusColumn[] = [
    {
      label: '角色名称',
      prop: 'roleName',
      hideInSearch: false,
    },
    {
      label: '角色标识',
      prop: 'roleCode',
      hideInSearch: false,
    },
    {
      label: '描述',
      prop: 'description',
      hideInSearch: true,
      valueType: 'textarea',
    },
    {
      label: '状态',
      prop: 'status',
      hideInSearch: false,
      valueType: 'select',
      options: computed(() => toOptions(roleStatusDictKey)),
    },
    {
      label: '创建时间',
      prop: 'createTime',
      hideInSearch: true,
      hideInForm: true,
    },
  ]
  const searchModel = ref({})

  const tableActionButtions: ActionBarButtonsRow[] = [
    {
      text: '编辑',
      props: {
        type: 'primary',
        underline: 'never',
      },
      directives: [
        [auth, 'sys:role:update'],
      ],
      onClick: ({ row }) => {
        currentRow.value = row
        onEdit(row)
      },
    },
    {
      text: '删除',
      props: {
        type: 'primary',
        underline: 'never',
      },
      confirm: {
        title: '删除提示',
        message: '确定删除该数据吗？',
      },
      directives: [
        [auth, 'sys:role:update'],
      ],
      onConfirm: async ({ row }) => {
        await roleApi.delById(row.id)
        onLoad()
      },
    },
    {
      text: '权限',
      props: {
        type: 'primary',
        underline: 'never',
      },
      directives: [
        [auth, 'sys:role:grant'],
      ],
      onClick: ({ row }) => {
        currentRow.value = row
        showPermission.value = true
      },
    },

  ]
  const handleReset = () => {
    searchModel.value = {}
  }
  const onSearch = () => {
    pageInfo.value.page = 1
    onLoad()
  }

  async function onLoad() {
    tableLoading.value = true
    const query: System.RoleQuery = {
      current: pageInfo.value.page,
      size: pageInfo.value.pageSize,
      ...searchModel.value,
    }
    const { data, success } = await roleApi.page(query).finally(() => {
      tableLoading.value = false
    })
    if (success) {
      tableData.value = data.records
      total.value = data.total
    }
  }

  onBeforeMount(() => {
    loadDict(dictKeys)
  })

  return {
    currentRow,
    searchModel,
    tableLoading,
    total,
    pageInfo,
    tableData,
    pageSizeList,
    showPermission,
    tableColumns,
    tableActionButtions,
    onLoad,
    onSearch,
    handleReset,
  }
}

export function useRoleForm() {
  const { loadDict, toOptions } = useDictStore()

  const submitLoading = ref(false)
  const formVisible = ref(false)
  const formModel = ref<any>({ })
  const defaultModel = {
    status: true,
  }
  const formRules: FormRules = {
    roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
    roleCode: [
      { required: true, message: '请输入角色标识', trigger: 'blur' },
      {
        validator: (_, value, callback: (error?: string | Error) => void) => {
          if (!value) {
            return callback(new Error('请输入角色标识'))
          }
          roleApi.hasCode(value, formModel.value?.id ?? '').then((success) => {
            if (!success) {
              callback(new Error('角色标识已存在'))
            }
            else {
              callback()
            }
          }).catch(() => {
            callback(new Error('角色标识校验失败'))
          })
        },
        trigger: 'blur',
      },
    ],
    status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
  }

  const formItems: PlusColumn[] = [
    {
      label: '角色名称',
      prop: 'roleName',
      hideInSearch: false,
    },
    {
      label: '角色标识',
      prop: 'roleCode',
      hideInSearch: false,
      fieldProps: computed(() => {
        return {
          disabled: !!formModel.value.id,
        }
      }),
    },
    {
      label: '描述',
      prop: 'description',
      hideInSearch: true,
      valueType: 'textarea',
    },
    {
      label: '状态',
      prop: 'status',
      hideInSearch: false,
      valueType: 'select',
      options: computed(() => toOptions(roleStatusDictKey)),
    },
    {
      label: '创建时间',
      prop: 'createTime',
      hideInSearch: true,
      hideInForm: true,
    },
  ]

  function handleCancel() {
    formVisible.value = false
    formModel.value = {}
  }
  async function handleConfirm(successCallback?: () => void) {
    submitLoading.value = true
    const { success } = formModel.value.id ? await _update() : await _save()
    submitLoading.value = false
    if (success) {
      formVisible.value = false
      successCallback?.()
    }
  }

  function _save() {
    return roleApi.save(formModel.value)
  }
  function _update() {
    return roleApi.update(formModel.value.id, formModel.value)
  }

  onBeforeMount(() => {
    loadDict(dictKeys)
  })

  return {
    formItems,
    submitLoading,
    formVisible,
    formModel,
    defaultModel,
    formRules,
    handleCancel,
    handleConfirm,
  }
}
