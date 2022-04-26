<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { dictStoreHook } from "/@/store/modules/dict";
import { getDictEntryInfo } from "/@/utils/dict";
import { operLogApi } from "/@/api/monitor/oper_log";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { Page } from "/@/api/model/domain";
import { OperLogModel } from "/@/api/model/monitor/oper_log_model";
import { successMessage, warnMessage } from "/@/utils/message";
import { confirm } from "/@/utils/message/box";
const permission = reactive({
  delete: ["oper:log:delete"],
  clear: ["oper:log:clean"]
});
const pageData = reactive({
  position: "left",
  searchInfo: {
    username: "",
    operType: "",
    description: "",
    status: null,
    startTime: null,
    endTime: null,
    time: [],
    sortColumn: [],
    groupColumn: [],
    pageSize: 10,
    pageNum: 1,
    total: 0
  },
  dateTimePicker: [],
  businessType: [],
  status: [
    { label: "成功", value: 1 },
    { label: "失败", value: 0 }
  ],
  dataList: [],
  selection: []
});
const getDict = () => {
  pageData.businessType = dictStoreHook().getEntry("sys_oper_type");
};
const getPage = async () => {
  if (pageData.dateTimePicker && pageData.dateTimePicker.length > 0) {
    pageData.searchInfo.startTime = pageData.dateTimePicker[0] + " 00:00:00";
    pageData.searchInfo.endTime = pageData.dateTimePicker[1] + " 23:59:59";
  } else {
    pageData.searchInfo.startTime = null;
    pageData.searchInfo.endTime = null;
  }
  const result: Page<OperLogModel[]> = await operLogApi.page(
    pageData.searchInfo
  );
  pageData.dataList = result.records;
  pageData.searchInfo.total = Number(result.total);
};
const handleCurrentChange = (pageNum: number) => {
  pageData.searchInfo.pageNum = pageNum;
  getPage();
};
const handleSizeChange = (pageSize: number) => {
  pageData.searchInfo.pageSize = pageSize;
  getPage();
};
const handleSelectionChange = selection => {
  pageData.selection = selection;
};
const handleRemove = () => {
  if (pageData.selection.length <= 0) {
    warnMessage("请选择");
    return;
  }
  confirm("是否删除选中数据")
    .then(() => {
      let ids: string[] = [];
      pageData.selection.forEach(item => {
        ids.push(item.id);
      });
      operLogApi.deleteBatch(ids).then(() => {
        successMessage("删除成功");
        getPage();
      });
    })
    .catch(() => {});
};
const handleClean = () => {
  confirm("是否清除所有数据")
    .then(() => {
      operLogApi.clean().then(() => {
        successMessage("删除成功");
        getPage();
      });
    })
    .catch(() => {});
};
onMounted(() => {
  getDict();
  getPage();
});
</script>

<template>
  <div>
    <el-form
      ref="searchForm"
      :model="pageData.searchInfo"
      :inline="true"
      :label-position="pageData.position"
    >
      <el-form-item>
        <el-select
          v-model="pageData.searchInfo.operType"
          placeholder="操作类型"
          clearable
        >
          <el-option
            v-for="item in pageData.businessType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="pageData.searchInfo.username"
          placeholder="操作用户"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="pageData.searchInfo.description"
          placeholder="描述"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="pageData.searchInfo.status"
          placeholder="状态"
          clearable
        >
          <el-option
            v-for="item in pageData.status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
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
      </el-form-item>
      <el-form-item>
        <el-button
          plain
          size="default"
          @click="handleCurrentChange(1)"
          :icon="useRenderIcon('iconify-fa-search')"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <el-row :gutter="2">
      <div class="avue-crud__menu">
        <div class="avue-crud__left">
          <el-button
            type="danger"
            size="default"
            :icon="useRenderIcon('iconify-fa-trash')"
            @click="handleRemove"
            v-auth="permission.delete"
            >删除</el-button
          >
          <el-button
            type="danger"
            size="default"
            @click="handleClean"
            :icon="useRenderIcon('iconify-fa-trash')"
            v-auth="permission.clear"
            >清除</el-button
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
            size="small"
            title="刷新"
            circle
            @click="getPage"
            :icon="useRenderIcon('iconify-fa-refresh')"
          />
        </div>
      </div>
      <el-col :xs="10">
        <el-table
          :data="pageData.dataList"
          style="width: 100%"
          ref="operLog"
          border
          size="large"
          :fit="true"
          :header-cell-style="{ 'text-align': 'center' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="expand">
            <template v-slot="props">
              <el-form label-position="right" inline>
                <el-form-item label="请求地址: ">
                  <span>{{ props.row.requestUrl }}</span>
                </el-form-item>
                <el-form-item label="请求方式: ">
                  <span>{{ props.row.requestMethod }}</span>
                </el-form-item>
                <el-form-item label="操作方法: ">
                  <span>{{ props.row.operMethod }}</span>
                </el-form-item>
                <el-form-item label="请求参数: ">
                  <span>{{ props.row.requestParams }}</span>
                </el-form-item>
                <el-form-item label="响应参数: ">
                  <span>{{ props.row.requestResult }}</span>
                </el-form-item>
                <el-form-item label="错误信息: ">
                  <span>{{ props.row.errorMessage }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
            type="selection"
          />
          <el-table-column
            prop="username"
            label="操作人员"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          />
          <el-table-column
            prop="operIp"
            label="操作ip"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          />
          <el-table-column
            prop="businessType"
            label="操作类型"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
            <template #default="scope">{{
              getDictEntryInfo(pageData.businessType, scope.row.operType).label
            }}</template>
          </el-table-column>
          <el-table-column
            prop="description"
            label="描述"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          />
          <el-table-column
            prop="status"
            label="操作状态"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
            <template #default="scope">
              <el-tag
                :type="scope.row.status === 1 ? 'success' : 'danger'"
                disable-transitions
                >{{ scope.row.status == 1 ? "成功" : "失败" }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="操作时间"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          />
        </el-table>
        <el-pagination
          align="left"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageData.searchInfo.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageData.searchInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageData.searchInfo.total"
        />
      </el-col>
    </el-row>
  </div>
</template>

<style scoped></style>
