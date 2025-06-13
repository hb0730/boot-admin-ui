<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import type { PlusColumn, PlusDialogFormInstance } from 'plus-pro-components'
import { resetEmailPhone } from '@/api/modules/login'
import { useUserStore } from '@/store'
import { useVerifyCode } from '@/utils/verifyCode'

const plusDialogFormRef = ref<Nullable<PlusDialogFormInstance>>(null)
const dialogVisible = defineModel({
  type: Boolean,
  required: true,
  default: false,
})
const { userInfo } = useUserStore()
const { isDisabled, text } = useVerifyCode()

const submitFormLoading = ref<boolean>(false)
const formModel = ref<any>({})
const columns: PlusColumn[] = [
  {
    label: '备用邮箱',
    prop: 'key',

  },
  {
    label: '验证码',
    prop: 'code',
    fieldProps: {
      rules: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
      ],
    },
  },
]
const formRules: FormRules = {
  key: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
  ],
}

async function handleSubmit() {
  submitFormLoading.value = true
  plusDialogFormRef.value?.formInstance.validate(async (valid) => {
    if (valid) {
      try {
        const { success } = await resetEmailPhone('email', formModel.value).finally(() => {
          submitFormLoading.value = false
        })
        if (success) {
          ElMessage.success('修改成功，请重新登录')
          dialogVisible.value = false
        }
      }
      catch (error) {
        console.error(error)
      }
    }
    submitFormLoading.value = false
  })
}
</script>

<template>
  <PlusDialogForm
    ref="plusDialogFormRef"
    v-model="formModel"
    v-model:visible="dialogVisible"
    :dialog="{
      title: userInfo.email ? '修改备用邮箱' : '绑定备用邮箱',
      width: '500px',
    }"
    :form="{
      columns,
      rules: formRules,
      labelWidth: '100px',
      submitLoading: submitFormLoading,
    }"
    @confirm="handleSubmit"
  >
    <template #plus-field-code="{ prop }">
      <div class="flex justify-between">
        <ElInput
          v-model="formModel[prop]"
          placeholder="验证码"
          clearable
        >
          <template #prefix>
            <ReIcon icon="svg-icon:security-shield-fill" class="el-icon" />
          </template>
        </ElInput>
        <ElButton
          :disabled="isDisabled"
          class="ml-2"
          @click="useVerifyCode().start(plusDialogFormRef?.formInstance as FormInstance, 'key', formModel.key, 'get')"
        >
          {{
            text.length > 0
              ? `${text} 秒后重新获取`
              : '获取验证码'
          }}
        </ElButton>
      </div>
    </template>
  </PlusDialogForm>
</template>
