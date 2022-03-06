<script lang="ts">
export default {
  name: "RoleList"
};
</script>
<script setup lang="ts">
import { toRef, PropType, Ref, onMounted, reactive } from "vue";
import { Role, RoleQuery } from "/@/api/model/system/role_model";
import PermissionTree from "../permission/index.vue";
import RoleEdit from "../edit/index.vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { deptApi } from "/@/api/system/dept";
import { DeptTree } from "/@/api/model/system/dept_model";
import { menuApi } from "/@/api/system/menu";
import { MenuPermissionTree } from "/@/api/model/system/menu_model";
import { successMessage, warnMessage } from "/@/utils/message";
import { roleApi } from "/@/api/system/role";
import { confirm } from "/@/utils/message/box";
const pageData = reactive<{
  selection: any;
  deptTreeData: DeptTree[];
  dialogVisible: boolean;
  position: string;
  isUpdate: boolean;
  isMenuSave: boolean;
  permissionList: MenuPermissionTree[];
  roleInfo: Role;
  currentPermission: string[];
  currentData: Role;
}>({
  selection: [],
  // 组织树
  deptTreeData: [],
  dialogVisible: false,
  position: "left",
  isUpdate: false,
  isMenuSave: false,
  permissionList: [],
  /**角色信息 */
  roleInfo: {
    description: "",
    permissionIds: [],
    id: "",
    name: "",
    code: "",
    sort: 999,
    isEnabled: 0,
    deptIds: []
  },
  currentPermission: [],
  currentData: null
});
const emit = defineEmits<{
  (e: "handlerEdit", v: Role): void;
  (e: "handlerDelete", v: string[]): void;
  (e: "refresh", pageNum: number, pageSize: number): void;
}>();
const props = defineProps({
  roleList: Array as PropType<Role[]>,
  searchInfo: Object as PropType<RoleQuery>
});
const roleList = toRef(props, "roleList");
const searchModel: Ref<RoleQuery> = toRef(props, "searchInfo");
const sizeChange = (pageSize: number) => {};
const currentChange = (pageNum: number) => {};
const initRoleInfo = (data: Role) => {
  if (data) {
    pageData.roleInfo = data;
  } else {
    pageData.roleInfo = {
      description: "",
      permissionIds: [],
      id: "",
      name: "",
      code: "",
      sort: 999,
      isEnabled: 0,
      deptIds: []
    };
  }
};
const getDeptTree = async () => {
  pageData.deptTreeData = await deptApi.getTreDept();
};
const getMenuTree = async () => {
  pageData.permissionList = await menuApi.getMenuPermissionTree();
};
const handleSelectionChange = val => {
  pageData.selection = val;
};
const handlerEdit = (data: Role) => {
  initRoleInfo(data);
  pageData.isUpdate = true;
  pageData.dialogVisible = true;
};
const handlerUpdate = () => {
  if (pageData.selection.length <= 0) {
    warnMessage("请选择");
  } else if (pageData.selection.length > 1) {
    warnMessage("请选择(有且只有一个)");
  } else {
    handlerEdit(pageData.selection[0]);
  }
};
const handleDelete = (data: Role) => {
  confirm("是否删除当前数据")
    .then(() => {
      let ids: string[] = [data.id];
      roleDelete(ids);
    })
    .catch(() => {});
};
const handlerDeleteBatch = () => {
  if (pageData.selection.length <= 0) {
    warnMessage("请选择");
    return;
  }
  confirm("是否删除已选择数据")
    .then(() => {
      let ids: string[] = [];
      pageData.selection.forEach(item => {
        ids.push(item.id);
      });
      roleDelete(ids);
    })
    .catch(() => {});
};
const roleDelete = async (ids: string[]) => {
  if (ids.length <= 0) {
    return;
  }
  await roleApi.deleteBatch(ids);
  successMessage("操作成功");
  handlerEditRefresh();
};
const handlerEditRefresh = () => {
  pageData.dialogVisible = false;
  emit("refresh", searchModel.value.pageNum, searchModel.value.pageSize);
};
const handlerAddNew = () => {
  initRoleInfo(null);
  pageData.isUpdate = false;
  pageData.dialogVisible = true;
  pageData.isMenuSave = false;
};
const roleTableRowClick = (row: Role, column, e) => {
  pageData.currentPermission = row.permissionIds;
  pageData.currentData = row;
  pageData.isMenuSave = true;
};
onMounted(() => {
  getMenuTree();
  getDeptTree();
});
</script>

<template>
  <el-row :gutter="2">
    <div class="avue-crud__menu">
      <div class="avue-crud__left">
        <el-button
          type="success"
          size="small"
          :icon="useRenderIcon('iconify-plus')"
          @click="handlerAddNew"
          >新增</el-button
        >
        <el-button
          type="primary"
          size="small"
          :icon="useRenderIcon('iconify-edit')"
          @click="handlerUpdate"
          >修改</el-button
        >
        <el-button
          type="danger"
          size="small"
          :icon="useRenderIcon('iconify-fa-trash')"
          @click="handlerDeleteBatch"
          >删除</el-button
        >
        <el-button
          size="small"
          type="warning"
          :icon="useRenderIcon('iconify-fa-download')"
          >导出</el-button
        >
      </div>
      <div class="avue-crud__right">
        <el-button
          size="small"
          title="刷新"
          circle
          :icon="useRenderIcon('iconify-fa-refresh')"
          @click="handlerEditRefresh"
        ></el-button>
      </div>
    </div>
  </el-row>
  <el-row>
    <el-col :span="14">
      <el-card shadow="never" :body-style="{ padding: 0 }">
        <template #header>
          <div class="clearfix">
            <span>角色列表</span>
          </div>
          <el-table
            :data="roleList"
            style="width: 100%"
            ref="roleListRef"
            size="large"
            border
            :fit="true"
            highlight-current-row
            :header-cell-style="{ 'text-align': 'center' }"
            @row-click="roleTableRowClick"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              sortable
              resizable
              :show-overflow-tooltip="true"
              align="center"
              type="selection"
            ></el-table-column>
            <el-table-column
              prop="name"
              label="角色名称"
              sortable
              resizable
              :show-overflow-tooltip="true"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="code"
              label="角色标识"
              sortable
              resizable
              :show-overflow-tooltip="true"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="isEnabled"
              label="角色状态"
              sortable
              resizable
              :show-overflow-tooltip="true"
              align="center"
            >
              <template #default="scope">
                <el-tag
                  :type="scope.row.isEnabled === 1 ? 'success' : 'danger'"
                  disable-transitions
                  >{{ scope.row.isEnabled === 1 ? "启用" : "禁用" }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              sortable
              resizable
              :show-overflow-tooltip="true"
              align="center"
            >
              <template #default="scope">
                <el-button
                  title="修改"
                  type="primary"
                  :icon="useRenderIcon('iconify-fa-edit')"
                  @click="handlerEdit(scope.row)"
                  size="small"
                ></el-button>
                <el-button
                  title="删除"
                  type="danger"
                  :icon="useRenderIcon('iconify-fa-trash')"
                  @click="handleDelete(scope.row)"
                  size="small"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-model:currentPage="searchModel.pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="searchModel.pageSize"
            layout="total,sizes, prev, pager, next, jumper"
            :total="searchModel.total"
            @size-change="sizeChange"
            @current-change="currentChange"
          ></el-pagination>
        </template>
      </el-card>
    </el-col>
    <el-col :span="10">
      <permission-tree
        :is-menu-save="pageData.isMenuSave"
        :menu-permission-tree="pageData.permissionList"
        :permission-list="pageData.currentPermission"
        :current-role="pageData.currentData"
        @refresh="handlerEditRefresh"
      ></permission-tree>
    </el-col>
  </el-row>
  <role-edit
    :dept-tree-data="pageData.deptTreeData"
    :dialog-visible="pageData.dialogVisible"
    :is-update="pageData.isUpdate"
    :role-info="pageData.roleInfo"
    @refresh="handlerEditRefresh"
  ></role-edit>
</template>

<style scoped></style>
