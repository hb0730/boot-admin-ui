<script setup lang="ts">
import FormSearch from "@/components/opts/form-search.vue";
import TableButtons from "@/components/opts/btns2.vue";
import ConfigEdit from "./modules/config-edit.vue";
import { PureTable } from "@pureadmin/table";
import { reactive, ref } from "vue";
import { configTypeOptions } from "@/constants/constants";
import * as $configApi from "@/api/sys/config";
import { onMounted } from "vue";
import { hasAuth } from "@/router/utils";
import message from "@/utils/message";
const configEditRef = ref();
const pageData: any = reactive({
  permission: {
    query: ["sys:config:query"],
    save: ["sys:config:save"],
    update: ["sys:config:update"],
    del: ["sys:config:del"],
    refreshCache: ["sys:config:refresh"]
  },
  searchParam: {
    searchState: true,
    searchForm: {},
    formFields: [
      {
        type: "select",
        label: "配置类型",
        prop: "type",
        placeholder: "请选择配置类型",
        dataSourceKey: "configTypeOptions",
        options: {
          clearable: true,
          filterable: true,
          keys: {
            prop: "value",
            value: "value",
            label: "label"
          }
        }
      },
      {
        type: "input",
        label: "配置项",
        prop: "code",
        placeholder: "请输入配置项",
        options: {
          clearable: true
        }
      }
    ]
  },
  dataSource: {
    configTypeOptions: configTypeOptions
  },
  btnOpts: {
    size: "small",
    left: [
      {
        key: "add",
        label: "新增",
        type: "primary",
        icon: "ep:plus",
        state: true,
        permission: ["sys:config:save"]
      },
      {
        key: "update",
        label: "修改",
        type: "success",
        icon: "ep:edit",
        state: false,
        permission: ["sys:config:update"]
      }
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
  tableParam: {
    columns: [
      {
        label: "配置类型",
        prop: "typeName"
      },
      {
        label: "配置项",
        prop: "code"
      },
      {
        label: "配置值",
        prop: "value"
      },
      {
        label: "备注",
        prop: "memo"
      },
      {
        label: "创建时间",
        prop: "created"
      },
      {
        label: "更新时间",
        prop: "modified"
      },
      {
        label: "操作",
        fixed: "right",
        slot: "operation"
      }
    ],
    list: [],
    loading: false,
    pagination: {
      pageSize: 10,
      defaultPageSize: 10,
      currentPage: 1,
      background: true,
      total: 0
    }
  }
});
const handleBtnClick = (val: string) => {
  switch (val) {
    case "add":
      configEditRef.value!.open({}, pageData.dataSource, "add");
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
 *  更新搜索表单
 * @param data .
 */
const _updateSearchFormData = (data: any) => {
  pageData.searchParam.searchForm = data;
};
/**
 * 点击搜索按钮
 */
const _searchForm = (data: any) => {
  pageData.searchParam.searchForm = data;
  _loadData();
};
/**
 * 重置
 */
const _resetSearchForm = (data?: any) => {
  pageData.searchParam.searchForm = data;
};
/**
 * 更新搜索表达的状态
 */
const _updateSearchState = () => {
  pageData.searchParam.searchState = !pageData.searchParam.searchState;
};
const handleChangePageSize = (val: any) => {
  pageData.tableParam.pagination.pageSize = val;
  _loadData();
};
const handleChangeCurrentPage = (val: any) => {
  pageData.tableParam.pagination.currentPage = val;
  _loadData();
};
const getQueryParams = () => {
  const sqp = {};
  const param = Object.assign(sqp, pageData.searchParam.searchForm);
  param.current = pageData.tableParam.pagination.currentPage;
  param.size = pageData.tableParam.pagination.pageSize;
  return param;
};
/**
 * 查询数据
 */
const _loadData = (page?: number) => {
  pageData.tableParam.loading = true;
  const query = getQueryParams();
  if (page) {
    query.current = page;
  }
  $configApi
    .queryPage(query)
    .then((res: any) => {
      if (res.success) {
        pageData.tableParam.list = res.result.records;
        pageData.tableParam.pagination.total = Number(res.result.total);
      }
    })
    .finally(() => {
      pageData.tableParam.loading = false;
    });
};
const handleEdit = (row: any) => {
  configEditRef.value!.open(row, pageData.dataSource, "update");
};
const handleDel = (row: any) => {
  message.confirm("是否删除当前数据").then(() => {
    _batchDel([row.id]);
  });
};
const _batchDel = (ids: string[]) => {
  pageData.tableParam.loading = true;
  $configApi
    .delByIds(ids)
    .then((res: any) => {
      if (res.success) {
        message.success("删除成功");
        _loadData();
      }
    })
    .finally(() => {
      pageData.tableParam.loading = false;
    });
};
const handleRefreshCache = (row: any) => {
  message
    .confirm("是否刷新缓存")
    .then(() => {
      _refreshCache(row.id);
    })
    .catch(() => {});
};
const _refreshCache = (id: string) => {
  pageData.tableParam.loading = true;
  $configApi
    .refreshCache(id)
    .then((res: any) => {
      if (res.success) {
        message.success("刷新成功");
        _loadData();
      }
    })
    .finally(() => {
      pageData.tableParam.loading = false;
    });
};
onMounted(() => {
  _loadData();
});
defineOptions({
  name: "SysConfig"
});
</script>

<template>
  <div>
    <el-card :shadow="'never'">
      <template #default>
        <!--form search-->
        <FormSearch
          :show="pageData.searchParam.searchState"
          :size="'default'"
          :form-field="pageData.searchParam.formFields"
          :query-permission="pageData.permission.query"
          :data-source="pageData.dataSource"
          @search-form="_updateSearchFormData"
          @search="_searchForm"
          @reset="_resetSearchForm"
        />
        <table-buttons
          :size="pageData.btnOpts.size"
          :left-btns="pageData.btnOpts.left"
          :right-btns="pageData.btnOpts.right"
          @click="handleBtnClick"
        />
        <pure-table
          :columns="pageData.tableParam.columns"
          :data="pageData.tableParam.list"
          :border="true"
          :stripe="true"
          :loading="pageData.tableParam.loading"
          :pagination="pageData.tableParam.pagination"
          :header-row-class-name="'table-header'"
          @page-current-change="handleChangeCurrentPage"
          @page-size-change="handleChangePageSize"
        >
          <!---->
          <template #operation="{ row }">
            <el-link
              v-show="hasAuth(pageData.permission.update)"
              type="primary"
              @click="handleEdit(row)"
              >编辑</el-link
            >
            <el-divider
              direction="vertical"
              v-show="hasAuth(pageData.permission.refreshCache)"
            />
            <el-link
              v-show="hasAuth(pageData.permission.refreshCache)"
              type="primary"
              @click="handleRefreshCache(row)"
              >刷新缓存</el-link
            >
            <el-divider
              v-show="hasAuth(pageData.permission.del)"
              direction="vertical"
            />
            <el-link
              v-show="hasAuth(pageData.permission.del)"
              type="primary"
              @click="handleDel(row)"
              >删除</el-link
            >
          </template>
        </pure-table>
      </template>
    </el-card>
    <config-edit ref="configEditRef" @confirm="_loadData()" />
  </div>
</template>
