import type { ActionBarButtonsRow, PageInfo, PlusColumn, PlusDialogInstance, PlusPageInstance } from 'plus-pro-components'
import * as AttachmentListApi from '@/api/modules/system/attachment'
import { clone } from '@/utils'

export function useAttachmentHook() {
  const plusPageRef = ref <Nullable<PlusPageInstance>>(null)
  const columns: PlusColumn[] = [
    {
      label: '预览',
      prop: 'preview',
      editable: true,
      hideInSearch: true,
    },
    {
      label: '附件名称',
      prop: 'displayName',
      hideInTable: true,
    },
    {
      label: '附件类型',
      prop: 'mediaType',
    },
    {
      label: '附件大小',
      prop: 'size',
      hideInSearch: true,
      formatter: (size) => {
        if (size < 1024) {
          return `${size}B`
        }
        else if (size < 1024 * 1024) {
          return `${(size / 1024).toFixed(2)}KB`
        }
        else {
          return `${(size / 1024 / 1024).toFixed(2)}MB`
        }
      },
    },
    {
      label: '附件地址',
      prop: 'permalink',
      hideInSearch: true,
    },
    {
      label: '上传时间',
      prop: 'created',
      hideInSearch: true,
    },
  ]
  const actionButtins: ActionBarButtonsRow[] = [
    {
      text: '删除',
      props: {
        type: 'danger',
        underline: 'never',
      },
      confirm: {
        title: '提示',
        message: '确定删除吗',
      },
      onConfirm: async ({ row }) => {
        const { success } = await AttachmentListApi.remove(row.id)
        if (success) {
          ElMessage.success('删除成功')
          plusPageRef.value?.getList()
        }
      },
    },
  ]

  const plusDialogRef = ref<Nullable<PlusDialogInstance>>(null)
  const formVisible = ref(false)

  const formUploadRef = ref<any>(null)
  async function loadData(query: PageInfo & any) {
    const params = clone(query, true)
    Reflect.set(params, 'current', Reflect.get(query, 'page'))
    Reflect.deleteProperty(params, 'page')
    Reflect.set(params, 'size', Reflect.get(query, 'pageSize'))
    Reflect.deleteProperty(params, 'pageSize')
    params.sorts = 'status desc,created desc'

    const { success, data } = await AttachmentListApi.page(params)
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

  async function handleOpen() {
    formVisible.value = true
  }
  async function handleClose() {
    formVisible.value = false
  }
  async function handleRefresh() {
    plusPageRef.value?.getList()
  }
  return {
    plusPageRef,
    columns,
    actionButtins,
    plusDialogRef,
    formVisible,
    formUploadRef,
    loadData,
    handleOpen,
    handleClose,
    handleRefresh,
  }
}
