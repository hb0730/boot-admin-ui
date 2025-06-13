<script setup lang="ts">
import LoginForm from './components/LoginForm.vue'

const title = import.meta.env.VITE_APP_TITLE || 'ZOOM-Admin'
</script>

<template>
  <div class="login-container flx-center">
    <div class="login-box">
      <SwitchDark class="dark" />
      <div class="login-left">
        <img class="login-left-img" src="@/assets/images/login_left.png" alt="login">
      </div>
      <div class="login-form">
        <div class="login-logo">
          <img class="login-icon" src="@/assets/images/logo.png" alt="">
          <h2 class="logo-text">
            {{ title }}
          </h2>
        </div>
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use './index.scss';
</style>
