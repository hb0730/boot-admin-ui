<template>
  <el-select
    ref="selectRef"
    v-model="value"
    :placeholder="placeholder"
    v-bind="$attrs"
    clearable
    @remove-tag="removeTag"
    :multiple="multiple"
  >
    <el-option value="" />
    <el-tree
      ref="treeOptionRef"
      :show-checkbox="multiple"
      :check-strictly="true"
      default-expand-all
      highlight-current
      accordion
      node-key="id"
      check-on-click-node
      :data="options"
      :props="defaultProps"
      @check="checkNode"
    ></el-tree>
  </el-select>
</template>

<script lang="ts">
import type { ElSelect, ElTree } from "element-plus";
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
export default defineComponent({
  name: "TreeSelectV2",
  props: {
    modelValue: {
      required: true,
      type: Array as PropType<string[]>,
      default: () => {
        return [];
      }
    },
    multiple: {
      required: false,
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: () => {
        return "请选择";
      }
    },
    // 节点数据
    options: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 设置lable value属性
    defaultProps: {
      type: Object,
      default: () => {
        return {
          id: "id",
          value: "id",
          children: "children",
          label: "title",
          disabled: "disabled",
          isLeaf: "isLeaf"
        };
      }
    },
    // 默认勾选的节点
    defaultCheckNodes: {
      type: Array, // 已经分配的资源
      default: () => {
        return [];
      }
    }
  },
  emits: ["input"],
  setup(props, context) {
    const value = ref([]);
    const selectRef = ref<InstanceType<typeof ElSelect>>();
    const treeOptionRef = ref<InstanceType<typeof ElTree>>();
    onMounted(() => {
      value.value = props.modelValue;
      treeOptionRef.value!.setCheckedKeys(value.value);
    });
    watch(
      () => {
        return props.modelValue;
      },
      () => {
        value.value = props.modelValue;
      }
    );
    // 删除tag时，
    function removeTag(val) {
      // 取消勾选
      treeOptionRef.value!.setChecked(val, false, false);
      context.emit("input", value.value);
    }
    // 勾选节点，
    function checkNode(node) {
      node.value = node.id;
      node.currentLabel = node.label;
      selectRef.value!.options;
      selectRef.value!.handleOptionSelect(node, true);
      context.emit("input", value.value);
    }
    return { selectRef, treeOptionRef, value, removeTag, checkNode };
  }
});
</script>
<style scoped>
/* 去除tree上面的一行高度 */
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  padding: 0;
}
</style>
