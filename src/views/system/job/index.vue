<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { SearchView, TableOpera } from "/@/components/searchTable";
import { dictStoreHook } from "/@/store/modules/dict";
import { filterDict, filterObj } from "/@/utils/utils";
import { jobApi } from "/@/api/system/job";
import { Page } from "/@/api/model/domain";
import { Job } from "/@/api/model/monitor/job_model";
import Edit from "./modules/edit.vue";
import { successMessage, warnMessage } from "/@/utils/message";
import { confirm } from "/@/utils/message/box";
import router from "/@/router";
const jobEditRef = ref<InstanceType<typeof Edit>>();
const pageData = reactive({
  permission: {
    add: ["job:add"],
    update: ["job:update"],
    delete: ["job:delete"],
    exec: ["job:exec"],
    jobLog: ["job:log:query"]
  }
});
const searchParam = reactive({
  formInfo: {},
  form: [
    {
      name: "任务名称",
      key: "name",
      use: true,
      type: "input",
      tips: "任务名称查询"
    },
    {
      name: "任务分组",
      key: "group",
      use: true,
      type: "select",
      tips: "任务名称查询",
      dataList: "groupOptions"
    },
    {
      name: "状态",
      key: "isEnabled",
      use: true,
      type: "select",
      tips: "请选择",
      dataList: "enabledOptions"
    }
  ],
  dataSource: {
    enabledOptions: [],
    groupOptions: []
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
      showOverflowTooltip: true
    },
    {
      label: "任务名称",
      prop: "name",
      align: "center",
      sortable: true,
      resizable: true,
      type: "txt",
      width: 120,
      showOverflowTooltip: true
    },
    {
      label: "任务分组",
      prop: "group",
      key: "groupOptions",
      align: "center",
      sortable: true,
      resizable: true,
      type: "select",
      width: 120,
      showOverflowTooltip: true
    },
    {
      label: "调用类",
      prop: "beanName",
      align: "center",
      sortable: true,
      resizable: true,
      type: "txt",
      width: 120,
      showOverflowTooltip: true
    },
    {
      label: "调用方法",
      prop: "beanMethod",
      align: "center",
      sortable: true,
      resizable: true,
      type: "txt",
      width: 120,
      showOverflowTooltip: true
    },
    {
      label: "表达式",
      prop: "cron",
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
const handlerSelectionChange = selection => {
  tableParam.selection = selection;
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
const loadData = (page?: Number) => {
  if (page === 1) {
    tableParam.pagination.current = 1;
  }
  const params = getQueryParams();
  tableParam.loading = true;
  jobApi
    .page(params)
    .then((res: Page<Job[]> | string) => {
      if (res !== "fail") {
        tableParam.tableData = (res as Page<Job[]>).records;
        tableParam.pagination.total = Number((res as Page<Job[]>).total);
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
  const result = dictStoreHook().getEntry("sys_enable");
  searchParam.dataSource.enabledOptions = result || [];
};
const getGroupOptions = () => {
  const result = dictStoreHook().getEntry("sys_job_group");
  searchParam.dataSource.groupOptions = result || [];
};
const sizeChange = (pageSize: number) => {
  tableParam.pagination.pageSize = pageSize;
  loadData();
};
const currentChange = (pageNum: number) => {
  tableParam.pagination.current = pageNum;
  loadData();
};
const handlerEdit = (data?: any) => {
  if (data) {
    jobEditRef.value?.open("edit", data, searchParam.dataSource);
  } else {
    if (tableParam.selection && tableParam.selection.length == 1) {
      jobEditRef.value?.open(
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
  jobEditRef.value?.open("add", null, searchParam.dataSource);
};
const handlerDelete = (data?: any) => {
  if (data) {
    handlerRemove([data.id]);
  } else {
    if (tableParam.selection && tableParam.selection.length > 0) {
      const res = tableParam.selection.map(v => v.id);
      handlerRemove(res);
    } else {
      warnMessage("请正确选择!");
    }
  }
};
const handlerRemove = (ids: string[]) => {
  if (ids && ids.length > 0) {
    confirm("是否删除已选择的数据")
      .then(() => {
        tableParam.loading = true;
        jobApi
          .deleteBatch(ids)
          .then(res => {
            if (res !== "fail") {
              successMessage("删除成功");
              loadData(1);
            }
          })
          .finally(() => (tableParam.loading = false));
      })
      .catch(() => {});
  }
};
const handlerExec = data => {
  confirm("是否立即执行?")
    .then(() => {
      tableParam.loading = true;
      jobApi
        .exec(data.id)
        .then(res => {
          if (res !== "fail") {
            successMessage("执行成功!");
          }
        })
        .finally(() => (tableParam.loading = false));
    })
    .catch(() => {});
};
const handlerLog = () => {
  router.push("/monitor/log/job");
};
onMounted(() => {
  loadData(1);
  getEnableOptions();
  getGroupOptions();
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
    <!-- opera区域 -->
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
        <el-button
          size="default"
          type="info"
          v-auth="pageData.permission.jobLog"
          :icon="useRenderIcon('tickets')"
          @click="handlerLog"
          >日志</el-button
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
                :icon="useRenderIcon('fa-play-circle')"
                @click="handlerExec(scope.row)"
                v-auth="pageData.permission.exec"
                >执行</el-button
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
    </div>
    <edit ref="jobEditRef" @ok="loadData(1)" />
  </el-card>
</template>

<style scoped></style>
