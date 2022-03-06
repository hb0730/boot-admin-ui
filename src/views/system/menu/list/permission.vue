<script lang="ts">
export default { name: "PermissionList" };
</script>
<script setup lang="ts">
import { reactive, PropType, toRef, ref, Ref } from "vue";
import { Permission, Query } from "/@/api/model/permission_model";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { successMessage, warnMessage } from "/@/utils/message";
import VueSelectTree from "/@/components/tree-select/index.vue";
import { MenuTree } from "/@/api/model/menu_model";
import type { ElForm, ElTable } from "element-plus";
import { permissionApi } from "/@/api/permission";
import { confirm } from "/@/utils/message/box";

const permissionFormRef = ref<InstanceType<typeof ElForm>>();
const permissionTableRef = ref<InstanceType<typeof ElTable>>();
const isEnabledOptions = reactive([
  { value: 1, label: "启用" },
  { value: 0, label: "禁用" }
]);
const pageData = reactive<{
  position: string;
  dialogVisible: boolean;
  isUpdate: boolean;
  selection: any[];
  permissionInfo: Permission;
  permissionRules: any;
}>({
  position: "left",
  dialogVisible: false,
  isUpdate: false,
  selection: [],
  /**
   * 权限表单信息
   */
  permissionInfo: {
    id: "",
    menuId: "",
    name: "",
    permission: "",
    description: "",
    isEnabled: 0,
    sort: 999
  },
  permissionRules: {
    name: [{ required: true, message: "请输入权限名称", trigger: "blur" }],
    permission: [
      { required: true, message: "请输入权限标识符", trigger: "blur" }
    ],
    menuId: [{ required: true, message: "请选择所属菜单", trigger: "change" }]
  }
});
const props = defineProps({
  treeMenuData: Object as PropType<MenuTree[]>,
  tableData: Object as PropType<Permission[]>,
  searchModel: Object as PropType<Query>
});
const emit = defineEmits<{
  (e: "sizeChange", v: number): void;
  (e: "currentChange", v: number): void;
  (e: "refresh"): void;
}>();
const treeMenuData = toRef(props, "treeMenuData");
const tableData = toRef(props, "tableData");
const searchModel: Ref<Query> = toRef(props, "searchModel");
const sizeChange = (pageSize: number) => {
  emit("sizeChange", pageSize);
};
const currentChange = (pageNum: number) => {
  emit("currentChange", pageNum);
};
const handlerRefreshTable = () => {
  emit("refresh");
};
const handleSelectionChange = val => {
  pageData.selection = val;
};
const initPermissionInfo = (data: Permission) => {
  if (data) {
    pageData.permissionInfo = data;
  } else {
    pageData.permissionInfo = {
      id: "",
      menuId: "",
      name: "",
      permission: "",
      description: "",
      isEnabled: 0,
      sort: 999
    };
  }
};
const handleDialogClose = () => {
  initPermissionInfo(null);
  emit("refresh");
  pageData.dialogVisible = false;
  pageData.isUpdate = false;
};
const handlerAddNew = () => {
  if (searchModel.value.menuId) {
    initPermissionInfo(null);
    pageData.permissionInfo.menuId = searchModel.value.menuId;
    pageData.dialogVisible = true;
    pageData.isUpdate = false;
  } else {
    warnMessage("请选择菜单");
  }
};
const handlerEdit = () => {
  if (pageData.selection.length <= 0) {
    warnMessage("请选择");
  } else if (pageData.selection.length > 1) {
    warnMessage("请选择(有且只有一个)");
  } else {
    initPermissionInfo(pageData.selection[0]);
    pageData.isUpdate = true;
    pageData.dialogVisible = true;
  }
};
const nodeClick = node => {
  if (node) {
    pageData.permissionInfo.menuId = node.id;
  } else {
    pageData.permissionInfo.menuId = undefined;
  }
};
const handlerSave = () => {
  permissionFormRef.value!.validate(async isVaild => {
    if (isVaild) {
      if (pageData.isUpdate) {
        permissionUpdate();
      } else {
        permissionSave();
      }
    } else {
      warnMessage("表单校验失败");
    }
  });
};
const permissionSave = async () => {
  await permissionApi.save(pageData.permissionInfo);
  handleDialogClose();
};
const permissionUpdate = async () => {
  await permissionApi.updateById(
    pageData.permissionInfo.id,
    pageData.permissionInfo
  );
  handleDialogClose();
};
const handlerDelete = () => {
  if (pageData.selection.length <= 0) {
    warnMessage("请选择");
    return;
  } else {
    confirm("是否删除已选择数据")
      .then(() => {
        let ids: string[] = [];
        pageData.selection.forEach(item => {
          ids.push(item.id);
        });
        permissionDelete(ids);
      })
      .catch(() => {});
  }
};
const permissionDelete = async (ids: string[]) => {
  if (ids.length > 0) {
    await permissionApi.deleteBatch(ids);
    successMessage("删除成功");
    emit("refresh");
  } else {
    warnMessage("请选择");
  }
};
</script>

<template>
  <div class="app-container">
    <el-row>
      <div class="avue-crud__menu">
        <div class="avue-crud__left">
          <el-button
            type="success"
            size="small"
            @click="handlerAddNew"
            :icon="useRenderIcon('iconify-plus')"
            >新增</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="handlerEdit"
            :icon="useRenderIcon('iconify-edit')"
            >修改</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="handlerDelete"
            :icon="useRenderIcon('iconify-fa-trash')"
            >删除</el-button
          >
        </div>
        <div class="avue-crud__right">
          <el-button
            size="small"
            title="刷新"
            circle
            :icon="useRenderIcon('iconify-fa-refresh')"
            @click="handlerRefreshTable"
          ></el-button>
        </div>
      </div>
      <el-col>
        <el-table
          :data="tableData"
          ref="permissionTableRef"
          check-strictly
          :highlight-current="true"
          default-expand-all
          style="width: 100%"
          border
          :fit="true"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="permission"
            label="标识"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="isEnabled"
            label="状态"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
            <template #default="scope">
              <el-tag
                :type="scope.row.isEnabled === 1 ? 'success' : 'warning'"
                disable-transitions
                >{{ scope.row.isEnabled === 1 ? "启用" : "禁用" }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="sort"
            label="排序"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
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
      </el-col>
    </el-row>
    <el-dialog
      title="权限信息"
      destroy-on-close
      :destroyOnClose="true"
      v-model="pageData.dialogVisible"
      :before-close="handleDialogClose"
    >
      <el-form
        label-width="auto"
        :model="pageData.permissionInfo"
        :label-position="pageData.position"
        ref="permissionFormRef"
        required-asterisk
        :rules="pageData.permissionRules"
        center
      >
        <el-form-item required label="名称: " prop="name">
          <el-input v-model="pageData.permissionInfo.name" clearable></el-input>
        </el-form-item>
        <el-form-item required label="权限标识: " prop="permission">
          <el-input
            v-model="pageData.permissionInfo.permission"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item required label="所属菜单: " prop="menuId">
          <VueSelectTree
            v-model="pageData.permissionInfo.menuId"
            placeholder="顶级节点"
            :options="treeMenuData"
            @nodeClick="nodeClick"
            style="width: 100%"
          >
          </VueSelectTree>
        </el-form-item>
        <el-form-item label="排序: " prop="sort">
          <el-input-number
            style="width: 100%"
            controls-position="right"
            v-model="pageData.permissionInfo.sort"
            placeholder="排序"
            clearable
          ></el-input-number>
        </el-form-item>
        <el-form-item label="备注: " prop="description">
          <el-input
            type="textarea"
            v-model="pageData.permissionInfo.description"
            placeholder="备注"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="是否启用:" prop="isEnabled">
          <el-radio-group v-model="pageData.permissionInfo.isEnabled">
            <el-radio
              v-for="item in isEnabledOptions"
              :key="Number(item.value)"
              :label="Number(item.value)"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handlerSave" size="default" plain
            >保存</el-button
          >
          <el-button size="default" @click="handleDialogClose" plain
            >取 消</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
