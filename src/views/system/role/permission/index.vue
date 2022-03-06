<script lang="ts">
export default {
  name: "PermissionTree"
};
</script>
<script setup lang="ts">
import { toRef, PropType, reactive, ref, watch } from "vue";
import { MenuPermissionTree } from "/@/api/model/system/menu_model";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { ElTree } from "element-plus";
import { Role } from "/@/api/model/system/role_model";
import { successMessage, warnMessage } from "/@/utils/message";
import { roleApi } from "/@/api/system/role";
const permissionTreeRef = ref<InstanceType<typeof ElTree>>();
const emit = defineEmits<{
  (e: "refresh"): void;
}>();
const treeProps = reactive({
  children: "children",
  label: "name"
});
const props = defineProps({
  permissionList: Array as PropType<string[]>,
  menuPermissionTree: Array as PropType<MenuPermissionTree[]>,
  isMenuSave: {
    require: true,
    type: Boolean,
    default: false
  },
  currentRole: Object as PropType<Role>
});
const permissionList = toRef(props, "permissionList");
const currentRole = toRef(props, "currentRole");
const isMenuSave = toRef(props, "isMenuSave");
const menuTreeData = toRef(props, "menuPermissionTree");
watch(
  () => {
    return props.permissionList;
  },
  () => {
    if (props.permissionList) {
      permissionTreeRef.value!.setCheckedKeys(props.permissionList);
    } else {
      permissionTreeRef.value!.setCheckedKeys([]);
    }
  }
);
const handlerSave = () => {
  const menuArray = permissionTreeRef.value!.getCheckedNodes(true, false);
  if (menuArray.length <= 0) {
    warnMessage("请选择需要分配的数据");
    return;
  }
  let permissionArray = menuArray.filter(menu => {
    return menu.isPermission;
  });
  if (permissionArray.length <= 0) {
    warnMessage("请选择正确的菜单权限");
    return;
  }
  permissionArray = permissionArray.map(permission => {
    return permission.id;
  });
  updatePermission(permissionArray);
};
const updatePermission = async permission => {
  if (permission.length <= 0) {
    return;
  }
  await roleApi.updateRolePermission(currentRole.value.id, permission);
  successMessage("保存成功");
  emit("refresh");
};
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <div class="clearfix">
          <span>菜单列表</span>
          <el-button
            :disabled="!isMenuSave"
            type="primary"
            size="small"
            style="float: right; padding: 6px 9px"
            :icon="useRenderIcon('iconify-fa-check')"
            @click="handlerSave"
            >保存</el-button
          >
        </div>
      </template>
      <el-tree
        class="filter-tree"
        ref="permissionTreeRef"
        node-key="id"
        default-expand-all
        show-checkbox
        highlight-current
        v-model="permissionList"
        :data="menuTreeData"
        :props="treeProps"
      ></el-tree>
    </el-card>
  </div>
</template>

<style scoped></style>
