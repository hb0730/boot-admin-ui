import type { ActionBarButtonsRow, PageInfo, PlusColumn, PlusPageInstance } from 'plus-pro-components'
import { ElTag, type FormRules } from 'element-plus'
import { resolveDirective } from 'vue'
import * as userApi from '@/api/modules/system/user'
import { useDictStore } from '@/store'
import { clone } from '@/utils'
import { dictKeys, userGenderDictKey, userStatusDictKey } from './const'
import { isPhone } from '/src/utils/is'

export function useUser() {
  const { getDict, toOptions, loadDict } = useDictStore()
  const plusPageRef = ref<PlusPageInstance | null>()
  const auth = resolveDirective('auth')
  const formVisible = ref(false)
  const submitLoading = ref(false)
  const resetPasswordVisible = ref(false)
  const rolesVisible = ref(false)
  const defaultFormModel = {
    gender: 0,
    status: true,
  }
  const formModel = ref<any>({ ...defaultFormModel })
  const hidePassword = ref(true)
  const tableColumns: PlusColumn[] = [
    {
      label: '账号',
      prop: 'username',
      hideInTable: true,
      hideInForm: true,
    },
    {
      label: '账号',
      prop: 'username',
      hideInSearch: true,
      fieldProps: computed(() => {
        return {
          disabled: !!formModel.value.id,
        }
      }),
    },
    {
      label: '昵称',
      prop: 'nickname',
    },
    {
      label: '密码',
      prop: 'password',
      hideInSearch: true,
      hideInTable: true,
      hideInForm: computed(() => hidePassword.value),
      fieldProps: {
        type: 'password',
        showPassword: true,
      },
    },
    {
      label: '确认密码',
      prop: 'confirmPassword',
      hideInSearch: true,
      hideInTable: true,
      hideInForm: computed(() => hidePassword.value),
      fieldProps: {
        type: 'password',
        showPassword: true,
      },
    },
    {
      label: '邮箱',
      prop: 'email',
      hideInSearch: true,
    },
    {
      label: '手机号',
      prop: 'phone',
      hideInSearch: true,
    },
    {
      label: '性别',
      prop: 'gender',
      valueType: 'select',
      options: computed(() => toOptions(userGenderDictKey)),
      render: (value) => {
        const item = getDict(userGenderDictKey, value)
        return h(ElTag, { type: item.type }, () => item.label)
      },
    },
    {
      label: '状态',
      prop: 'status',
      valueType: 'select',
      options: computed(() => toOptions(userStatusDictKey)),
      render: (value) => {
        const item = getDict(userStatusDictKey, value)
        return h(ElTag, { type: item.type }, () => item.label)
      },
    },
    {
      label: '最后登录时间',
      prop: 'lastLoginTime',
      hideInSearch: true,
      hideInForm: true,
    },
  ]

  const tableActionButtions: ActionBarButtonsRow[] = [
    {
      text: '编辑',
      props: {
        type: 'primary',
        underline: 'never',
      },
      directives: [
        [auth, 'sys:user:update'],
      ],
      onClick: ({ row }) => {
        hidePassword.value = true
        formModel.value = clone(row, true)
        formVisible.value = true
      },
    },
    {
      text: '重置密码',
      props: {
        type: 'primary',
        underline: 'never',
      },
      show: row => !row?.isSystem,
      directives: [
        [auth, 'sys:user:reset_password'],
      ],
      onClick: ({ row }) => {
        formModel.value = clone(row, true)
        resetPasswordVisible.value = true
      },
    },
    {
      text: '分配角色',
      props: {
        type: 'primary',
        underline: 'never',
      },
      show: row => !row?.isSystem,
      directives: [
        [auth, 'sys:user:assign_role'],
      ],
      onClick: ({ row }) => {
        formModel.value = clone(row, true)
        rolesVisible.value = true
      },
    },
    {
      text: '删除',
      show: row => !row?.isSystem,
      directives: [
        [auth, 'sys:user:delete'],
      ],
      props: {
        type: 'primary',
        underline: 'never',
      },
      confirm: {
        title: '删除提示',
        message: '是否删除该用户',
      },
      onConfirm: async ({ row }) => {
        const { success } = await userApi.remove(row.id)
        if (success) {
          ElMessage.success('删除成功')
          plusPageRef.value?.getList()
        }
      },
    },

  ]

  const formRules: FormRules = {
    username: [
      { required: true, message: '请输入账号', trigger: 'blur' },
      {
        validator: (_, value, callback) => {
          if (!value) {
            callback(new Error('请输入账号'))
          }
          else if (!/^\w{4,20}$/.test(value)) {
            callback(new Error('账号格式为4-20位字母、数字或下划线'))
          }
          else {
            userApi.hasExists('user_name', value, formModel.value?.id)
              .then(() => {
                callback()
              })
              .catch(() => {
                callback(new Error('账号校验失败'))
              })
          }
        },
        trigger: 'blur',
      },
    ],
    nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { validator: (_, value, callback) => {
        if (!value) {
          callback(new Error('请输入新密码'))
        }
        // 是否包含一个大写字母
        else if (!/[A-Z]/.test(value)) {
          callback(new Error('必须包含一个大写字母'))
        }
        // 是否包含一个小写字母
        else if (!/[a-z]/.test(value)) {
          callback(new Error('必须包含一个小写字母'))
        }
        // 是否包含一个数字
        else if (!/\d/.test(value)) {
          callback(new Error('必须包含一个数字'))
        }
        // 是否包含一个特殊字符
        else if (!/[!@#$%^&*]/.test(value)) {
          callback(new Error('必须包含一个特殊字符'))
        }
        // 是否包含6-20位
        else if (value.length < 6 || value.length > 20) {
          callback(new Error('密码长度为6-20位'))
        }
        else {
          callback()
        }
      }, trigger: 'blur' },
    ],
    confirmPassword: [
      { required: true, message: '请输入确认密码', trigger: 'blur' },
      { validator: (_, value, callback) => {
        if (!value) {
          callback(new Error('请再次输入密码'))
        }
        else if (value !== formModel.value.password) {
          callback(new Error('两次输入密码不一致'))
        }
        else {
          callback()
        }
      }, trigger: 'blur' },
    ],
    email: [
      { type: 'email', message: '请输入正确的邮箱', trigger: ['blur', 'change'] },
      {
        validator: (_, value, callback) => {
          if (!value) {
            callback()
          }
          else {
            userApi.hasExists('email', value, formModel.value?.id)
              .then(() => {
                callback()
              })
              .catch(() => {
                callback(new Error('邮箱校验失败'))
              })
          }
        },
        trigger: 'blur',
      },
    ],
    phone: [
      {
        validator: (_, value, callback) => {
          if (!value) {
            callback()
          }
          // 是脱敏手机号
          else if (/^\d{3}\*{4}\d{4}$/.test(value)) {
            callback()
          }
          else if (!isPhone(value)) {
            callback(new Error('请输入正确的手机号'))
          }
          else {
            userApi.hasExists('phone', value, formModel.value.id)
              .then(() => {
                callback()
              })
              .catch(() => {
                callback(new Error('手机号校验失败'))
              })
          }
        },
        trigger: 'blur',
      },
    ],
  }
  async function addNew() {
    hidePassword.value = false
    formModel.value = { ...defaultFormModel }
    formVisible.value = true
  }

  async function formSave() {
    console.log(formModel.value)
    submitLoading.value = true
    const { success } = formModel.value.id
      ? await _update()
          .finally(() => { submitLoading.value = false })
      : await _save()
          .finally(() => { submitLoading.value = false })
    if (success) {
      ElMessage.success('保存成功')
      plusPageRef.value?.getList()
      formVisible.value = false
    }
  }
  async function _save() {
    return userApi.save(formModel.value)
  }
  async function _update() {
    return userApi.update(formModel.value.id, formModel.value)
  }

  async function onLoad(query: PageInfo & any) {
    const params = clone(query, true)
    Reflect.set(params, 'current', Reflect.get(query, 'page'))
    Reflect.deleteProperty(params, 'page')
    Reflect.set(params, 'size', Reflect.get(query, 'pageSize'))
    Reflect.deleteProperty(params, 'pageSize')
    const { data, success } = await userApi.page(params)
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
    plusPageRef,
    tableColumns,
    tableActionButtions,
    submitLoading,
    formVisible,
    formModel,
    formRules,
    resetPasswordVisible,
    rolesVisible,

    addNew,
    formSave,
    onLoad,
  }
}
