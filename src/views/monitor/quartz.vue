<script setup lang="ts">
import FormSearch from "@/components/opts/form-search.vue";
import TableButtons from "@/components/opts/btns2.vue";
import { PureTable } from "@pureadmin/table";
import QuartzEdit from "./modules/quartz-edit.vue";
import { reactive, ref } from "vue";
import * as $quartzApi from "@/api/monitor/quartz";
import { onMounted } from "vue";
import { hasAuth } from "@/router/utils";
import message from "@/utils/message";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
const quartzEditRef = ref();
const pageData: any = reactive({
  permission: {
    query: ["sys:quartz:job:query"],
    save: ["sys:quartz:job:save"],
    update: ["sys:quartz:job:update"],
    pause: ["sys:quartz:job:pause"],
    resume: ["sys:quartz:job:resume"],
    execute: ["sys:quartz:job:execute"],
    del: ["sys:quartz:job:delete"]
  },
  searchParam: {
    searchState: true,
    formFields: [
      {
        type: "input",
        label: "任务类名",
        prop: "jobClassName",
        placeholder: "请输入任务类名",
        options: {
          clearable: true
        }
      },
      {
        type: "select",
        label: "任务状态",
        prop: "status",
        placeholder: "请选择任务状态",
        dataSourceKey: "statusOptions",
        options: {
          clearable: true,
          filterable: true,
          keys: {
            prop: "value",
            value: "value",
            label: "label"
          }
        }
      }
    ],
    searchForm: {}
  },
  dataSource: {
    statusOptions: [
      { label: "启用", value: 1 },
      { label: "禁用", value: 0 }
    ]
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
        label: "任务类名",
        prop: "jobClassName",
        slot: "ellipsis"
      },
      {
        label: "表达式",
        prop: "cronExpression",
        slot: "ellipsis"
      },
      {
        label: "参数",
        prop: "parameter",
        slot: "ellipsis"
      },
      {
        label: "描述",
        prop: "description",
        slot: "ellipsis"
      },
      {
        label: "状态",
        prop: "status",
        slot: "statusScope"
      },
      {
        label: "创建时间",
        prop: "created",
        slot: "ellipsis"
      },
      {
        label: "更新时间",
        prop: "modified",
        slot: "ellipsis"
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
      quartzEditRef.value!.open({}, pageData.dataSource, "add");
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
  $quartzApi
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
/**
 * 启动
 * @param row .
 */
const handleResume = (row: any) => {
  pageData.tableParam.loading = true;
  $quartzApi
    .resume(row.id)
    .then((res: any) => {
      if (res.success) {
        message.success("启动成功");
        _loadData();
      } else {
        message.warning(res.message);
      }
    })
    .finally(() => {
      pageData.tableParam.loading = false;
    });
};
/**
 * 立即执行
 */
const handleExecute = (row: any) => {
  pageData.tableParam.loading = true;
  $quartzApi
    .execute(row.id)
    .then((res: any) => {
      if (res.success) {
        message.success("执行成功");
        _loadData();
      } else {
        message.warning(res.message);
      }
    })
    .finally(() => {
      pageData.tableParam.loading = false;
    });
};
const handleEdit = (row: any) => {
  quartzEditRef.value!.open(row, pageData.dataSource, "edit");
};
const handleDelete = (row: any) => {
  pageData.tableParam.loading = true;
  $quartzApi
    .delById(row.id)
    .then((res: any) => {
      if (res.success) {
        message.success("删除成功");
        _loadData();
      } else {
        message.warning(res.message);
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
  name: "QuartzList"
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
          <template #ellipsis="{ row, column }">
            <el-tooltip placement="top-start" :content="row[column.property]">{{
              row[column.property]
            }}</el-tooltip>
          </template>
          <template #statusScope="{ row }">
            <el-tag v-if="row.status === 0" class="ml-2" type="danger"
              >停 止</el-tag
            >
            <el-tag v-else class="ml-2" type="success">正 常</el-tag>
          </template>
          <template #operation="{ row }">
            <div class="flex justify-center items-center">
              <el-popconfirm
                title="是否启动选中的任务?"
                @confirm="handleResume(row)"
                confirm-button-text="确定"
                cancel-button-text="取消"
              >
                <template #reference>
                  <el-link
                    v-show="hasAuth(pageData.permission.resume)"
                    type="primary"
                    >启动</el-link
                  >
                </template>
              </el-popconfirm>
              <el-divider
                direction="vertical"
                v-show="hasAuth(pageData.permission.execute)"
              />
              <el-popconfirm
                title="是否立即执行选中的任务?"
                @confirm="handleExecute(row)"
                confirm-button-text="确定"
                cancel-button-text="取消"
              >
                <template #reference>
                  <el-link
                    v-show="hasAuth(pageData.permission.execute)"
                    type="primary"
                    >立即执行</el-link
                  >
                </template>
              </el-popconfirm>
              <el-divider direction="vertical" />
              <el-dropdown>
                <el-link type="primary">
                  更 多
                  <el-icon class="el-icon--right">
                    <component :is="useRenderIcon('ep:arrow-down')" />
                  </el-icon>
                </el-link>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-link
                        v-show="hasAuth(pageData.permission.update)"
                        type="primary"
                        @click="handleEdit(row)"
                        >编 辑</el-link
                      >
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-popconfirm
                        title="是否删除当前任务?"
                        @confirm="handleDelete(row)"
                        confirm-button-text="确定"
                        cancel-button-text="取消"
                      >
                        <template #reference>
                          <el-link
                            v-show="hasAuth(pageData.permission.del)"
                            type="primary"
                            >删 除</el-link
                          >
                        </template>
                      </el-popconfirm>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </pure-table>
      </template>
    </el-card>
    <quartz-edit ref="quartzEditRef" @confirm="_loadData()" />
  </div>
</template>
