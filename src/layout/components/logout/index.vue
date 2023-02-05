<script setup lang="ts">
import Logout from "@iconify-icons/ri/logout-circle-r-line";
</script>

<template>
  <div class="navbar-bg-hover el-dropdown-link cursor-pointer">
    <span class="flex-c h-full text-center dark:text-white">
      <IconifyIconOffline :icon="Logout" />
      <p class="pl-2 dark:text-white">退出登录</p>
    </span>
  </div>
</template>

<style scoped lang="scss">
p {
  font-size: 14px;
}
</style>
