<script setup lang="ts">
import type { FormRules } from 'element-plus'
import type { PlusColumn } from 'plus-pro-components'
import { resetPasswordApi } from '/src/api/modules/login'

const emit = defineEmits(['update:visible'])
const visible = defineModel('visible', {
  type: Boolean,
  default: false,
})

const submitLoading = ref(false)
const formModel = ref<any>({})

const formItems: PlusColumn[] = [
  {
    label: '原密码',
    prop: 'oldPassword',
    fieldProps: {
      type: 'password',
      showPassword: true,
    },
  },
  {
    label: '新密码',
    prop: 'newPassword',
    fieldProps: {
      type: 'password',
      showPassword: true,
    },
  },
  {
    label: '确认密码',
    prop: 'confirmPassword',
    fieldProps: {
      type: 'password',
      showPassword: true,
    },
  },
]

const formRules: FormRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
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
    {
      validator: (_, value, callback) => {
        if (value !== formModel.value.newPassword) {
          callback(new Error('两次输入密码不一致'))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}
function handleCancel() {
  formModel.value = {}
  emit('update:visible', false)
}

async function handleConfirm() {
  submitLoading.value = true
  const { success } = await resetPasswordApi(formModel.value).finally(() => {
    submitLoading.value = false
  })
  if (success) {
    ElMessage.success('重置密码成功,下次登录生效')
    handleCancel()
  }
}
</script>

<template>
  <PlusDialogForm
    v-model="formModel"
    :visible="visible"
    :form="{
      columns: formItems,
      rules: formRules,
      labelWidth: '100px',
    }"
    :dialog="{
      width: '30%',
      title: '重置密码',
      confirmLoading: true,
    }"
    @cancel="handleCancel"
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

<style lang="scss" scoped>
</style>
