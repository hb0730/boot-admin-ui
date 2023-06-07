<script setup lang="ts">
import FormSearch from "@/components/opts/form-search.vue";
import TableButtons from "@/components/opts/btns2.vue";
import OrgEdit from "./modules/org-edit.vue";
import { PureTable } from "@pureadmin/table";
import { onBeforeMount, reactive } from "vue";
import { enableOptions } from "@/constants/constants";
import * as $orgApi from "@/api/sys/org";
import message from "@/utils/message";
import { onMounted } from "vue";
import { hasAuth } from "@/router/utils";
import { ref } from "vue";
import { computed } from "vue";
const orgEditRef = ref();
const pageData: any = reactive({
  searchState: true,
  searchField: [
    {
      type: "select",
      label: "所属机构",
      prop: "parentId",
      placeholder: "请选择所属机构",
      dataSourceKey: "orgList",
      options: {
        filterable: true,
        keys: {
          prop: "id",
          value: "id",
          label: "name"
        }
      }
    },
    {
      type: "input",
      label: "机构名称",
      prop: "name",
      placeholder: "模糊查询机构名称"
    },
    {
      type: "input",
      label: "机构编码",
      prop: "code",
      placeholder: "精准查询机构编码"
    },
    {
      type: "input",
      label: "联系电话",
      prop: "linkTel",
      placeholder: "模糊查询联系电话"
    },
    {
      type: "select",
      label: "状态",
      prop: "isEnable",
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
    orgList: [],
    enabledOptions: enableOptions
  },
  permission: {
    query: ["org:query"],
    treeQuery: ["org:query:tree"],
    save: "org:save",
    update: "org:update",
    del: "org:del"
  },
  /*按钮 */
  btnOpts: {
    size: "small",
    leftBtns: [
      {
        key: "add",
        label: "新增",
        type: "primary",
        icon: "ep:plus",
        state: true,
        permission: ["org:save"]
      },
      {
        key: "update",
        label: "修改",
        type: "success",
        icon: "ep:edit",
        state: false,
        permission: ["org:update"]
      }
    ],
    rightBtns: [
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
      },
      {
        key: "switch",
        label: "切换",
        icon: "ep:switch",
        state: true,
        options: {
          circle: true
        }
      }
    ]
  },
  // 搜索Data
  searchForm: {},
  // 表格
  tableParams: {
    mode: "table",
    /**
     * table column
     */
    columns: [
      {
        label: "机构编码",
        prop: "code"
      },
      {
        label: "机构名称",
        prop: "name"
      },
      {
        label: "联系人",
        prop: "linkMan"
      },
      {
        label: "联系电话",
        prop: "linkTel"
      },
      {
        label: "所属机构",
        prop: "parentName"
      },
      {
        label: "状态",
        prop: "enable",
        slot: "enableScope"
      },
      {
        label: "创建人",
        prop: "createdBy"
      },
      {
        label: "创建时间",
        prop: "created"
      },
      {
        label: "更新人",
        prop: "modifiedBy"
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
const loadOrgList = () => {
  $orgApi.queryList({ isEnable: 1 }).then(res => {
    if (res.success) {
      pageData.dataSource.orgList = res.result;
    }
  });
};
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
const _loadData = (page?: number) => {
  pageData.tableParams.loading = true;
  const query = getQueryParams();
  if (page) {
    query.current = page;
  }
  if (pageData.tableParams.mode === "table") {
    $orgApi
      .queryPage<any>(query)
      .then(res => {
        if (res.success) {
          pageData.tableParams.list = res.result.records;
          pageData.tableParams.pagination.total = Number(res.result.total);
        } else {
          message.warning(res.message);
          pageData.tableParams.list = [];
          pageData.tableParams.pagination.total = 0;
        }
      })
      .finally(() => {
        pageData.tableParams.loading = false;
      });
  } else {
    $orgApi
      .queryTree<any>(query)
      .then(res => {
        if (res.success) {
          pageData.tableParams.list = res.result;
        } else {
          message.warning(res.message);
        }
      })
      .finally(() => {
        pageData.tableParams.loading = false;
      });
  }
};
/**
 * 按钮点击
 */
const btnClickHandle = (key, _) => {
  switch (key) {
    case "add":
      handleAdd();
      break;
    case "update":
      break;
    case "search":
      pageData.searchState = !pageData.searchState;
      break;
    case "refresh":
      _loadData();
      break;
    case "switch":
      switchTable();
      break;
  }
};
const getPagination = computed((): any => {
  return pageData.tableParams.mode === "table"
    ? { rowKey: "id", pagination: pageData.tableParams.pagination }
    : {
        rowKey: "id",
        pagination: {
          ...pageData.tableParams.pagination,
          hideOnSinglePage: true
        }
      };
});
const switchTable = () => {
  pageData.tableParams.mode =
    pageData.tableParams.mode === "table" ? "tree" : "table";
  pageData.tableParams.pagination.currentPage = 1;
  _loadData();
};

const handleAdd = (row?: any) => {
  const data: any = {};
  if (row) {
    data.parentId = row.id;
  }
  orgEditRef.value!.open(data, pageData.dataSource, "add");
};
/**
 * 编辑
 * @param record .
 */
const handleEdit = (record: any) => {
  orgEditRef.value!.open(record, pageData.dataSource, "edit");
};
/**
 * 删除
 */
const handleDel = (record: any) => {
  message.confirm("确认删除当前数据").then(() => {
    _delete([record.id]);
  });
};
const _delete = (ids: any[]) => {
  if (ids && ids.length > 0) {
    pageData.tableParams.loading = true;
    $orgApi
      .del(ids)
      .then(res => {
        if (res.success) {
          message.success("删除成功");
          _loadData();
        } else {
          message.warning(res.message);
        }
      })
      .finally(() => {
        pageData.tableParams.loading = false;
      });
  }
};
onBeforeMount(() => {
  loadOrgList();
});
onMounted(() => {
  _loadData();
});
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
        :size="pageData.btnOpts.size"
        :left-btns="pageData.btnOpts.leftBtns"
        :right-btns="pageData.btnOpts.rightBtns"
        @click="btnClickHandle"
      />
      <!--table-->
      <pure-table
        :data="pageData.tableParams.list"
        :columns="pageData.tableParams.columns"
        row-key="id"
        border
        stripe
        :header-row-class-name="'table-header'"
        v-bind="getPagination"
        :loading="pageData.tableParams.loading"
      >
        <template #enableScope="scope">
          <el-tag v-if="scope.row.enable">启用</el-tag>
          <el-tag v-else type="info">禁用</el-tag>
        </template>
        <template #operation="{ row }">
          <el-link
            v-show="hasAuth(pageData.permission.save)"
            type="primary"
            @click="handleAdd(row)"
            >新增</el-link
          >
          <el-divider
            v-show="hasAuth(pageData.permission.update) && row.isSystem !== 1"
            direction="vertical"
          />
          <el-link
            v-show="hasAuth(pageData.permission.update) && row.isSystem !== 1"
            type="primary"
            @click="handleEdit(row)"
            >编辑</el-link
          >
          <el-divider
            v-show="hasAuth(pageData.permission.del) && row.isSystem !== 1"
            direction="vertical"
          />
          <el-link
            v-show="hasAuth(pageData.permission.del) && row.isSystem !== 1"
            type="primary"
            @click="handleDel(row)"
            >删除</el-link
          >
        </template>
      </pure-table>
      <org-edit ref="orgEditRef" @confirm="_loadData(1)" />
    </template>
  </el-card>
</template>
