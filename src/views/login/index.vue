<script setup lang="ts">
import Motion from "./utils/motion";
import { ref, onMounted, watch } from "vue";
import { tokenStoreHook } from "/@/store/modules/token";
import { bg, avatar, currentWeek } from "./utils/static";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { warnMessage } from "/@/utils/message";
import { useRoute } from "vue-router";
import router from "/@/router";

const loading = ref(false);
let user = ref("");
let pwd = ref("");
let remember = ref(false);
const redirect = ref(undefined);
const onLogin = (): void => {
  if (user.value == "" || pwd.value == "") {
    warnMessage("请输入用户名/密码");
    return;
  }
  loading.value = true;
  tokenStoreHook()
    .login({
      username: user.value,
      password: pwd.value,
      remember: remember.value
    })
    .then(() => {
      router.push({ path: redirect.value || "/" }).catch(() => {});
    })
    .catch(() => {
      loading.value = false;
    });
};
watch(
  () => useRoute,
  route => {
    redirect.value = route.query && route.query.redirect;
  }
);
onMounted(() => {
  const login = tokenStoreHook().getRemember();
  user.value = login.username;
  pwd.value = login.password;
  remember.value = login.remember;
});
</script>

<template>
  <img :src="bg" class="wave" />
  <div class="login-container">
    <div class="img">
      <component :is="currentWeek" />
    </div>
    <div class="login-box">
      <div class="login-form">
        <avatar class="avatar" />
        <Motion>
          <h2>Boot Admin</h2>
        </Motion>

        <el-form ref="ruleFormRef" size="large" @keyup.enter="onLogin">
          <Motion :delay="100">
            <el-form-item prop="username">
              <el-input
                clearable
                :input-style="{ 'user-select': 'none' }"
                v-model="user"
                placeholder="账号"
                :prefix-icon="useRenderIcon('user')"
              />
            </el-form-item>
          </Motion>

          <Motion :delay="150">
            <el-form-item prop="password">
              <el-input
                clearable
                :input-style="{ 'user-select': 'none' }"
                show-password
                v-model="pwd"
                placeholder="密码"
                :prefix-icon="useRenderIcon('lock')"
              />
            </el-form-item>
          </Motion>

          <Motion :delay="250">
            <el-form-item>
              <div class="w-full h-20px flex justify-between items-center">
                <el-checkbox v-model="remember">记住密码</el-checkbox>
              </div>
              <el-button
                class="w-full mt-4"
                size="default"
                type="primary"
                :loading="loading"
                @click="onLogin"
              >
                登录
              </el-button>
            </el-form-item>
          </Motion>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("/@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
</style>
