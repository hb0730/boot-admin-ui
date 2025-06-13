<script setup lang="ts">
import { ElForm } from 'element-plus'
import { loginByUsername as loginApiByUsernameApi } from '@/api/modules/auth'
import { useUserStore } from '@/store'
import Motion from '../utils/motion'

const userStore = useUserStore()

type FormInstance = InstanceType<typeof ElForm>
const loginFormRef = ref<FormInstance>()
const loginRules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

const loading = ref(false)
const loginForm = reactive<any>({
  username: '',
  password: '',
})

function formSubmit() {
  loginFormRef.value?.validate(async (valid) => {
    if (!valid)
      return
    loading.value = true
    try {
      // // 1.执行登录接口
      const { data } = await loginApiByUsernameApi({ ...loginForm, password: loginForm.password })
      userStore.setToken(data)
      // 2.执行登录后的操作
      await userStore.afterLogin()
    }
    finally {
      loading.value = false
    }
  })
}
</script>

<template>
  <ElForm
    ref="loginFormRef"
    :model="loginForm"
    :rules="loginRules"
    size="large"
  >
    <Motion :delay="150">
      <ElFormItem prop="username">
        <ElInput
          v-model="loginForm.username"
          placeholder="支持用户名、邮箱、手机号"
        >
          <template #prefix>
            <ReIcon icon="svg-icon:user" class="el-icon" />
          </template>
        </ElInput>
      </ElFormItem>
    </Motion>
    <Motion :delay="200">
      <ElFormItem prop="password">
        <ElInput
          v-model="loginForm.password"
          type="password"
          placeholder="密码"
          show-password
          autocomplete="new-password"
        >
          <template #prefix>
            <ReIcon icon="svg-icon:lock" class="el-icon" />
          </template>
        </ElInput>
      </ElFormItem>
    </Motion>
    <Motion :delay="250">
      <!-- <div class="h-[20px] w-full flex items-center justify-between">
        <ElButton
          link
          type="primary"
          @click="changeLoginType('reset' as LoginType)"
        >
          忘记密码？
        </ElButton>
      </div> -->
      <ElFormItem>
        <ElButton
          class="mt-4 w-full"
          size="default"
          type="primary"
          :loading="loading"
          @click="formSubmit"
        >
          登录
        </ElButton>
      </ElFormItem>
    </Motion>
  </ElForm>
</template>

<style scoped lang="scss">
    @use '../index.scss';
</style>
