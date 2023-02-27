<script setup lang="ts">
import FormSearch from "@/components/opts/form-search.vue";
import TableOperation from "@/components/opts/btns.vue";
import { PureTable } from "@pureadmin/table";
import { reactive } from "vue";
const pageData = reactive<any>({
  permission: {
    query: [],
    add: ["menu:save"],
    update: ["menu:update"],
    delete: ["menu:delete"]
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
    }
  ],
  searchForm: {},
  /*按钮 */
  btnOpts: {
    add: {
      show: true,
      state: true,
      permission: ["menu:save"]
    },
    update: {
      show: true,
      state: true,
      permission: ["menu:update"]
    }
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
  // _loadData();
};
/**
 * 重置
 */
const _resetSearchForm = (data?) => {
  pageData.searchForm = data;
};
/**
 * 更新搜索表达的状态
 */
const _updateSearchState = () => {
  pageData.searchState = !pageData.searchState;
};
const handleChangePageSize = (val: any) => {
  console.log("pageSizeChange", val);
};
const handleChangeCurrentPage = (val: any) => {
  console.log("pageCurrentChange", val);
};
/**
 * 查询数据
 */
const _loadData = () => {};
/**
 * 新增
 */
const _handlerAdd = () => {};
defineOptions({ name: "sysRole" });
</script>

<template>
  <el-card :shadow="'never'">
    <template #default>
      <form-search
        :show="pageData.searchState"
        :form-field="pageData.searchField"
        @search-form="_updateSearchFormData"
        @search="_searchForm"
        @reset="_resetSearchForm"
        :query-permission="pageData.permission.query"
      />
      <TableOperation
        :size="'small'"
        :add="pageData.btnOpts.add"
        @click-search="_updateSearchState"
        @click-refresh="_loadData"
        @click-add="_handlerAdd"
      />
      <pure-table
        :columns="pageData.tableParams.columns"
        :data="pageData.tableParams.list"
        :border="true"
        :stripe="true"
        :loading="pageData.tableParams.loading"
        :pagination="pageData.tableParams.pagination"
        :header-row-class-name="'table-header'"
        @page-size-change="handleChangePageSize"
        @page-current-change="handleChangeCurrentPage"
      >
        <template #operation="">
          <el-link type="primary">授权</el-link>
          <el-divider direction="vertical" />
          <el-link type="primary">编辑</el-link>
          <el-divider direction="vertical" />
          <el-link type="primary">删除</el-link>
          <el-divider direction="vertical" />
        </template>
      </pure-table>
    </template>
  </el-card>
</template>

<style scoped></style>
