<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { SearchView, TableOpera } from "/@/components/searchTable";
import { dictStoreHook } from "/@/store/modules/dict";
import { filterDict, filterObj } from "/@/utils/utils";
import { roleApi } from "/@/api/system/role";
import { Page } from "/@/api/model/domain";
import { Role } from "/@/api/model/system/role_model";
import { menuApi } from "/@/api/system/menu";
import { MenuPermissionTree } from "/@/api/model/system/menu_model";
import { ElTree } from "element-plus";
import { confirm } from "/@/utils/message/box";
import { successMessage, warnMessage } from "/@/utils/message";
import { deptApi } from "/@/api/system/dept";
import { DeptTree } from "/@/api/model/system/dept_model";
import Edit from "./modules/edit.vue";

const permissionTreeRef = ref<InstanceType<typeof ElTree>>();
const roleEditRef = ref<InstanceType<typeof Edit>>();

const pageData = reactive({
  permission: {
    add: ["role:add"],
    edit: ["role:edit"],
    delete: ["role:delete"]
  }
});
const searchParam = reactive({
  formInfo: {},
  form: [
    {
      name: "角色名称",
      key: "name",
      use: true,
      type: "input",
      tips: "角色名称"
    },
    {
      name: "标识",
      key: "code",
      use: true,
      type: "input",
      tips: "标识"
    },
    {
      name: "是否启用",
      key: "isEnabled",
      use: true,
      type: "select",
      dataList: "enabledOptions",
      tips: "是否启用"
    }
  ],
  dataSource: {
    enabledOptions: [],
    deptTree: []
  }
});
const permissionParam = reactive({
  ids: [],
  isSave: false,
  loading: false,
  currentRole: {},
  permissionList: [],
  props: {
    children: "children",
    label: "name"
  }
});
const tableParam = reactive({
  loading: false,
  selection: [],
  tableData: [],
  /* 分页参数 */
  pagination: {
    current: 1,
    pageSize: 10,
    pageSizeOptions: ["10", "20", "50"],
    showTotal: (total, range) => {
      return range[0] + "-" + range[1] + " 共" + total + "条";
    },
    showQuickJumper: true,
    showSizeChanger: true,
    total: 0
  },
  tableColumns: [
    {
      label: "",
      prop: "",
      align: "center",
      sortable: false,
      resizable: true,
      type: "selection",
      width: 120,
      showOverflowTooltip: true
    },
    {
      label: "角色名称",
      prop: "name",
      align: "center",
      sortable: true,
      resizable: true,
      type: "txt",
      width: 120,
      showOverflowTooltip: true
    },
    {
      label: "角色标识",
      prop: "code",
      align: "center",
      sortable: true,
      resizable: true,
      type: "txt",
      width: 120,
      showOverflowTooltip: true
    },
    {
      label: "状态",
      prop: "isEnabled",
      align: "center",
      sortable: true,
      resizable: true,
      type: "tag",
      width: 120,
      showOverflowTooltip: true
    },
    {
      label: "操作",
      prop: "",
      width: 200,
      align: "center",
      sortable: false,
      resizable: true,
      type: "opera",
      showOverflowTooltip: true
    }
  ]
});
const handlerSearchForm = data => {
  searchParam.formInfo = data;
};

const handlerSearch = () => {
  loadData();
};

const handlerReset = data => {
  searchParam.formInfo = data;
  loadData();
};
const handlerSelectionChange = selection => {
  tableParam.selection = selection;
};
const sizeChange = (pageSize: number) => {
  tableParam.pagination.pageSize = pageSize;
  loadData();
};
const currentChange = (pageNum: number) => {
  tableParam.pagination.current = pageNum;
  loadData();
};
const handlerTableRowClick = data => {
  permissionParam.ids = data.permissionIds;
  permissionParam.currentRole = data;
  permissionParam.isSave = true;
};
const loadData = (page?: Number) => {
  if (page === 1) {
    tableParam.pagination.current = 1;
  }
  const params = getQueryParams();
  tableParam.loading = true;
  roleApi
    .page(params)
    .then((res: string | Page<Role[]>) => {
      if (res !== "fail") {
        tableParam.tableData = (res as Page<Role[]>).records;
        tableParam.pagination.total = Number((res as Page<Role[]>).total);
      }
    })
    .finally(() => (tableParam.loading = false));
};
const getQueryParams = () => {
  const sqp = {};
  const param = Object.assign(sqp, searchParam.formInfo);
  param.pageNum = tableParam.pagination.current;
  param.pageSize = tableParam.pagination.pageSize;
  return filterObj(param);
};
const getEnableOptions = () => {
  searchParam.dataSource.enabledOptions =
    dictStoreHook().getEntry("sys_enable");
};
const loadPermission = () => {
  permissionParam.loading = true;
  menuApi
    .getMenuPermissionTree()
    .then((res: string | MenuPermissionTree[]) => {
      if (res !== "fail") {
        permissionParam.permissionList = res as MenuPermissionTree[];
      }
    })
    .finally(() => {
      permissionParam.loading = false;
    });
};
const loadDeptTree = () => {
  deptApi.getTreDeptAll().then((res: string | DeptTree[]) => {
    if (res !== "fail") {
      searchParam.dataSource.deptTree = res as DeptTree[];
    }
  });
};
const handlerSavePermission = () => {
  const menuArray = permissionTreeRef.value!.getCheckedNodes(true, false);
  let permissionArray = menuArray.filter(menu => {
    return menu.isPermission;
  });
  permissionArray = permissionArray.map(permission => {
    return permission.id;
  });
  confirm("是否更新" + permissionParam.currentRole.name + "的权限信息")
    .then(() => {
      permissionParam.loading = true;
      roleApi
        .updateRolePermission(permissionParam.currentRole.id, permissionArray)
        .then(res => {
          if (res !== "fail") {
            successMessage("更新权限成功");
            loadData();
          }
        })
        .finally(() => (permissionParam.loading = false));
    })
    .catch(() => {});
};
const handlerAdd = () => {
  roleEditRef.value?.open("add", null, searchParam.dataSource);
};
const handlerEdit = (data?: any) => {
  if (data) {
    roleEditRef.value?.open("edit", data, searchParam.dataSource);
  } else {
    if (tableParam.selection && tableParam.selection.length == 1) {
      roleEditRef.value?.open(
        "edit",
        tableParam.selection[0],
        searchParam.dataSource
      );
    } else {
      warnMessage("请正确选择");
    }
  }
};
const handlerDelete = (data?: any) => {
  if (data) {
    handlerRemove([data.id]);
  } else {
    if (tableParam.selection && tableParam.selection.length > 0) {
      const ids = tableParam.selection.map(v => v.id);
      handlerRemove(ids);
    } else {
      warnMessage("请正确选择");
    }
  }
};
const handlerRemove = (ids: string[]) => {
  if (ids && ids.length > 0) {
    confirm("是否删除已选择的数据")
      .then(() => {
        tableParam.loading = true;
        roleApi
          .deleteBatch(ids)
          .then(res => {
            if (res !== "fail") {
              successMessage("删除成功");
              loadData(1);
            }
          })
          .finally(() => {
            tableParam.loading = false;
          });
      })
      .catch(() => {});
  }
};
watch(
  () => permissionParam.ids,
  val => {
    if (val && val.length > 0) {
      permissionTreeRef.value?.setCheckedKeys(val);
    } else {
      permissionTreeRef.value!.setCheckedKeys([]);
    }
  }
);
onMounted(() => {
  getEnableOptions();
  loadData(1);
  loadPermission();
  loadDeptTree();
});
</script>

<template>
  <el-card shadow="never" :span="18">
    <search-view
      :search-form-config="searchParam.form"
      :data-source="searchParam.dataSource"
      @get-search-form="handlerSearchForm"
      @search-run="handlerSearch"
      @search-reset="handlerReset"
    />
    <table-opera>
      <template v-slot:opera-left>
        <el-button
          type="primary"
          :icon="useRenderIcon('plus')"
          v-auth="pageData.permission.add"
          @click="handlerAdd"
          >新增</el-button
        >
        <el-button
          type="success"
          :icon="useRenderIcon('edit')"
          v-auth="pageData.permission.edit"
          @click="handlerEdit()"
          >修改</el-button
        >
        <el-button
          type="danger"
          :icon="useRenderIcon('delete')"
          v-auth="pageData.permission.delete"
          @click="handlerDelete()"
          >删除</el-button
        >
        <button class="el-button el-button--default" style="padding: 0 0 0 0px">
          <el-upload
            ref="uploadRef"
            class="upload-demo"
            :multiple="false"
            :show-file-list="false"
            :limit="1"
            action=""
          >
            <el-button
              type="info"
              size="default"
              :icon="useRenderIcon('upload')"
              >上传</el-button
            >
          </el-upload>
        </button>
        <el-button type="warning" :icon="useRenderIcon('download')"
          >导出</el-button
        >
      </template>
      <template v-slot:opera-right>
        <el-button
          size="default"
          title="刷新"
          circle
          :icon="useRenderIcon('refresh-right')"
          @click="loadData(1)"
        />
      </template>
    </table-opera>
    <el-row :gutter="20">
      <el-col :span="18" :xs="24">
        <!--table-->
        <el-table
          :data="tableParam.tableData"
          v-loading="tableParam.loading"
          style="width: 100%"
          row-key="id"
          border
          highlight-current-row
          @row-click="handlerTableRowClick"
          @selection-change="handlerSelectionChange"
        >
          <template v-for="item in tableParam.tableColumns">
            <!--eslint-disable-next-line-->
            <el-table-column
              v-if="item.type === 'tag'"
              :prop="item.prop"
              :label="item.label"
              :sortable="item.sortable"
              :resizable="item.resizable"
              :show-overflow-tooltip="item.showOverflowTooltip"
              :align="item.align"
            >
              <!---->
              <template #default="scope">
                <!---->
                <el-tag
                  :type="scope.row.isEnabled === 1 ? 'success' : 'danger'"
                  disable-transitions
                  >{{
                    filterDict(
                      searchParam.dataSource.enabledOptions,
                      scope.row.isEnabled.toString()
                    )?.label
                  }}</el-tag
                >
              </template>
            </el-table-column>
            <!--eslint-disable-next-line-->
            <el-table-column
              v-else-if="item.type === 'select'"
              :prop="item.prop"
              :label="item.label"
              :sortable="item.sortable"
              :resizable="item.resizable"
              :show-overflow-tooltip="item.showOverflowTooltip"
              :align="item.align"
            >
              <template v-slot="scope">
                {{
                  filterDict(
                    searchParam.dataSource[item.key],
                    scope.row[item.prop]
                  )?.label
                }}
              </template>
            </el-table-column>
            <!--eslint-disable-next-line-->
            <el-table-column
              v-else-if="item.type === 'opera'"
              :prop="item.prop"
              :label="item.label"
              :sortable="item.sortable"
              :resizable="item.resizable"
              :show-overflow-tooltip="item.showOverflowTooltip"
              :align="item.align"
              :width="item.width"
            >
              <!---->
              <template v-slot="scope">
                <el-button
                  size="small"
                  type="text"
                  :icon="useRenderIcon('edit')"
                  v-auth="pageData.permission.edit"
                  @click="handlerEdit(scope.row)"
                  >修改</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  :icon="useRenderIcon('delete')"
                  v-auth="pageData.permission.delete"
                  @click="handlerDelete(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
            <!--eslint-disable-next-line-->
            <el-table-column
              v-else
              :type="item.type"
              :prop="item.prop"
              :label="item.label"
              :sortable="item.sortable"
              :resizable="item.resizable"
              :show-overflow-tooltip="item.showOverflowTooltip"
              :align="item.align"
            />
          </template>
        </el-table>
        <div class="pagination-container">
          <el-pagination
            v-model:currentPage="tableParam.pagination.current"
            :page-sizes="[10, 20, 50, 100]"
            v-model:page-size="tableParam.pagination.pageSize"
            layout="total,sizes, prev, pager, next, jumper"
            background
            v-model:total="tableParam.pagination.total"
            @current-change="currentChange"
            @size-change="sizeChange"
          />
        </div>
      </el-col>
      <el-col :span="6" :xs="24">
        <div class="el-card">
          <div style="margin: 10px">
            <div class="clearfix">
              <span>菜单列表</span>
              <el-button
                type="primary"
                :disabled="!permissionParam.isSave"
                size="small"
                style="float: right; padding: 6px 9px"
                :icon="useRenderIcon('fa-check')"
                @click="handlerSavePermission"
                >保存</el-button
              >
            </div>
            <el-divider border-style="dashed" />
            <el-tree
              v-loading="permissionParam.loading"
              class="filter-tree"
              ref="permissionTreeRef"
              node-key="id"
              show-checkbox
              highlight-current
              v-model="permissionParam.ids"
              :data="permissionParam.permissionList"
              :props="permissionParam.props"
            />
          </div>
        </div>
      </el-col>
    </el-row>
    <edit ref="roleEditRef" @ok="loadData(1)" />
  </el-card>
</template>

<style scoped></style>
