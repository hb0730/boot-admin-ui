<script setup lang="ts">
import type { PropType } from "vue";
import { useRenderIcon } from "../ReIcon/src/hooks";
export interface Btn {
  show: boolean;
  state: boolean;
  permission: [] | string;
}
defineOptions({ name: "TableOperation" });

const props = defineProps({
  size: {
    required: false,
    type: String as PropType<"" | "default" | "small" | "large">,
    default: "default"
  },
  add: {
    required: false,
    type: Object as PropType<Btn>,
    default: function () {
      return {
        show: false,
        state: true,
        permission: []
      };
    }
  },
  update: {
    required: false,
    type: Object as PropType<Btn>,
    default: function () {
      return {
        show: false,
        state: true,
        permission: []
      };
    }
  },
  delete: {
    required: false,
    type: Object as PropType<Btn>,
    default: function () {
      return {
        show: false,
        state: true,
        permission: []
      };
    }
  },
  refresh: {
    required: false,
    type: Object as PropType<Btn>,
    default: function () {
      return {
        show: true,
        state: true,
        permission: []
      };
    }
  },
  search: {
    required: false,
    type: Object as PropType<Btn>,
    default: function () {
      return {
        show: true,
        state: true,
        permission: []
      };
    }
  }
});
const emits = defineEmits([
  "clickAdd",
  "clickUpdate",
  "clickDelete",
  "clickRefresh",
  "clickSearch"
]);
</script>

<template>
  <div class="flex items-center justify-between mb-2">
    <div class="flex items-center justify-center">
      <el-button
        v-if="props.add.show"
        type="primary"
        :size="props.size"
        :icon="useRenderIcon('ep:plus')"
        @click="emits('clickAdd')"
        :disabled="!props.add.state"
        v-auth="props.add.permission"
        >新增</el-button
      >
      <el-button
        v-if="props.update.show"
        type="success"
        :size="props.size"
        :icon="useRenderIcon('ep:edit')"
        @click="emits('clickUpdate')"
        :disabled="!props.update.state"
        v-auth="props.update.permission"
        >修改</el-button
      >
      <el-button
        v-if="props.delete.show"
        type="danger"
        :size="props.size"
        :icon="useRenderIcon('delete')"
        @click="emits('clickDelete')"
        :disabled="!props.delete.state"
        v-auth="props.delete.permission"
        >删除</el-button
      >
      <slot name="left" />
    </div>
    <div class="flex items-center justify-center">
      <el-button
        v-if="props.search.show"
        :size="props.size"
        :icon="useRenderIcon('ep:search')"
        circle
        @click="emits('clickSearch')"
      />
      <el-button
        v-if="props.refresh.show"
        :size="props.size"
        :icon="useRenderIcon('ep:refresh')"
        circle
        @click="emits('clickRefresh')"
      />
      <slot name="right" />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
