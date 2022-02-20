<template>
  <el-select
    ref="mySelect"
    v-bind="$attrs"
    v-model="optionValue"
    :multiple="false"
    :disabled="disabled"
    clearable
    @visible-change="handleVisibleChange"
    @clear="handlerClear"
  >
    <el-option :value="optionValue" :label="optionValue" class="options">
      <el-tree
        id="tree-option"
        ref="selectTree"
        default-expand-all
        :data="options"
        :props="dataProps"
        @node-click="handleNodeClick"
      />
    </el-option>
  </el-select>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, PropType } from "vue";
export interface DataProps {
  id?: string;
  value?: string;
  children?: string;
  label?: string;
  disabled?: string;
  isLeaf?: string;
}

export default defineComponent({
  name: "mySelect",
  props: {
    modelValue: { type: String, default: "" },
    disabled: {
      type: Boolean,
      default: false
    },
    dataProps: {
      type: Object as PropType<DataProps>,
      default: () => ({
        id: "id",
        value: "id",
        children: "children",
        label: "title",
        disabled: "disabled",
        isLeaf: "isLeaf"
      })
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  emits: ["nodeClick", "update:modelValue"],
  setup(props, context) {
    function getLable(arr, value) {
      let res = "";
      function find(arr, value) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id == value) {
            //
            res = arr[i][props.dataProps.label];
          }
          if (arr[i].children && arr[i].children.length) {
            find(arr[i].children, value);
          }
        }
      }
      find(arr, value);
      return value + " " + res;
    }
    watch(
      () => {
        return props.modelValue;
      },
      () => {
        optionValue.value = getLable(props.options, props.modelValue);
      }
    );
    onMounted(() => {
      optionValue.value = getLable(props.options, props.modelValue);
    });
    const mySelect = ref();

    const optionValue = ref("");
    function handleNodeClick(node) {
      optionValue.value = node[props.dataProps.label];
      mySelect.value.blur();
      context.emit("nodeClick", node);
      context.emit("update:modelValue", node[props.dataProps.value]);
    }
    function handleVisibleChange(_) {}
    function handlerClear() {
      context.emit("nodeClick", null);
      context.emit("update:modelValue", "");
    }
    return {
      mySelect,
      handleNodeClick,
      handleVisibleChange,
      handlerClear,
      optionValue
    };
  }
});
</script>

<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
}

.el-select-dropdown__item.selected {
  font-weight: normal;
}

ul li :deep(.el-tree .el-tree-node__content) {
  height: auto;
  padding: 0 20px;
}

.el-tree-node__label {
  font-weight: normal;
}

.el-tree :deep(.is-current .el-tree-node__label) {
  color: #409eff;
  font-weight: 700;
}

.el-tree :deep(.is-current .el-tree-node__children .el-tree-node__label) {
  color: #606266;
  font-weight: normal;
}

.selectInput {
  padding: 0 5px;
  box-sizing: border-box;
}
</style>
