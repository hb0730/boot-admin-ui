<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
    <ReDialog />
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import { useWatermark } from "@pureadmin/utils";
import { ReDialog } from "@/components/ReDialog";

const watermark = useWatermark();
watermark.setWatermark("boot-admin", {
  globalAlpha: 0.15,
  gradient: [
    { value: 0, color: "magenta" },
    { value: 0.5, color: "blue" },
    { value: 1.0, color: "red" }
  ]
});
export default defineComponent({
  name: "app",
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
    ReDialog
  },
  computed: {
    currentLocale() {
      return zhCn;
    }
  }
});
</script>
