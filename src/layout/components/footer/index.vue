<script setup lang="ts">
import { getCurrentInstance } from "vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
const title =
  getCurrentInstance().appContext.config.globalProperties.$config?.Title;
</script>

<template>
  <div class="global-footer">
    <div class="copyright">
      <span class="copyright-item">2022</span>
      <span class="copyright-item"
        ><component :is="useRenderIcon('fa-copyright')"
      /></span>
      <span class="copyright-item">{{ title }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.global-footer {
  display: flex;
  justify-content: center;
  font-size: 14px;
  background-color: var(--el-card-bg-color);

  .copyright {
    color: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;

    .copyright-item {
      padding: 0 0 0 3px;
    }
  }
}
</style>
