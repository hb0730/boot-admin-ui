<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { SearchView, TableOpera } from "/@/components/searchTable";
import { dictStoreHook } from "/@/store/modules/dict";
import { loginLogApi } from "/@/api/monitor/login_log";
import { Page } from "/@/api/model/domain";
import { LoginLogModel } from "/@/api/model/monitor/login_log_model";
import { successMessage, warnMessage } from "/@/utils/message";
import { confirm } from "/@/utils/message/box";
import { filterObj, filterDict, convertType } from "/@/utils/utils";
const permission = reactive({
  delete: ["oper:log:delete"],
  clear: ["oper:log:clean"]
});
const searchParam = reactive({
  form: [
    {
      name: "登录账号",
      key: "username",
      use: true,
      type: "input",
      tips: "登录账号"
    },
    {
      name: "登录ip",
      key: "loginIp",
      use: true,
      type: "input",
      tips: "登录ip"
    },
    {
      name: "描述",
      key: "description",
      use: true,
      type: "input",
      tips: "描述"
    },
    {
      name: "状态",
      key: "status",
      use: true,
      type: "select",
      dataList: "statusOptions",
      tips: "状态"
    },
    {
      name: "操作时间",
      key: "dateTimePicker",
      use: true,
      type: "daterange",
      startPlaceholder: "开始日期",
      endPlaceholder: "结束日期",
      format: "YYYY-MM-DD",
      valueFormat: "YYYY-MM-DD"
    }
  ],
  formInfo: {},
  dataSource: {
    statusOptions: [],
    operaOptions: []
  }
});
const tableParam = reactive({
  selection: [],
  loading: false,
  tableColumns: [
    {
      label: "",
      prop: "",
      align: "center",
      sortable: false,
      resizable: true,
      type: "selection",
      showOverflowTooltip: true
    },
    {
      label: "登录账号",
      prop: "username",
      align: "center",
      sortable: true,
      resizable: true,
      type: "txt",
      showOverflowTooltip: true
    },
    {
      label: "登录ip",
      prop: "loginIp",
      align: "center",
      sortable: true,
      resizable: true,
      type: "txt",
      showOverflowTooltip: true
    },
    {
      label: "浏览器",
      prop: "browser",
      align: "center",
      sortable: true,
      resizable: true,
      type: "txt",
      showOverflowTooltip: true
    },
    {
      label: "操作系统",
      prop: "os",
      align: "center",
      sortable: true,
      resizable: true,
      type: "txt",
      showOverflowTooltip: true
    },
    {
      label: "登录状态",
      prop: "status",
      align: "center",
      sortable: true,
      resizable: true,
      type: "tag",
      dataList: "statusOptions",
      showOverflowTooltip: true
    },
    {
      label: "登录信息",
      prop: "message",
      align: "center",
      sortable: true,
      resizable: true,
      type: "txt",
      showOverflowTooltip: true
    },
    {
      label: "登录时间",
      prop: "createTime",
      align: "center",
      sortable: true,
      resizable: true,
      type: "txt",
      showOverflowTooltip: true
    }
  ],
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
  }
});
const handlerSearchForm = data => {
  searchParam.formInfo = data;
};
const handlerSearch = () => {
  loadData(1);
};
const handlerReset = data => {
  searchParam.formInfo = data;
  loadData(1);
};
const getStatusOptions = () => {
  const result = dictStoreHook().getEntry("sys_status");
  searchParam.dataSource.statusOptions = result || [];
};
const getOperaOptions = () => {
  const result = dictStoreHook().getEntry("sys_oper_type");
  searchParam.dataSource.operaOptions = result || [];
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
  loginLogApi
    .page(params)
    .then((res: Page<LoginLogModel[]> | string) => {
      if (res !== "fail") {
        tableParam.tableData = (res as Page<LoginLogModel[]>).records;
        tableParam.pagination.total = Number(
          (res as Page<LoginLogModel[]>).total
        );
      }
    })
    .finally(() => {
      tableParam.loading = false;
    });
};
const getQueryParams = () => {
  const sqp = {};
  const param = Object.assign(sqp, searchParam.formInfo);
  if (
    searchParam.formInfo.dateTimePicker &&
    searchParam.formInfo.dateTimePicker.length > 0
  ) {
    param.dateTimePicker = undefined;
    param.startTime = searchParam.formInfo.dateTimePicker[0] + " 00:00:00";
    param.endTime = searchParam.formInfo.dateTimePicker[1] + " 23:59:59";
  }
  param.pageNum = tableParam.pagination.current;
  param.pageSize = tableParam.pagination.pageSize;
  return filterObj(param);
};
const handlerDelete = () => {
  if (tableParam.selection.length <= 0) {
    warnMessage("请选择");
    return;
  }
  confirm("是否删除选中数据")
    .then(() => {
      let ids: string[] = [];
      tableParam.selection.forEach(item => {
        ids.push(item.id);
      });
      tableParam.loading = true;
      loginLogApi
        .deleteBatch(ids)
        .then(() => {
          successMessage("删除成功");
          loadData(1);
        })
        .finally(() => {
          tableParam.loading = false;
        });
    })
    .catch(() => {});
};
const handleClean = () => {
  confirm("是否清除所有数据")
    .then(() => {
      tableParam.loading = true;
      loginLogApi
        .clean()
        .then(() => {
          successMessage("删除成功");
          loadData(1);
        })
        .finally(() => {
          tableParam.loading = false;
        });
    })
    .catch(() => {});
};
onMounted(() => {
  getStatusOptions();
  getOperaOptions();
  loadData(1);
});
</script>

<template>
  <el-card shadow="never" :span="18">
    <!-- 查询区域 -->
    <search-view
      :search-form-config="searchParam.form"
      :data-source="searchParam.dataSource"
      @get-search-form="handlerSearchForm"
      @search-run="handlerSearch"
      @search-reset="handlerReset"
    />
    <!-- 按钮区域 -->
    <table-opera>
      <template v-slot:opera-left>
        <el-button
          type="danger"
          :icon="useRenderIcon('delete')"
          v-auth="permission.delete"
          @click="handlerDelete"
          >删除</el-button
        >
        <el-button
          type="danger"
          :icon="useRenderIcon('delete')"
          v-auth="permission.clear"
          @click="handleClean"
          >清除</el-button
        >
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
    <!-- table区域 -->
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
            v-if="item.type === 'dict'"
            :prop="item.prop"
            :label="item.label"
            :sortable="item.sortable"
            :resizable="item.resizable"
            :show-overflow-tooltip="item.showOverflowTooltip"
            :align="item.align"
          >
            <!---->
            <template #default="scope">
              {{
                filterDict(
                  searchParam.dataSource[item.dataList],
                  convertType(scope.row[item.prop], item.valueType)
                )?.label
              }}
            </template>
          </el-table-column>
          <!--eslint-disable-next-line-->
          <el-table-column
            v-else-if="item.type === 'tag'"
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
                :type="scope.row[item.prop] === 1 ? 'success' : 'danger'"
                disable-transitions
                >{{
                  filterDict(
                    searchParam.dataSource[item.dataList],
                    scope.row[item.prop].toString()
                  )?.label
                }}</el-tag
              >
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
          >
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
        <!---->
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
  </el-card>
</template>

<style scoped></style>
