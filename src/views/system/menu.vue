<script setup lang="ts">
import FormSearch from "@/components/opts/form-search.vue";
import TableOperation from "@/components/opts/btns.vue";
import MenuEdit from "./modules/menu-edit.vue";
import { reactive, onMounted, ref } from "vue";
import * as permissionApi from "@/api/sys/permission";
import { message } from "@/utils/message";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
const menuEditRef = ref();
const pageData = reactive<any>({
  permission: {
    add: ["menu:save"],
    update: ["menu:update"],
    delete: ["menu:delete"]
  },
  searchState: true,
  /*搜索字段定义 */
  searchField: [
    {
      type: "input",
      label: "菜单名称",
      prop: "title",
      placeholder: "请输入菜单名称"
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
    /*加载 */
    loading: false,
    /*数据 */
    tableData: [],
    currentData: {}
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
const _resetSearchForm = (data?) => {
  pageData.searchForm = data;
};
/**
 * 更新搜索表达的状态
 */
const _updateSearchState = () => {
  pageData.searchState = !pageData.searchState;
};
/**
 * 查询数据
 */
const _loadData = () => {
  pageData.tableParams.loading = true;
  permissionApi
    .treeList(pageData.searchForm)
    .then((res: any) => {
      if (res.success) {
        pageData.tableParams.tableData = res.result;
      } else {
        message(res.message, { type: "warning" });
      }
    })
    .finally(() => {
      pageData.tableParams.loading = false;
    });
};
/**
 * 更新
 * @param data .
 */
const _editMenu = (data: any) => {
  pageData.tableParams.currentData = data;
  menuEditRef.value!.open("update", data, "修改菜单/权限");
};
/**
 * table列新增
 * @param data .
 */
const _handleRowAdd = (data: any) => {
  pageData.tableParams.currentData = data;
  menuEditRef.value!.open("save", { parentId: data.id }, "修改菜单/权限");
};
/**
 * 新增
 */
const _handlerAdd = () => {
  menuEditRef.value!.open("save", {}, "新增菜单/权限");
};
onMounted(() => {
  _loadData();
});
defineOptions({ name: "menu" });
</script>

<template>
  <el-card :shadow="'never'">
    <template #default>
      <!--form search-->
      <FormSearch
        :show="pageData.searchState"
        :size="'default'"
        :form-field="pageData.searchField"
        @search-form="_updateSearchFormData"
        @search="_searchForm"
        @reset="_resetSearchForm"
      />
      <!--operator-->
      <TableOperation
        :size="'small'"
        :add="pageData.btnOpts.add"
        @click-search="_updateSearchState"
        @click-refresh="_loadData"
        @click-add="_handlerAdd"
      />
      <!--table-->
      <el-table
        v-loading="pageData.tableParams.loading"
        :data="pageData.tableParams.tableData"
        style="width: 100%"
        row-key="id"
        highlight-current-row
        header-row-class-name="table-header"
      >
        <el-table-column prop="title" label="菜单名称" width="200" />
        <el-table-column prop="icon" label="菜单图标">
          <template #default="scope">
            <component :is="useRenderIcon(scope.row.icon)" />
          </template>
        </el-table-column>
        <el-table-column prop="rank" label="排序" />
        <el-table-column prop="perms" label="权限标识" min-width="100" />
        <el-table-column prop="component" label="组件路径" min-width="100" />
        <el-table-column prop="keepAlive" label="是否缓存">
          <template #default="scope">
            {{ scope.row.keepAlive ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column prop="showLink" label="是否可见">
          <template #default="scope">
            {{ scope.row.showLink ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column prop="menuTypeName" label="菜单类型" />
        <el-table-column prop="enabled" label="状态">
          <template #default="scope">
            <el-tag v-if="scope.row.enabled">启用</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template #default="scope">
            <el-link type="primary" @click="_editMenu(scope.row)">编辑</el-link>
            <el-divider direction="vertical" />
            <el-link type="primary" @click="_handleRowAdd(scope.row)"
              >新增</el-link
            >
            <el-divider direction="vertical" />
            <el-link type="primary">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <menu-edit ref="menuEditRef" @ok="_loadData()" />
    </template>
  </el-card>
</template>

<style scoped lang="scss">
// :deep(.el-table .el-table__header-wrapper th) {
//   word-break: break-word;
//   background-color: #f8f8f9;
//   color: #515a6e;
//   height: 40px;
//   font-size: 13px;
// }
</style>
