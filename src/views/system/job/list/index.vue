<script lang="ts">
export default {
  name: "JobList"
};
</script>
<script setup lang="ts">
import { toRef, PropType, Ref, reactive } from "vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { Job, JobQuery } from "/@/api/model/monitor/job_model";
import { getDictEntryInfo } from "/@/utils/dict";
import { DictEntryCache } from "/@/api/model/system/dict_model";
import JobEdit from "../edit/index.vue";
import { successMessage, warnMessage } from "/@/utils/message";
import { confirm } from "/@/utils/message/box";
import { jobApi } from "/@/api/system/job";
import router from "/@/router";
const permission = reactive({
  add: ["job:save"],
  edit: ["job:update"],
  delete: ["job:remove"],
  exec: ["job:exec"]
});
const emit = defineEmits<{
  (e: "refresh", pageSize: number, pageNum: number): void;
}>();
const pageData = reactive<{
  selection: Job[];
  isUpdate: boolean;
  dialogVisible: boolean;
  jobInfo: Job;
}>({
  selection: [],
  isUpdate: false,
  dialogVisible: false,
  // job info
  jobInfo: {
    id: "",
    name: "",
    group: "",
    beanName: "",
    beanMethod: "",
    methodParams: "",
    cron: "",
    personInCharge: "",
    email: "",
    isEnabled: 0,
    description: ""
  }
});
const props = defineProps({
  dataList: Array as PropType<Job[]>,
  groupOptions: Array as PropType<DictEntryCache[]>,
  isEnabledOptions: Array as PropType<DictEntryCache[]>,
  searchInfo: Object as PropType<JobQuery>
});
const dataList = toRef(props, "dataList");
const groupOptions = toRef(props, "groupOptions");
const isEnabledOptions = toRef(props, "isEnabledOptions");
const searchInfo: Ref<JobQuery> = toRef(props, "searchInfo");
const sizeChange = (pageSize: number) => {};
const currentChange = (pageNum: number) => {};
const initJobInfo = (data: Job) => {
  if (data) {
    pageData.jobInfo = data;
  } else {
    pageData.jobInfo = {
      id: "",
      name: "",
      group: "",
      beanName: "",
      beanMethod: "",
      methodParams: "",
      cron: "",
      personInCharge: "",
      email: "",
      isEnabled: 0,
      description: ""
    };
  }
};
const handleSelectionChange = val => {
  pageData.selection = val;
};
const handlerEdit = (data: Job) => {
  initJobInfo(data);
  pageData.dialogVisible = true;
  pageData.isUpdate = true;
};
const handlerAddNew = () => {
  initJobInfo(null);
  pageData.dialogVisible = true;
  pageData.isUpdate = false;
};
const handlerUpdate = () => {
  if (pageData.selection.length <= 0) {
    warnMessage("请选择");
  } else if (pageData.selection.length > 1) {
    warnMessage("请选择(有且只有一个)");
  } else {
    handlerEdit(pageData.selection[0]);
  }
};
const handlerExec = (data: Job) => {
  confirm("是否执行")
    .then(async () => {
      await jobApi.exec(data.id);
      successMessage("执行成功");
    })
    .catch(() => {});
};
const handlerDelete = (data: Job) => {
  confirm("是否删除当前数据")
    .then(() => {
      let ids: string[] = [data.id];
      jobDelete(ids);
    })
    .catch(() => {});
};
const handlerDeleteBatch = () => {
  if (pageData.selection.length <= 0) {
    warnMessage("请选择");
    return;
  }
  confirm("是否删除已选择数据")
    .then(() => {
      let ids: string[] = [];
      pageData.selection.forEach(item => {
        ids.push(item.id);
      });
      jobDelete(ids);
    })
    .catch(() => {});
};
const jobDelete = async (ids: string[]) => {
  if (ids.length <= 0) {
    return;
  }
  await jobApi.deleteBatch(ids);
  successMessage("删除成功");
  handlerRefresh();
};
const handlerRefresh = () => {
  pageData.isUpdate = false;
  pageData.dialogVisible = false;
  emit("refresh", searchInfo.value.pageSize, searchInfo.value.pageNum);
};
const handlerOpenLog = () => {
  router.push("/monitor/log/job");
};
</script>

<template>
  <div class="avue-crud__menu">
    <div class="avue-crud__left">
      <el-button
        type="success"
        size="default"
        :icon="useRenderIcon('iconify-plus')"
        @click="handlerAddNew"
        v-auth="permission.add"
        >新增</el-button
      >
      <el-button
        type="primary"
        size="default"
        :icon="useRenderIcon('iconify-edit')"
        @click="handlerUpdate"
        v-auth="permission.edit"
        >修改</el-button
      >
      <el-button
        type="danger"
        size="default"
        :icon="useRenderIcon('iconify-fa-trash')"
        @click="handlerDeleteBatch"
        v-auth="permission.delete"
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
            :icon="useRenderIcon('iconify-fa-upload')"
            >上传</el-button
          >
        </el-upload>
      </button>

      <el-button
        size="default"
        type="warning"
        :icon="useRenderIcon('iconify-fa-download')"
        >导出</el-button
      >
      <el-button
        size="default"
        type="info"
        :icon="useRenderIcon('el:tickets')"
        @click="handlerOpenLog"
        >日志</el-button
      >
    </div>
    <div class="avue-crud__right">
      <el-button
        size="default"
        title="刷新"
        circle
        :icon="useRenderIcon('iconify-fa-refresh')"
        @click="handlerRefresh"
      />
    </div>
  </div>
  <el-col :xs="10">
    <el-table
      :data="dataList"
      style="width: 100%"
      ref="userListRef"
      border
      size="large"
      :fit="true"
      :header-cell-style="{ 'text-align': 'center' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        sortable
        resizable
        :show-overflow-tooltip="true"
        align="center"
        type="selection"
      />
      <el-table-column
        prop="id"
        label="任务编号"
        sortable
        resizable
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        prop="name"
        label="任务名称"
        sortable
        resizable
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        prop="group"
        label="任务分组"
        sortable
        resizable
        :show-overflow-tooltip="true"
        align="center"
      >
        <template #default="scope">
          {{ getDictEntryInfo(groupOptions, scope.row.group).label }}
        </template>
      </el-table-column>
      <el-table-column
        prop="beanName"
        label="调用类"
        sortable
        resizable
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        prop="cron"
        label="执行表达式"
        sortable
        resizable
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        prop="isEnabled"
        label="状态"
        sortable
        resizable
        :show-overflow-tooltip="true"
        align="center"
      >
        <template #default="scope">
          <el-tag
            :type="scope.row.isEnabled == 1 ? 'success' : 'danger'"
            disable-transitions
            >{{
              getDictEntryInfo(isEnabledOptions, scope.row.isEnabled).label
            }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        sortable
        resizable
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        label="操作"
        sortable
        resizable
        :show-overflow-tooltip="true"
        align="center"
      >
        <template v-slot="scope">
          <el-button
            title="修改"
            type="text"
            :icon="useRenderIcon('iconify-fa-edit')"
            @click="handlerEdit(scope.row)"
            v-auth="permission.edit"
            size="small"
          />
          <el-button
            title="立即执行"
            type="text"
            :icon="useRenderIcon('fa fa-play-circle')"
            @click="handlerExec(scope.row)"
            v-auth="permission.exec"
            size="small"
          />
          <el-button
            title="删除"
            type="text"
            :icon="useRenderIcon('iconify-fa-trash')"
            @click="handlerDelete(scope.row)"
            v-auth="permission.delete"
            size="small"
          />
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
    />
  </el-col>
  <job-edit
    :dialog-visible="pageData.dialogVisible"
    :group-options="groupOptions"
    :is-enabled-options="isEnabledOptions"
    :job-info="pageData.jobInfo"
    :is-update="pageData.isUpdate"
    @refresh="handlerRefresh"
  />
</template>

<style scoped></style>
