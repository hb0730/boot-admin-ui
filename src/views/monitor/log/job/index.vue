<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { dictStoreHook } from "/@/store/modules/dict";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import JobLogList from "./list/index.vue";
import { jobLogApi } from "/@/api/monitor/job_log";
import { JobLog, JobLogQuery } from "/@/api/model/monitor/job_log_model";
import { DictEntryCache } from "/@/api/model/system/dict_model";
import { Page } from "/@/api/model/domain";
const pageData = reactive<{
  searchInfo: JobLogQuery;
  groupOptions: DictEntryCache[];
  isEnabledOptions: DictEntryCache[];
  dataList: JobLog[];
  dateTimePicker: any[];
}>({
  // 检索条件
  searchInfo: {
    jobName: "",
    jobGroup: "",
    status: null,
    startTime: null,
    endTime: null,
    sortColumn: [],
    groupColumn: [],
    pageSize: 10,
    pageNum: 1,
    total: 0
  },
  dataList: [],
  groupOptions: [],
  isEnabledOptions: [],
  dateTimePicker: []
});
const getDict = () => {
  pageData.groupOptions = dictStoreHook().getEntry("sys_job_group");
  pageData.isEnabledOptions = dictStoreHook().getEntry("sys_common_status");
};
const getPage = async () => {
  if (pageData.dateTimePicker && pageData.dateTimePicker.length > 0) {
    pageData.searchInfo.startTime = pageData.dateTimePicker[0] + " 00:00:00";
    pageData.searchInfo.endTime = pageData.dateTimePicker[1] + " 23:59:59";
  } else {
    pageData.searchInfo.startTime = null;
    pageData.searchInfo.endTime = null;
  }

  const result: Page<JobLog[]> = await jobLogApi.getPage(pageData.searchInfo);
  pageData.dataList = result.records;
  pageData.searchInfo.total = Number(result.total);
};
const handlerSearch = () => {
  pageData.searchInfo.pageNum = 1;
  getPage();
};
onMounted(() => {
  getDict();
  getPage();
});
</script>

<template>
  <div>
    <el-form
      :inline="true"
      :model="pageData.searchInfo"
      class="demo-form-inline"
      size="default"
    >
      <el-form-item>
        <el-input
          v-model="pageData.searchInfo.jobName"
          placeholder="任务名称"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="pageData.searchInfo.jobGroup"
          placeholder="任务分组"
          clearable
        >
          <el-option
            v-for="item in pageData.groupOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="pageData.searchInfo.status"
          placeholder="执行状态"
          clearable
        >
          <el-option
            v-for="item in pageData.isEnabledOptions"
            :key="Number(item.value)"
            :label="item.label"
            :value="Number(item.value)"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="pageData.dateTimePicker"
          type="daterange"
          unlink-panels
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY 年 MM 月 DD 日"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          plain
          size="default"
          :icon="useRenderIcon('iconify-fa-search')"
          @click="handlerSearch"
          >查询
        </el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="2">
      <job-log-list
        :search-info="pageData.searchInfo"
        :data-list="pageData.dataList"
        :group-options="pageData.groupOptions"
      />
    </el-row>
  </div>
</template>

<style scoped></style>
