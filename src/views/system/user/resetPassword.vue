<script setup lang="ts">
import type { FormRules } from 'element-plus'
import type { PlusColumn, PlusDialogFormInstance } from 'plus-pro-components'
import { resetPassword as resetPasswordApi } from '@/api/modules/system/user'

const props = defineProps({
  visible: Boolean,
  userInfo: Object,
})
const emit = defineEmits(['update:visible'])
const formModel = ref<any>({
})
const formColumns: PlusColumn[] = [
  {
    prop: 'username',
    label: '用户名',
    fieldProps: {
      disabled: true,
    },
  },
  {
    prop: 'password',
    label: '新密码',
    fieldProps: {
      type: 'password',
      showPassword: true,
    },
  },
]

const rules: FormRules = {
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
}

const plusDialogFormRef = ref<PlusDialogFormInstance | null>()
const submitLoading = ref(false)
const localVisible = ref(props.visible)

async function handleConfirm() {
  submitLoading.value = true
  const { success } = await resetPasswordApi(props.userInfo?.id, formModel.value.password).finally(() => {
    submitLoading.value = false
  })
  if (success) {
    ElMessage.success('重置密码成功,下次登录生效')
    localVisible.value = false
    plusDialogFormRef.value?.formInstance.resetFields()
  }
}

watch(() => props.visible, (val) => {
  localVisible.value = val
  if (val) {
    formModel.value = {
      username: props.userInfo?.username,
      password: '',
    }
  }
})
// 监听本地状态的变化，触发父组件的事件
watch(localVisible, (val) => {
  emit('update:visible', val)
})
</script>

<template>
  <PlusDialogForm
    ref="plusDialogFormRef"
    v-model:visible="localVisible"
    v-model="formModel"
    :form="{
      columns: formColumns,
      rules,
      labelWidth: '100px',
    }"
    :dialog="{
      title: '重置密码',
      width: '30%',
    }"
    @confirm="handleConfirm"
  >
    <template #dialog-footer="{ handleConfirm, handleCancel }">
      <ElButton
        @click="handleCancel"
      >
        取消
      </ElButton>
      <ElPopconfirm
        title="确认提交吗？"
        @confirm="handleConfirm"
      >
        <template #reference>
          <ElButton
            type="primary"
            :loading="submitLoading"
          >
            确定
          </ElButton>
        </template>
      </ElPopconfirm>
    </template>
  </PlusDialogForm>
</template>
