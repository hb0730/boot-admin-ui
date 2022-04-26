<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { loginLogApi } from "/@/api/monitor/login_log";
import { Page } from "/@/api/model/domain";
import { LoginLogModel } from "/@/api/model/monitor/login_log_model";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { successMessage, warnMessage } from "/@/utils/message";
import { confirm } from "/@/utils/message/box";
const permission = reactive({
  delete: ["login:log:delete"],
  clear: ["login:log:clean"]
});
const pageData = reactive({
  position: "left",
  searchInfo: {
    username: "",
    loginIp: "",
    status: null,
    startTime: "",
    endTime: "",
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
const getPage = async () => {
  if (pageData.dateTimePicker && pageData.dateTimePicker.length > 0) {
    pageData.searchInfo.startTime = pageData.dateTimePicker[0] + " 00:00:00";
    pageData.searchInfo.endTime = pageData.dateTimePicker[1] + " 23:59:59";
  } else {
    pageData.searchInfo.startTime = null;
    pageData.searchInfo.endTime = null;
  }
  const result: Page<LoginLogModel[]> = await loginLogApi.page(
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
      loginLogApi.deleteBatch(ids).then(() => {
        successMessage("删除成功");
        getPage();
      });
    })
    .catch(() => {});
};
const handleClean = () => {
  confirm("是否清除所有数据")
    .then(() => {
      loginLogApi.clean().then(() => {
        successMessage("删除成功");
        getPage();
      });
    })
    .catch(() => {});
};
onMounted(() => {
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
        <el-input
          v-model="pageData.searchInfo.username"
          placeholder="登录账号"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="pageData.searchInfo.loginIp"
          placeholder="登录ip"
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
          @click="handleCurrentChange(1)"
          size="default"
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
            :icon="useRenderIcon('iconify-fa-refresh')"
            @click="getPage"
          />
        </div>
      </div>
      <el-col :xs="10">
        <el-table
          :data="pageData.dataList"
          style="width: 100%"
          ref="operLog"
          border
          :fit="true"
          size="large"
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
            prop="username"
            label="登录账号"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          />
          <el-table-column
            prop="loginIp"
            label="登录ip"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          />
          <el-table-column
            prop="browser"
            label="浏览器"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          />
          <el-table-column
            prop="os"
            label="操作系统"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          />
          <el-table-column
            prop="status"
            label="登录状态"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
            <template v-slot="scope">
              <el-tag
                :type="scope.row.status === 1 ? 'success' : 'danger'"
                disable-transitions
                >{{ scope.row.status == 1 ? "成功" : "失败" }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="message"
            label="登录信息"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          />
          <el-table-column
            prop="createTime"
            label="登录时间"
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
