<script setup lang="ts">
import FormSearch from "@/components/opts/form-search.vue";
import TableButtons from "@/components/opts/btns2.vue";
import MenuEdit from "./modules/menu-edit.vue";
import { reactive, onMounted, ref } from "vue";
import * as permissionApi from "@/api/sys/permission";
import { message } from "@/utils/message";
import { PureTable } from "@pureadmin/table";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { hasAuth } from "@/router/utils";
const menuEditRef = ref();
const pageData: any = reactive({
  permission: {
    query: ["menu:query"],
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
    // add: {
    //   show: true,
    //   state: true,
    //   permission: ["menu:save"]
    // },
    // update: {
    //   show: true,
    //   state: true,
    //   permission: ["menu:update"]
    // }
    size: "small",
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
    /*加载 */
    loading: false,
    /*数据 */
    list: [],
    columns: [
      {
        label: "菜单名称",
        prop: "title"
      },
      {
        label: "菜单图标",
        prop: "icon",
        slot: "iconScope"
      },
      {
        label: "权限标识",
        prop: "perms"
      },
      {
        label: "是否缓存",
        prop: "keepAlive",
        slot: "booleanScope"
      },
      {
        label: "是否可见",
        prop: "showLink",
        slot: "booleanScope"
      },
      {
        label: "菜单类型",
        prop: "menuTypeName"
      },
      {
        label: "状态",
        prop: "enabled",
        slot: "enabledScope"
      },
      {
        label: "操作",
        fixed: "right",
        slot: "operation"
      }
    ],
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
  const query = getQueryParams();
  permissionApi
    .treeList(query)
    .then((res: any) => {
      if (res.success) {
        pageData.tableParams.list = res.result || [];
      } else {
        message(res.message, { type: "warning" });
      }
    })
    .finally(() => {
      pageData.tableParams.loading = false;
    });
};
const getQueryParams = () => {
  const sqp = {};
  const param = Object.assign(sqp, pageData.searchForm);
  return param;
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
defineOptions({ name: "sysMenu" });
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
        :query-permission="pageData.permission.query"
      />
      <!--operator-->
      <!-- <TableOperation
        :size="'small'"
        :add="pageData.btnOpts.add"
        @click-search="_updateSearchState"
        @click-refresh="_loadData"
        @click-add="_handlerAdd"
      /> -->
      <table-buttons
        :size="pageData.btnOpts.size"
        :left-btns="pageData.btnOpts.left"
        :right-btns="pageData.btnOpts.right"
        @click="handleBtnClick"
      />
      <!--table-->
      <pure-table
        :loading="pageData.tableParams.loading"
        :columns="pageData.tableParams.columns"
        :data="pageData.tableParams.list"
        :border="true"
        :stripe="true"
        :header-row-class-name="'table-header'"
        row-key="id"
      >
        <template #booleanScope="scope">
          {{ scope.row.keepAlive ? "是" : "否" }}
        </template>
        <template #iconScope="scope">
          <component :is="useRenderIcon(scope.row.icon)" />
        </template>
        <template #enabledScope="scope">
          <el-tag v-if="scope.row.enabled">启用</el-tag>
          <el-tag v-else type="info">禁用</el-tag>
        </template>
        <template #operation="scope">
          <el-link
            :disabled="!hasAuth(pageData.permission.update)"
            type="primary"
            @click="_editMenu(scope.row)"
            >编辑</el-link
          >
          <el-divider direction="vertical" />
          <el-link
            :disabled="!hasAuth(pageData.permission.add)"
            type="primary"
            @click="_handleRowAdd(scope.row)"
            >新增</el-link
          >
          <el-divider direction="vertical" />
          <el-link
            :disabled="!hasAuth(pageData.permission.delete)"
            type="primary"
            >删除</el-link
          >
        </template>
      </pure-table>

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
