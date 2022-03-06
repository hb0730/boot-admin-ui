<script lang="ts">
export default {
  name: "JobLogList"
};
</script>
<script setup lang="ts">
import { ElMessageBox } from "element-plus";
import { toRef, PropType, Ref } from "vue";
import { DictEntryCache } from "/@/api/model/system/dict_model";
import { JobLog, JobLogQuery } from "/@/api/model/monitor/job_log_model";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { getDictEntryInfo } from "/@/utils/dict";
const props = defineProps({
  dataList: Array as PropType<JobLog[]>,
  searchInfo: Object as PropType<JobLogQuery>,
  groupOptions: Array as PropType<DictEntryCache[]>
});
const dataList = toRef(props, "dataList");
const searchInfo: Ref<JobLogQuery> = toRef(props, "searchInfo");
const groupOptions = toRef(props, "groupOptions");
const handlerDelete = () => {};
const handlerClean = () => {};
const handlerRefresh = () => {};
const sizeChange = (pageSize: number) => {};
const currentChange = (pageNum: number) => {};
const handleViewError = (data: JobLog) => {
  ElMessageBox({
    title: "异常信息",
    message: data.exceptionInfo,
    dangerouslyUseHTMLString: false,
    showConfirmButton: false,
    customClass: "mod-sys__log-error-view-info"
  }).catch(() => {});
};
</script>

<template>
  <div class="avue-crud__menu">
    <div class="avue-crud__left">
      <el-button
        type="danger"
        size="default"
        :icon="useRenderIcon('fa fa-remove')"
        @click="handlerDelete"
        >删除</el-button
      >
      <el-button
        type="danger"
        size="default"
        :icon="useRenderIcon('iconify-fa-trash')"
        @click="handlerClean"
        >清空</el-button
      >
      <el-button
        size="default"
        type="warning"
        :icon="useRenderIcon('iconify-fa-download')"
        >导出</el-button
      >
    </div>
    <div class="avue-crud__right">
      <el-button
        size="default"
        title="刷新"
        circle
        :icon="useRenderIcon('iconify-fa-refresh')"
        @click="handlerRefresh"
      ></el-button>
    </div>
  </div>
  <el-col :xs="10">
    <el-table
      :data="dataList"
      style="width: 100%"
      size="large"
      ref="userListRef"
      border
      :fit="true"
      :header-cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column
        type="selection"
        sortable
        resizable
        :show-overflow-tooltip="true"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="jobName"
        label="任务名称"
        sortable
        resizable
        :show-overflow-tooltip="true"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="jobGroup"
        label="任务分组"
        sortable
        resizable
        :show-overflow-tooltip="true"
        align="center"
      >
        <template #default="scope">
          {{ getDictEntryInfo(groupOptions, scope.row.jobGroup).label }}
        </template>
      </el-table-column>
      <el-table-column
        prop="invokeTarget"
        label="调用目标"
        sortable
        resizable
        :show-overflow-tooltip="true"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="jobMessage"
        label="日志信息"
        sortable
        resizable
        :show-overflow-tooltip="true"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="开始时间"
        sortable
        resizable
        :show-overflow-tooltip="true"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="status"
        label="任务状态"
        sortable
        resizable
        :show-overflow-tooltip="true"
        align="center"
      >
        <template #default="scope">
          <el-tag
            :type="scope.row.status == 1 ? 'success' : 'danger'"
            disable-transitions
            >{{ scope.row.status == 1 ? "成功" : "失败" }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="错误日志"
        sortable
        resizable
        :show-overflow-tooltip="true"
        align="center"
      >
        <template #default="scope">
          <el-button
            type="text"
            size="small"
            @click="handleViewError(scope.row)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:currentPage="searchInfo.pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="searchInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="searchInfo.total"
      @size-change="sizeChange"
      @current-change="currentChange"
    ></el-pagination>
  </el-col>
</template>

<style scoped></style>
