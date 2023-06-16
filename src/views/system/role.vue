<script setup lang="ts">
import FormSearch from "@/components/opts/form-search.vue";
import TableButtons from "@/components/opts/btns2.vue";
import { PureTable } from "@pureadmin/table";
import { hasAuth } from "@/router/utils";
import { enableConvert, enabledBooleanConvert } from "@/constants/convert";
import { enableOptions } from "@/constants/constants";
import * as roleApi from "@/api/sys/role";
import RoleEdit from "./modules/role-edit.vue";
import RolePermission from "./modules/role-permission.vue";
import { reactive, onMounted, ref } from "vue";
const roleEditRef = ref();
const rolePermissionRef = ref();
const pageData: any = reactive({
  permission: {
    query: [],
    add: ["role:save"],
    update: ["role:update"],
    delete: ["role:del"],
    permission: ["role:permission"]
  },
  /**
   * 是否显示搜索
   */
  searchState: true,
  /*搜索字段定义 */
  searchField: [
    {
      type: "input",
      label: "角色编码",
      prop: "roleCode",
      placeholder: "精准查询角色编码"
    },
    {
      type: "input",
      label: "角色名称",
      prop: "roleName",
      placeholder: "模糊查询角色名称"
    },
    {
      type: "select",
      label: "状态",
      prop: "enabled",
      placeholder: "请选择",
      dataSourceKey: "enabledOptions",
      options: {
        keys: {
          label: "label",
          value: "value",
          prop: "value"
        },
        filterable: true
      }
    }
  ],
  dataSource: {
    enabledOptions: enableOptions
  },
  searchForm: {},
  /*按钮 */
  btnOpts: {
    left: [
      {
        key: "add",
        label: "新增",
        type: "primary",
        icon: "ep:plus",
        state: true,
        permission: ["org:save"]
      }
      // {
      //   key: "update",
      //   label: "修改",
      //   type: "success",
      //   icon: "ep:edit",
      //   state: false,
      //   permission: ["org:update"]
      // }
    ],
    right: [
      {
        key: "search",
        label: "查询",
        icon: "ep:search",
        state: true,
        options: {
          circle: true
        }
      },
      {
        key: "refresh",
        label: "刷新",
        icon: "ep:refresh",
        state: true,
        options: {
          circle: true
        }
      }
    ]
  },
  tableParams: {
    /**
     * table column
     */
    columns: [
      {
        label: "角色编码",
        prop: "roleCode"
      },
      {
        label: "角色名称",
        prop: "roleName"
      },
      {
        label: "类型",
        props: "isSystem",
        slot: "roleType"
      },
      {
        label: "状态",
        prop: "enabled",
        slot: "roleEnable"
      },
      {
        label: "创建时间",
        prop: "created"
      },
      {
        label: "操作",
        fixed: "right",
        slot: "operation"
      }
    ],
    /**
     * table data
     */
    list: [],
    /*加载 */
    loading: false,
    /*数据 */
    tableData: [],
    currentData: {},
    pagination: {
      pageSize: 10,
      defaultPageSize: 10,
      currentPage: 1,
      background: true,
      total: 0
    }
  }
});
/**
 *  更新搜索表单
 * @param data .
 */
const _updateSearchFormData = (data: any) => {
  pageData.searchForm = data;
};
/**
 * 点击搜索按钮
 */
const _searchForm = (data: any) => {
  pageData.searchForm = data;
  _loadData();
};
/**
 * 重置
 */
const _resetSearchForm = (data?: any) => {
  pageData.searchForm = data;
};
/**
 * 更新搜索表达的状态
 */
const _updateSearchState = () => {
  pageData.searchState = !pageData.searchState;
};
const handleChangePageSize = (val: any) => {
  pageData.tableParams.pagination.pageSize = val;
  _loadData();
};
const handleChangeCurrentPage = (val: any) => {
  pageData.tableParams.pagination.currentPage = val;
  _loadData();
};
const getQueryParams = () => {
  const sqp = {};
  const param = Object.assign(sqp, pageData.searchForm);
  param.current = pageData.tableParams.pagination.currentPage;
  param.size = pageData.tableParams.pagination.pageSize;
  return param;
};
/**
 * 查询数据
 */
const _loadData = () => {
  pageData.tableParams.loading = true;
  const query = getQueryParams();
  roleApi
    .roleQueryPage(query)
    .then((res: any) => {
      if (res.success) {
        pageData.tableParams.list = res.result.records;
        pageData.tableParams.pagination.total = Number(res.result.total);
      }
    })
    .finally(() => {
      pageData.tableParams.loading = false;
    });
};
const handleBtnClick = (val: String) => {
  switch (val) {
    case "add":
      _handlerAdd();
      break;
    case "update":
      break;
    case "search":
      _updateSearchState();
      break;
    case "refresh":
      _loadData();
      break;
  }
};
/**
 * 新增
 */
const _handlerAdd = () => {
  roleEditRef.value!.open();
};
const handleEdit = (data: any) => {
  roleEditRef.value!.open(data, "修改角色");
};
const handleAuthorize = (row: any) => {
  rolePermissionRef.value!.open(row);
};
onMounted(() => {
  _loadData();
});
defineOptions({ name: "sysRole" });
</script>

<template>
  <el-card :shadow="'never'">
    <template #default>
      <form-search
        :show="pageData.searchState"
        :form-field="pageData.searchField"
        :data-source="pageData.dataSource"
        @search-form="_updateSearchFormData"
        @search="_searchForm"
        @reset="_resetSearchForm"
        :query-permission="pageData.permission.query"
      />
      <table-buttons
        :size="'small'"
        :left-btns="pageData.btnOpts.left"
        :right-btns="pageData.btnOpts.right"
        @click="handleBtnClick"
      />
      <pure-table
        :columns="pageData.tableParams.columns"
        :data="pageData.tableParams.list"
        :border="true"
        :stripe="true"
        :loading="pageData.tableParams.loading"
        :pagination="pageData.tableParams.pagination"
        :header-row-class-name="'table-header'"
        @page-current-change="handleChangeCurrentPage"
        @page-size-change="handleChangePageSize"
      >
        <template #roleType="{ row }">
          <el-tag
            effect="plain"
            :type="enabledBooleanConvert(row.isSystem) ? 'danger' : ''"
            >{{
              enabledBooleanConvert(row.isSystem) ? "内置" : "自定义"
            }}</el-tag
          >
        </template>
        <template #roleEnable="{ row }">
          <el-tag
            effect="plain"
            :type="row.enabled === 1 ? 'success' : 'info'"
            >{{ enableConvert(row.enabled) }}</el-tag
          >
        </template>
        <template #operation="{ row }">
          <el-link
            v-show="
              hasAuth(pageData.permission.permission) && row.isSystem != 1
            "
            type="primary"
            @click="handleAuthorize(row)"
            >授权</el-link
          >
          <el-divider
            v-show="
              hasAuth(pageData.permission.permission) && row.isSystem != 1
            "
            direction="vertical"
          />
          <el-link
            v-show="hasAuth(pageData.permission.update) && row.isSystem !== 1"
            type="primary"
            @click="handleEdit(row)"
            >编辑</el-link
          >
          <el-divider
            v-show="hasAuth(pageData.permission.delete) && row.isSystem !== 1"
            direction="vertical"
          />
          <el-link
            v-show="hasAuth(pageData.permission.delete) && row.isSystem !== 1"
            type="primary"
            >删除</el-link
          >
        </template>
      </pure-table>
      <role-edit ref="roleEditRef" @ok="_loadData" />
      <role-permission ref="rolePermissionRef" />
    </template>
  </el-card>
</template>
