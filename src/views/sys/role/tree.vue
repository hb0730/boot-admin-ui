<script setup lang="ts">
import { onMounted, ref, nextTick } from "vue";
import { listTree } from "@/api/sys/permission";
const props = withDefaults(
  defineProps<{
    formInline?: any;
  }>(),
  {
    formInline: {
      role: undefined,
      selectedKeys: []
    }
  }
);
const permissionTree = ref([]);
const newFormInline = ref(props.formInline);
const dataProps = ref({
  value: "id",
  children: "children"
});
const treeRef = ref();
const checkStrictly = ref(false);

function loadPermissionTree() {
  listTree(false).then(res => {
    if (res.success) {
      permissionTree.value = res.data;
      loadRolePermission();
    }
  });
}

function handleCheckChange(data: any, checked: boolean) {
  const selectedNodes = treeRef.value.getCheckedNodes(); // 重点
  let selectedKeys = [];
  selectedNodes.forEach(e => {
    selectedKeys.push(e.id);
  });
  selectedKeys = selectedKeys.concat(treeRef.value.getHalfCheckedKeys());
  newFormInline.value.selectedIds = selectedKeys;
}

function loadRolePermission() {
  const selectedIds = newFormInline.value.role?.permissionIds ?? [];
  checkStrictly.value = true; //赋值之前先设置为true
  nextTick(() => {
    treeRef.value.setCheckedKeys(selectedIds); //给树节点赋值
    newFormInline.value.selectedIds = selectedIds;
    setTimeout(function () {
      checkStrictly.value = false; //赋值完成后设置为false
    }, 2000);
  });
}

onMounted(() => {
  loadPermissionTree();
});
defineOptions({
  name: "PermissionTree"
});
</script>

<template>
  <div>
    <h5 style="margin-bottom: 20px">
      【{{ newFormInline?.role?.name }}】所拥有的权限：
    </h5>
    <el-tree-v2
      ref="treeRef"
      :data="permissionTree"
      :props="dataProps"
      show-checkbox
      :height="500"
      node-key="id"
      :check-strictly="checkStrictly"
      @check-change="handleCheckChange"
    >
      <template #default="{ data }">
        <span>{{ data.title }}</span>
      </template>
    </el-tree-v2>
  </div>
</template>
