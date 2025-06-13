import type { TreeNode } from 'element-plus'
import type { ActionBarButtonsRow, PlusColumn, PlusPageInstance } from 'plus-pro-components'
import type { FormItemProps } from './types'
import { ElTag } from 'element-plus'
import { resolveDirective } from 'vue'
import * as permissionApi from '@/api/modules/system/permission'
import { useDictStore } from '@/store'
import { clone, deepTree } from '@/utils'
import { dictKeys, menuAffixDictKey, menuFullScreenDictKey, menuHiddenDictKey, menuIsRequiredLoginDictKey, menuKeepAliveDictKey, menuStatusDictKey, menuTypeDictKey } from '../utils/const'

export function usePermission() {
  const { toOptions, getDict, loadDict } = useDictStore()

  const auth = resolveDirective('auth')
  const plusPageRef = ref<PlusPageInstance | null>()
  const tableData = ref<any[]>([])

  const currentRow = ref<any>({})
  const formVisible = ref(false)
  const submitLoading = ref(false)
  const defaultModel: FormItemProps = {
    menuType: 0,
    sort: 99,
    isRequireLogin: true,
    isHidden: false,
    isKeepAlive: false,
    isAffix: false,
    isFullScreen: false,
    status: true,
  }
  const formModel = ref<FormItemProps>({ ...defaultModel })

  const formColumns: PlusColumn[] = [
    {
      label: '菜单类型',
      prop: 'menuType',
      options: computed(() => toOptions(menuTypeDictKey)),
    },
    {
      label: '上级菜单',
      prop: 'parentId',
      valueType: 'cascader',
      fieldProps: {
        props: {
          value: 'id',
          label: 'title',
          emitPath: false,
          checkStrictly: true,
          leaf: '_leaf',
        },
      },
      options: computed(() => {
        // 获取table data
        const menuList = clone(tableData.value, true)
        const nodes = menuList?.filter((item: any) => item.menuType !== 3)
        // build tree
        const tree = deepTree(nodes)
        return tree
      }),
    },
    {
      label: '菜单名称',
      prop: 'title',
      colProps: {
        span: 12,
      },
    },
    {
      label: '路由名称',
      prop: 'routeName',
      colProps: {
        span: 12,
      },
      hideInForm: computed(() => formModel.value.menuType === 3),
    },
    {
      label: '路由路径',
      prop: 'routePath',
      colProps: {
        span: 12,
      },
      hideInForm: computed(() => formModel.value.menuType === 3),
    },
    {
      label: '组件路径',
      prop: 'component',
      colProps: {
        span: 12,
      },
      hideInForm: computed(() => formModel.value.menuType !== 0),
    },
    {
      label: '菜单排序',
      prop: 'sort',
      valueType: 'input-number',
      fieldProps: {
        min: 0,
        max: 999,
        controlsPosition: 'right',
      },
      colProps: {
        span: 12,
      },
    },
    {
      label: '路由重定向',
      prop: 'redirect',
      colProps: {
        span: 12,
      },
      hideInForm: computed(() => formModel.value.menuType !== 0),
    },
    {
      label: '菜单图标',
      prop: 'icon',
      colProps: {
        span: 12,
      },
      hideInForm: computed(() => formModel.value.menuType === 3),
    },
    {
      label: '是否需要登陆',
      prop: 'isRequireLogin',
      colProps: {
        span: 12,
      },
      options: computed(() => toOptions(menuIsRequiredLoginDictKey)),
      hideInForm: computed(() => formModel.value.menuType === 3),
    },
    {
      label: '是否隐藏',
      tooltip: '隐藏后在菜单栏不显示',
      prop: 'isHidden',
      options: computed(() => toOptions(menuHiddenDictKey)),
      colProps: {
        span: 12,
      },
      hideInForm: computed(() => formModel.value.menuType === 3),
    },
    {
      label: '缓存页面',
      prop: 'isKeepAlive',
      tooltip: '保存该页面的整体状态，刷新后会清空状态',
      options: computed(() => toOptions(menuKeepAliveDictKey)),
      colProps: {
        span: 12,
      },
      hideInForm: computed(() => [2, 3].includes(formModel.value.menuType as number)),
    },
    {
      label: '固定标签页',
      prop: 'isAffix',
      tooltip: '菜单名称固定显示在标签页且不可关闭',
      options: computed(() => toOptions(menuAffixDictKey)),
      colProps: {
        span: 12,
      },
      hideInForm: computed(() => [2, 3].includes(formModel.value.menuType as number)),
    },
    {
      label: '全屏显示',
      prop: 'isFullScreen',
      tooltip: '当前页面全屏显示(适合展示大量数据)',
      options: computed(() => toOptions(menuFullScreenDictKey)),
      colProps: {
        span: 12,
      },
      hideInForm: computed(() => [2, 3].includes(formModel.value.menuType as number)),
    },
    {
      label: '权限标识',
      prop: 'perms',
      colProps: {
        span: 12,
      },
      hideInForm: computed(() => formModel.value.menuType !== 3),
    },
    {
      label: '状态',
      prop: 'status',
      colProps: {
        span: 12,
      },
      options: computed(() => toOptions(menuStatusDictKey)),
    },
  ]
  const formRules = {
    title: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
    routeName: [{ required: true, message: '请输入路由名称', trigger: 'blur' }],
    routePath: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
    perms: [{ required: true, message: '请输入权限标识', trigger: 'blur' }],

  }

  const tableColumns: PlusColumn[] = [
    {
      label: '菜单名称',
      prop: 'title',
    },
    {
      label: '菜单类型',
      prop: 'menuType',
      hideInSearch: true,
      render: (value) => {
        const item = getDict(menuTypeDictKey, value)
        return h(ElTag, { type: item.color }, () => item.label)
      },
    },
    {
      label: '路由路径',
      prop: 'routePath',
      hideInSearch: true,
    },
    {
      label: '组件路径',
      prop: 'component',
      hideInSearch: true,
    },
    {
      label: '权限标识',
      prop: 'perms',
      valueType: 'tag',
      hideInSearch: true,
    },
    {
      label: '排序',
      prop: 'sort',
      hideInSearch: true,
    },
    {
      label: '隐藏',
      prop: 'isHidden',
      hideInSearch: true,
      valueType: 'select',
      options: computed(() => toOptions(menuHiddenDictKey)),
      render: (value) => {
        const item = getDict(menuHiddenDictKey, value)
        return h(ElTag, { type: item.color }, () => item.label)
      },
    },
  ]
  const tableActionButtions: ActionBarButtonsRow[] = [
    {
      text: '新增',
      code: 'add',
      show: row => row.menuType !== 3,
      directives: [
        [auth, 'sys:permission:add'],
      ],
      props: {
        type: 'primary',
        underline: 'never',
      },
      onClick: ({ row }) => {
        handleAddNew(row.id)
        currentRow.value = row
      },
    },
    {
      text: '编辑',
      code: 'edit',
      directives: [
        [auth, 'sys:permission:update'],
      ],
      props: {
        type: 'primary',
        underline: 'never',
      },
      onClick: ({ row }) => {
        formModel.value = clone(row, true)
        formVisible.value = true
      },
    },
    {
      text: '删除',
      code: 'delete',
      directives: [
        [auth, 'sys:permission:delete'],
      ],
      props: {
        type: 'primary',
        underline: 'never',
      },
      confirm: {
        title: '删除提示',
        message: '确定删除该数据吗？',
      },
      onConfirm: async ({ row }) => {
        const { success } = await permissionApi.del(row.id)
        if (success) {
          ElMessage.success('删除成功')
          plusPageRef.value?.getList()
        }
      },
    },
  ]

  // 解决子集过多导致展开卡顿
  function onData(list: any) {
    const data = deepTree(list)
    // 递归处理
    function deep(data: any) {
      data.forEach((item: any) => {
        const nodes = plusPageRef.value?.plusTableInstance?.tableInstance?.store?.states?.lazyTreeNodeMap.value || {}
        if (nodes[item.id!]) {
          nodes[item.id!] = item.children!
        }

        if (item.children && item.children.length > 0) {
          item.hasChildren = true
          item._children = item.children
          delete item.children
          deep(item._children!)
        }
      })
    }
    deep(data)
    return data
  }
  /**
   *  加载数据
   * @param query .
   */
  async function loadData(query: Record<string, any>) {
    const { data, success } = await permissionApi.list(query)
    tableData.value = clone(data, true)
    const _data = onData(clone(data, true))
    return { data: _data, success, total: 0 }
  }
  /**
   * 加载子节点
   * @param row .
   */
  async function loadChild(row: any, _: TreeNode, resolve: (data: any[]) => void) {
    resolve(row._children || [])
  }

  /**
   * 新增
   */
  function handleAddNew(id?: string) {
    formModel.value = {
      ...defaultModel,
      parentId: id,
    }
    formVisible.value = true
  }

  /**
   * 保存
   */
  function handleConfirm() {
    submitLoading.value = true
    const promise = formModel.value.id ? _update() : _save()
    promise.then(({ success }) => {
      if (success) {
        ElMessage.success('保存成功')
        plusPageRef.value?.getList()
        formVisible.value = false
      }
    }).finally(() => {
      submitLoading.value = false
    })
  }

  function _save() {
    return permissionApi.save(formModel.value)
  }

  function _update() {
    return permissionApi.update(formModel.value.id!, formModel.value)
  }

  onBeforeMount(() => {
    loadDict(dictKeys)
  })

  return {
    plusPageRef,
    currentRow,
    formVisible,
    formModel,
    formColumns,
    formRules,
    submitLoading,

    tableColumns,
    tableActionButtions,
    loadData,
    loadChild,
    handleAddNew,
    handleConfirm,
  }
}
