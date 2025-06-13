<script setup lang="ts">

</script>

<template>
  <div class="tool-bar-ri">
    <div class="header-icon">
      <SearchMenu />
      <Fullscreen />
      <!-- <Message /> -->
      <AssemblySize />
      <ThemeSetting />
    </div>
    <Avatar class="avatar" />
  </div>
</template>

<style scoped lang="scss">
.tool-bar-ri {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 25px;
  .header-icon {
    display: flex;
    align-items: center;
    & > * {
      margin-left: 21px;
      color: var(--el-header-text-color);
    }
  }
  .avatar {
    margin-left: 21px;
  }
}
</style>
