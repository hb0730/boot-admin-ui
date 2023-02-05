<script setup lang="ts">
import { useNav } from "@/layout/hooks/useNav";
import Logout from "@iconify-icons/ri/logout-circle-r-line";
import { ElMessageBox } from "element-plus";
const { logout } = useNav();
const handlerLogout = () => {
  ElMessageBox.confirm("确定是否退出登录", {
    type: "warning",
    title: "注销",
    showClose: false,
    confirmButtonText: "确认",
    cancelButtonText: "取消"
  })
    .then(() => {
      logout();
    })
    .catch(() => {});
};
</script>

<template>
  <div
    class="navbar-bg-hover el-dropdown-link cursor-pointer"
    @click="handlerLogout"
  >
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
