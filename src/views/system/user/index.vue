<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { SearchView, TableOpera } from "/@/components/searchTable";
import { DeptTree } from "/@/api/model/system/dept_model";
import { deptApi } from "/@/api/system/dept";
import { userApi } from "/@/api/system/user";
import { postApi } from "/@/api/system/post";
import { roleApi } from "/@/api/system/role";
import { ElTree } from "element-plus";
import { filterDict, filterObj } from "/@/utils/utils";
import { dictStoreHook } from "/@/store/modules/dict";
import { Page } from "/@/api/model/domain";
import { User } from "/@/api/model/system/user_model";
import Edit from "./modules/edit.vue";
import { Post, PostQuery } from "/@/api/model/system/post_model";
import { Role, RoleQuery } from "/@/api/model/system/role_model";
import { successMessage, warnMessage } from "/@/utils/message";
import { confirm } from "/@/utils/message/box";
const treeRef = ref<InstanceType<typeof ElTree>>();
const userEditRef = ref<InstanceType<typeof Edit>>();
const pageData = reactive({
  permission: {
    add: ["user:add"],
    edit: ["user:edit"],
    delete: ["user:delete"],
    update: ["user:update"],
    resetPassword: ["user:rest:password"]
  }
});
const deptParam = reactive({
  current: "",
  loading: false,
  deptName: "",
  deptTree: [],
  defaultProps: { children: "children", label: "name" }
});
const searchParam = reactive({
  formInfo: {},
  form: [
    {
      name: "用户昵称",
      key: "nickName",
      use: true,
      type: "input",
      tips: "用户昵称"
    },
    {
      name: "用户账号",
      key: "username",
      use: true,
      type: "input",
      tips: "用户账号"
    },
    {
      name: "用户状态",
      key: "isEnabled",
      use: true,
      type: "select",
      dataList: "enabledOptions",
      tips: "用户状态"
    }
  ],
  dataSource: {
    genderOptions: [],
    enabledOptions: [],
    postOptions: [],
    roleOptions: [],
    deptTree: []
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
      label: "用户昵称",
      prop: "nickName",
      align: "center",
      sortable: true,
      resizable: true,
      type: "txt",
      width: 120,
      showOverflowTooltip: true
    },
    {
      label: "用户账号",
      prop: "username",
      align: "center",
      sortable: true,
      resizable: true,
      type: "txt",
      width: 120,
      showOverflowTooltip: true
    },
    {
      label: "手机号",
      prop: "phonenumber",
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
      label: "创建时间",
      prop: "createTime",
      align: "center",
      sortable: true,
      resizable: true,
      type: "txt",
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
// 筛选节点
const filterNode = (value, data): boolean => {
  if (!value) return true;
  return data.name.indexOf(value) !== -1;
};
//节点点击
const handleNodeClick = data => {
  deptParam.current = data.id;
};
/**
 * 部门树
 */
const loadDeptTree = () => {
  deptParam.loading = true;
  deptApi
    .getTreDeptAll()
    .then((res: string | DeptTree[]) => {
      if (res !== "fail") {
        deptParam.deptTree = res as DeptTree[];
        searchParam.dataSource.deptTree = (res as DeptTree[]) || [];
      }
    })
    .finally(() => {
      deptParam.loading = false;
    });
};
/**
 * 岗位
 */
const getPostOptions = () => {
  const query: PostQuery = { isEnabled: 1 };
  postApi.list(query).then((res: string | Post[]) => {
    if (res !== "fail") {
      searchParam.dataSource.postOptions = (res as Post[]) || [];
    }
  });
};
/**
 * 角色
 */
const getRoleOptions = () => {
  const query: RoleQuery = { isEnabled: 1 };
  roleApi.list(query).then((res: string | Role[]) => {
    if (res !== "fail") {
      searchParam.dataSource.roleOptions = (res as Role[]) || [];
    }
  });
};
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
const loadData = (page?: any) => {
  if (page === 1) {
    tableParam.pagination.current = 1;
  }
  const params = getQueryParams();
  tableParam.loading = true;
  userApi
    .page(params)
    .then((res: string | Page<User[]>) => {
      if (res !== "fail") {
        tableParam.tableData = (res as Page<User[]>).records;
        tableParam.pagination.total = Number((res as Page<User[]>).total);
      }
    })
    .finally(() => (tableParam.loading = false));
};
const getQueryParams = () => {
  const sqp = {};
  const param = Object.assign(sqp, searchParam.formInfo);
  param.pageNum = tableParam.pagination.current;
  param.pageSize = tableParam.pagination.pageSize;
  param.deptId = deptParam.current;
  return filterObj(param);
};
const getEnableOptions = () => {
  searchParam.dataSource.enabledOptions =
    dictStoreHook().getEntry("sys_enable");
};
const getGenderOptions = () => {
  searchParam.dataSource.genderOptions =
    dictStoreHook().getEntry("sys_user_gender");
};
const handlerEdit = (data?: any) => {
  if (data) {
    userEditRef.value?.open("edit", data, searchParam.dataSource);
  } else {
    if (tableParam.selection && tableParam.selection.length == 1) {
      userEditRef.value?.open(
        "edit",
        tableParam.selection[0],
        searchParam.dataSource
      );
    } else {
      warnMessage("请正确选择");
    }
  }
};
const handlerAdd = () => {
  userEditRef.value?.open("add", null, searchParam.dataSource);
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
    confirm("是否删除已选择的数据?")
      .then(() => {
        tableParam.loading = true;
        userApi
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
const handlerRestPassword = data => {
  confirm("是否重置" + data.username + "的密码")
    .then(() => {
      tableParam.loading = true;
      userApi
        .restPassword(data.id)
        .then(res => {
          if (res !== "fail") {
            successMessage("重置成功，下次登录生效");
          }
        })
        .finally(() => (tableParam.loading = false));
    })
    .catch(() => {});
};
watch(
  () => deptParam.deptName,
  val => treeRef.value!.filter(val)
);
watch(
  () => deptParam.current,
  () => loadData(1)
);
onMounted(() => {
  getEnableOptions();
  loadDeptTree();
  loadData(1);
  getPostOptions();
  getRoleOptions();
  getGenderOptions();
});
</script>

<template>
  <el-card shadow="never" :span="18">
    <!---->
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <!--部门-->
        <div>
          <el-input
            v-model="deptParam.deptName"
            placeholder="请输入部门名称"
            :prefix-icon="useRenderIcon('search')"
            style="margin-bottom: 20px"
          />
        </div>
        <div>
          <el-tree
            v-loading="deptParam.loading"
            :data="deptParam.deptTree"
            :props="deptParam.defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="treeRef"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <!--用户列表-->
        <search-view
          :search-form-config="searchParam.form"
          :data-source="searchParam.dataSource"
          @get-search-form="handlerSearchForm"
          @search-run="handlerSearch"
          @search-reset="handlerReset"
        />
        <!--查询区域-->
        <table-opera>
          <template v-slot:opera-left>
            <!---->
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
              v-auth="pageData.permission.update"
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
            <button
              class="el-button el-button--default"
              style="padding: 0 0 0 0px"
            >
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
            <!---->
            <el-button
              size="default"
              title="刷新"
              circle
              :icon="useRenderIcon('refresh-right')"
              @click="loadData(1)"
            />
          </template>
        </table-opera>
        <!--操作区域-->
        <div>
          <el-table
            :data="tableParam.tableData"
            v-loading="tableParam.loading"
            style="width: 100%"
            row-key="id"
            border
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
                    v-auth="pageData.permission.update"
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
                  <el-button
                    @click="handlerRestPassword(scope.row)"
                    type="text"
                    :icon="useRenderIcon('fa-key')"
                    v-auth="pageData.permission.resetPassword"
                    size="small"
                    >重置密码</el-button
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
        </div>
      </el-col>
    </el-row>
    <edit ref="userEditRef" @ok="loadData(1)" />
  </el-card>
</template>

<style scoped></style>
