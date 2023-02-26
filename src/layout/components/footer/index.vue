<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { getCurrentInstance } from "vue";
const title =
  getCurrentInstance().appContext.config.globalProperties.$config?.Title;
defineOptions({ name: "LayoutFooter" });
</script>

<template>
  <div class="fixed bottom-0 w-full">
    <div class="global-footer">
      <div class="copyright">
        <span class="copyright-item">2022</span>
        <span class="copyright-item"
          ><component :is="useRenderIcon('fa:copyright')"
        /></span>
        <span class="copyright-item">{{ title }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.global-footer {
  display: flex;
  justify-content: center;
  font-size: 14px;
  // background-color: var(--el-card-bg-color);
  background: #f0f2f5;

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
