<script setup lang="ts">
import { computed, getCurrentInstance, ref, watch } from "vue";
import More2Fill from "@iconify-icons/ri/more-2-fill";
import OfficeBuilding from "@iconify-icons/ep/office-building";
import LocationCompany from "@iconify-icons/ep/add-location";
import Dept from "@iconify-icons/ri/git-branch-line";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

const emit = defineEmits(["tree-select"]);

const props = defineProps({
  treeData: Object
});
interface Tree {
  id: number;
  name: string;
  children?: Tree[];
  highlight?: boolean;
}
const searchValue = ref("");
const treeRef = ref();
const highlightMap = ref({});
const isExpand = ref(true);
const { proxy } = getCurrentInstance();
const defaultProps = {
  children: "children",
  label: "name"
};
const buttonClass = computed(() => {
  return [
    "!h-[20px]",
    "!text-sm",
    "reset-margin",
    "!text-[var(--el-text-color-regular)]",
    "dark:!text-white",
    "dark:hover:!text-primary"
  ];
});
const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.name.includes(value);
};

function nodeClick(value) {
  const nodeId = value.$treeNodeId;
  highlightMap.value[nodeId] = highlightMap.value[nodeId]?.highlight
    ? Object.assign({ id: nodeId }, highlightMap.value[nodeId], {
        highlight: false
      })
    : Object.assign({ id: nodeId }, highlightMap.value[nodeId], {
        highlight: true
      });
  Object.values(highlightMap.value).forEach((v: Tree) => {
    if (v.id !== nodeId) {
      v.highlight = false;
    }
  });
  emit(
    "tree-select",
    highlightMap.value[nodeId]?.highlight
      ? Object.assign({ ...value, selected: true })
      : Object.assign({ ...value, selected: false })
  );
}

function toggleRowExpansionAll(status) {
  isExpand.value = status;
  const nodes = (proxy.$refs["treeRef"] as any).store._getAllNodes();
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].expanded = status;
  }
}

watch(searchValue, val => {
  treeRef.value!.filter(val);
});

defineOptions({
  name: "DeptTree"
});
</script>

<template>
  <div
    v-loading="props.treeData.loading"
    class="h-full bg-bg_color overflow-auto"
    :style="{ minHeight: `calc(100vh - 141px)` }"
  >
    <div class="flex items-center h-[34px]">
      <el-input
        v-model="searchValue"
        class="ml-2"
        size="small"
        placeholder="请输入部门名称"
        clearable
      >
        <template #suffix>
          <el-icon class="el-input__icon">
            <IconifyIconOffline
              v-show="searchValue.length === 0"
              icon="ri:search-line"
            />
          </el-icon>
        </template>
      </el-input>
      <el-dropdown :hide-on-click="false">
        <IconifyIconOffline
          class="w-[28px] cursor-pointer"
          width="18px"
          :icon="More2Fill"
        />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-button
                :class="buttonClass"
                link
                type="primary"
                :icon="
                  useRenderIcon(
                    isExpand ? 'ri:expand-up-down-fill' : 'ri:expand-right-fill'
                  )
                "
                @click="toggleRowExpansionAll(isExpand ? false : true)"
              >
                {{ isExpand ? "折叠全部" : "展开全部" }}
              </el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-divider />
    <el-tree
      ref="treeRef"
      :data="props.treeData.dataList"
      node-key="id"
      size="small"
      :props="defaultProps"
      default-expand-all
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      @node-click="nodeClick"
    >
      <template #default="{ node, data }">
        <span
          :class="[
            'pl-1',
            'pr-1',
            'rounded',
            'flex',
            'items-center',
            'select-none',
            'hover:text-primary',
            searchValue.trim().length > 0 &&
              node.label.includes(searchValue) &&
              'text-red-500',
            highlightMap[node.id]?.highlight ? 'dark:text-primary' : ''
          ]"
          :style="{
            color: highlightMap[node.id]?.highlight
              ? 'var(--el-color-primary)'
              : '',
            background: highlightMap[node.id]?.highlight
              ? 'var(--el-color-primary-light-7)'
              : 'transparent'
          }"
        >
          <IconifyIconOffline
            :icon="
              data.type === 1
                ? OfficeBuilding
                : data.type === 2
                  ? LocationCompany
                  : Dept
            "
          />
          {{ node.label }}
        </span>
      </template>
    </el-tree>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-divider) {
  margin: 0;
}

:deep(.el-tree) {
  --el-tree-node-hover-bg-color: transparent;
}
</style>
