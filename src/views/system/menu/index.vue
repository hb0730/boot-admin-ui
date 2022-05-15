<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { menuApi } from "/@/api/system/menu";
import { Page } from "/@/api/model/domain";
import { Menu, MenuTree } from "/@/api/model/system/menu_model";
import { Permission, Query } from "/@/api/model/system/permission_model";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { warnMessage } from "/@/utils/message";
import { confirm } from "/@/utils/message/box";
import type { ElTree } from "element-plus";

import PermissionList from "./list/permission.vue";
import MenuEdit from "./edit/menu.vue";
import { permissionApi } from "/@/api/system/permission";
import { DictEntryCache } from "/@/api/model/system/dict_model";
import { dictStoreHook } from "/@/store/modules/dict";
const permission = reactive({
  add: ["menu:save"],
  edit: ["menu:update"],
  delete: ["menu:delete"]
});
const treeRef = ref<InstanceType<typeof ElTree>>();
const checkedId = ref("");
const treeProps = {
  children: "children",
  label: "title"
};
const pageData: {
  loading: boolean;
  permissionLoading: boolean;
  isUpdate: boolean;
  isEnabledOptions: DictEntryCache[];
  treeData: MenuTree[];
  menuInfo: Menu;
  position: string;
  searchPermissionInfo: Query;
  permissionList: Permission[];
} = reactive({
  loading: false,
  permissionLoading: false,
  isUpdate: false,
  isEnabledOptions: [],
  treeData: [],
  menuInfo: {
    id: "",
    description: "",
    parentId: "-1",
    external: 0,
    iframe: 0,
    cache: 0,
    hidden: 1,
    i18n: 0,
    showParent: 1,
    title: "",
    enname: "",
    path: "",
    component: "",
    icon: "",
    sort: 999,
    isEnabled: 0
  },
  position: "left",
  permissionList: [],
  /**
   * 权限检索
   */
  searchPermissionInfo: {
    sortColumn: [],
    groupColumn: [],
    pageSize: 10,
    pageNum: 1,
    total: 0
  },
  /**
   * 权限表单信息
   */
  permissionInfo: {
    id: "",
    menuId: "",
    permission: "",
    description: "",
    isEnabled: 0,
    sort: 999
  }
});
const setData = (data?: Menu, isupdate = false) => {
  pageData.isUpdate = isupdate;
  if (data) {
    pageData.menuInfo = data;
  } else {
    pageData.menuInfo = {
      id: null,
      parentId: "-1",
      external: 0,
      iframe: 0,
      cache: 0,
      hidden: 1,
      i18n: 0,
      showParent: 1,
      title: null,
      enname: "",
      path: "",
      component: "",
      icon: "",
      description: "",
      sort: 999,
      isEnabled: 0
    };
  }
};
const getMenuTree = () => {
  pageData.loading = true;
  menuApi
    .getMenuTree()
    .then((res: string | MenuTree[]) => {
      if (res !== "fail") {
        pageData.treeData = res as MenuTree[];
      }
    })
    .finally(() => {
      pageData.loading = false;
    });
};
const getMenuPermission = async (id: string) => {
  pageData.permissionLoading = true;
  permissionApi
    .getMenuPermission(id, pageData.searchPermissionInfo)
    .then((res: string | Page<Permission[]>) => {
      if (res !== "fail") {
        pageData.permissionList = (res as Page<Permission[]>).records;
        pageData.searchPermissionInfo.total = Number(
          (res as Page<Permission[]>).total
        );
      }
    })
    .finally(() => {
      pageData.permissionLoading = false;
    });
};
const handleNodeChangeCheckEvent = (data, checked: boolean) => {
  if (checked) {
    checkedId.value = data.id;
    treeRef.value!.setCheckedKeys([data.id], false);
    getMenuPermission(data.id);
    setData(data, true);
    pageData.searchPermissionInfo.menuId = data.id;
  } else {
    if (checkedId.value == data.id) {
      treeRef.value!.setCheckedKeys([data.id], false);
    }
    pageData.searchPermissionInfo.menuId = undefined;
  }
};
const addNew = () => {
  setData(null, false);
  const ids = treeRef.value!.getCheckedKeys();
  if (ids.length != 0) {
    pageData.menuInfo.parentId = ids[0].toString();
  }
};
const handlerDelete = () => {
  const ids = treeRef.value!.getCheckedKeys();
  if (ids.length != 0) {
    confirm("是否删除")
      .then(() => {
        deleteById(ids[0].toString());
      })
      .catch(() => {});
  } else {
    warnMessage("请选择");
  }
};
const deleteById = async (id: string) => {
  await menuApi.deleteById(id);
  await getMenuTree();
  setData(null, false);
};
const handlerNewSaveSuccess = async () => {
  await getMenuTree();
};
const sizeChange = (pageSize: number) => {
  const ids = treeRef.value!.getCheckedKeys();
  if (ids.length != 0) {
    pageData.searchPermissionInfo.pageSize = pageSize;
    getMenuPermission(ids[0].toString());
  }
};
const currentChange = (pageNum: number) => {
  const ids = treeRef.value!.getCheckedKeys();
  if (ids.length != 0) {
    pageData.searchPermissionInfo.pageNum = pageNum;
    getMenuPermission(ids[0].toString());
  }
};
const refreshTable = () => {
  const ids = treeRef.value!.getCheckedKeys();
  if (ids.length != 0) {
    getMenuPermission(ids[0].toString());
  }
};
const handlerPermissionSearch = () => {
  const ids = treeRef.value!.getCheckedKeys();
  if (ids.length != 0) {
    pageData.searchPermissionInfo.pageNum = 1;
    getMenuPermission(ids[0].toString());
  }
};
const getDict = () => {
  pageData.isEnabledOptions = dictStoreHook().getEntry("sys_enable");
};
onMounted(() => {
  getMenuTree();
  getDict();
});
</script>

<template>
  <el-card shadow="never" :span="18">
    <el-row :gutter="20">
      <el-col :span="6">
        <div>
          <div style="margin: 10px">
            <el-button
              type="primary"
              :icon="useRenderIcon('iconify-plus')"
              @click="addNew"
              plain
              v-auth="permission.add"
              >新增</el-button
            >
            <el-button
              type="danger"
              :icon="useRenderIcon('iconify-delete')"
              @click="handlerDelete"
              plain
              v-auth="permission.delete"
              >删除</el-button
            >
          </div>
          <el-tree
            v-loading="pageData.loading"
            :data="pageData.treeData"
            :props="treeProps"
            node-key="id"
            show-checkbox
            ref="treeRef"
            check-strictly
            :highlight-current="true"
            :expand-on-click-node="true"
            default-expand-all
            @check-change="handleNodeChangeCheckEvent"
          />
        </div>
      </el-col>
      <el-col :span="8">
        <menuEdit
          :tree-menu="pageData.treeData"
          :is-update="pageData.isUpdate"
          :menu-info="pageData.menuInfo"
          :position="pageData.position"
          :is-enabled-options="pageData.isEnabledOptions"
          @new-save-success="handlerNewSaveSuccess"
        />
      </el-col>
      <el-col :span="10">
        <el-card shadow="never">
          <el-row>
            <el-col>
              <el-form
                :inline="true"
                size="small"
                :model="pageData.searchPermissionInfo"
              >
                <el-form-item label="标识">
                  <el-input
                    v-model="pageData.searchPermissionInfo.permission"
                    clearable
                    placeholder="标识"
                  />
                </el-form-item>
                <el-form-item label="名称">
                  <el-input
                    v-model="pageData.searchPermissionInfo.name"
                    clearable
                    placeholder="名称"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    size="small"
                    plain
                    @click="handlerPermissionSearch"
                    :icon="useRenderIcon('iconify-fa-search')"
                    >搜索</el-button
                  >
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>

          <permissionList
            :loading="pageData.permissionLoading"
            :table-data="pageData.permissionList"
            :search-model="pageData.searchPermissionInfo"
            :tree-menu-data="pageData.treeData"
            :is-enabled-options="pageData.isEnabledOptions"
            @current-change="currentChange"
            @size-change="sizeChange"
            @refresh="refreshTable"
          />
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<style scoped></style>
