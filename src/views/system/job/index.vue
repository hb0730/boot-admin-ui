<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { dictStoreHook } from "/@/store/modules/dict";
import JobList from "./list/index.vue";
import { jobApi } from "/@/api/job";
import { Job, JobQuery } from "/@/api/model/job_model";
import { DictEntryCache } from "/@/api/model/dict_model";
import { Page, Result } from "/@/api/model/domain";
import { warnMessage } from "/@/utils/message";
const pageData = reactive<{
  position: string;
  dataList: Job[];
  searchInfo: JobQuery;
  groupOptions: DictEntryCache[];
  isEnabledOptions: DictEntryCache[];
}>({
  position: "left",
  dataList: [],
  // 检索info
  searchInfo: {
    name: "",
    group: "",
    isEnabled: null,
    sortColumn: [],
    groupColumn: [],
    pageSize: 10,
    pageNum: 1,
    total: 0
  },
  groupOptions: [],
  isEnabledOptions: []
});
const getDict = () => {
  pageData.groupOptions = dictStoreHook().getEntry("sys_job_group");
  pageData.isEnabledOptions = dictStoreHook().getEntry("sys_common_status");
};
const getPage = async () => {
  const result: Result<Page<Job[]>> = await jobApi.page(pageData.searchInfo);
  if (result.code === "0") {
    pageData.dataList = result.data.records;
    pageData.searchInfo.total = Number(result.data.total);
  } else {
    warnMessage(result.message);
  }
};
const handlerRefresh = (pageSize: number, pageNum: number) => {
  pageData.searchInfo.pageNum = pageNum;
  pageData.searchInfo.pageSize = pageSize;
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
    >
      <el-form-item>
        <el-input
          v-model="pageData.searchInfo.name"
          placeholder="任务名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="pageData.searchInfo.group"
          placeholder="任务分组"
          clearable
        >
          <el-option
            v-for="item in pageData.groupOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="pageData.searchInfo.isEnabled"
          placeholder="状态"
          clearable
        >
          <el-option
            v-for="item in pageData.isEnabledOptions"
            :key="Number(item.value)"
            :label="item.label"
            :value="Number(item.value)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          plain
          size="default"
          :icon="useRenderIcon('iconify-fa-search')"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <el-row :gutter="2">
      <job-list
        :data-list="pageData.dataList"
        :search-info="pageData.searchInfo"
        :group-options="pageData.groupOptions"
        :is-enabled-options="pageData.isEnabledOptions"
        @refresh="handlerRefresh"
      ></job-list>
    </el-row>
  </div>
</template>

<style scoped></style>
