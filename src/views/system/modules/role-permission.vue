<script setup lang="ts">
import { reactive, onMounted, ref } from "vue";
import { treeList as permissionTree } from "@/api/sys/permission";
import * as roleApi from "@/api/sys/role";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { Result } from "@/api/base";
import message from "@/utils/message";
import { ElMessageBox, type ElTree } from "element-plus";
const treeRef = ref<InstanceType<typeof ElTree>>();
const pageData: any = reactive({
  isShow: false,
  title: "角色权限",
  treeLoading: false,
  role: {},
  rolePermission: [],
  permissionTree: []
});
const emits = defineEmits(["close", "ok"]);
const open = (role: any) => {
  pageData.role = role;
  loadRolePermission();
  pageData.isShow = true;
};

const handleSelect = (all: boolean) => {
  all
    ? treeRef.value!.setCheckedNodes(pageData.permissionTree)
    : treeRef.value!.setCheckedNodes([]);
};
const handleExpand = (all: boolean) => {
  all
    ? foldAll(pageData.permissionTree, true)
    : foldAll(pageData.permissionTree, false);
};
const foldAll = (data: any, expanded: boolean) => {
  data.forEach((el: any) => {
    const node = treeRef.value!.store.nodesMap[el.id];
    if (node) {
      node.expanded = expanded;
    }
    el.children && el.children.length > 0 ? foldAll(el.children, expanded) : "";
  });
};
const _handleClose = () => {
  pageData.isShow = false;
  emits("close");
};
const handleConfirm = (close?: boolean) => {
  const keys = treeRef.value!.getCheckedKeys(true);
  ElMessageBox.confirm("确认是否更新授权", "更新授权", { type: "warning" })
    .then(() => {
      _updatePermission(keys, close);
    })
    .catch(() => {});
};
const _updatePermission = (permissionIds: any, close?: boolean) => {
  pageData.treeLoading = true;
  roleApi
    .updatePermission(pageData.role.id, permissionIds)
    .then((res: any) => {
      if (res.success) {
        message.success("更新授权成功");
        if (close) {
          _handleClose();
        } else {
          loadRolePermission();
        }
      } else {
        message.warning(res.message);
      }
    })
    .finally(() => {
      pageData.treeLoading = false;
    });
};
onMounted(() => {
  loadPermission();
});
const loadPermission = () => {
  permissionTree<any, any>({ enabled: 1 }).then((res: any) => {
    if (res.success) {
      pageData.permissionTree = res.result;
    }
  });
};
const loadRolePermission = () => {
  pageData.treeLoading = true;
  roleApi
    .queryPermission(pageData.role.id)
    .then((res: Result<string[]>) => {
      if (res.success) {
        pageData.rolePermission = res.result;
        treeRef.value!.setCheckedKeys(res.result);
      } else {
        message.warning(res.message);
      }
    })
    .finally(() => {
      pageData.treeLoading = false;
    });
};
defineExpose({ open });
defineOptions({ name: "RolePermission" });
</script>

<template>
  <el-drawer
    v-model="pageData.isShow"
    destroy-on-close
    modal
    :close-on-click-modal="false"
    :title="pageData.title"
    :before-close="_handleClose"
    class="el-drawer-header"
  >
    <div class="flex flex-col h-full">
      <el-form label-position="top">
        <el-form-item label="所拥有的权限:">
          <el-tree
            ref="treeRef"
            :data="pageData.permissionTree"
            :props="{ label: 'title', children: 'children' }"
            node-key="id"
            show-checkbox
            default-expand-all
            :check-strictly="false"
            style="width: 100%"
            v-loading="pageData.treeLoading"
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="flex justify-between items-center">
        <div class="right">
          <el-dropdown trigger="click" placement="top">
            <el-button>
              批量操作 <component :is="useRenderIcon('ep:arrow-up')"
            /></el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleSelect(true)"
                  >全部勾选</el-dropdown-item
                >
                <el-dropdown-item @click="handleSelect(false)"
                  >取消全部</el-dropdown-item
                >
                <el-dropdown-item @click="handleExpand(true)"
                  >展开所有</el-dropdown-item
                >
                <el-dropdown-item @click="handleExpand(false)"
                  >合并所有</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="left">
          <el-button @click="_handleClose">取消</el-button>
          <el-button type="primary" @click="handleConfirm(false)" plain
            >确认</el-button
          >
          <el-button type="primary" @click="handleConfirm(true)"
            >确认并关闭</el-button
          >
        </div>
      </div>
    </template>
  </el-drawer>
</template>
