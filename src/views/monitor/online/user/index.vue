<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { userOnlineApi } from "/@/api/monitor/user_online";
import { Page } from "/@/api/model/domain";
import {
  UserOnlineModel,
  UserOnlineQuery
} from "/@/api/model/monitor/user_online_model";
import { warnMessage } from "/@/utils/message";
import { confirm } from "/@/utils/message/box";
const pageData = reactive({
  position: "left",
  searchInfo: {
    username: "",
    ipaddr: ""
  },
  // 分页
  pages: {
    page: 1,
    pageSize: 10,
    total: 0
  },
  userOnlineList: [],
  selection: []
});
const getPage = async () => {
  const result: Page<UserOnlineModel[]> = await userOnlineApi.page<
    Page<UserOnlineModel[]>,
    UserOnlineQuery
  >(pageData.searchInfo);
  pageData.userOnlineList = result.records;
  pageData.pages.total = Number(result.total);
};
const handlerSearch = () => {
  pageData.pages.page = 1;
  pageData.pages.pageSize = 10;
  getPage();
};

const handleSizeChange = (pageSize: number) => {
  pageData.pages.pageSize = pageSize;
};
const handleCurrentChange = (pageNum: number) => {
  pageData.pages.page = pageNum;
};
const handleSelectionChange = selection => {
  pageData.selection = selection;
};
const handleLogout = data => {
  confirm("是否注销当前用户")
    .then(() => {
      let ids: string[] = [data.id];
      logout(ids);
    })
    .catch(() => {});
};
const handlerLogoutBatch = () => {
  if (pageData.selection.length <= 0) {
    warnMessage("请选择");
    return;
  }
  confirm("是否注销已选择用户")
    .then(() => {
      let ids: string[] = [];
      pageData.selection.forEach(item => {
        ids.push(item.tokenId);
      });
      logout(ids);
    })
    .catch(() => {});
};
const logout = async (token: string[]) => {
  if (token.length <= 0) {
    return;
  }
  await userOnlineApi.logoutBatch(token);
  getPage();
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
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="pageData.searchInfo.ipaddr"
          placeholder="登录ip"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          plain
          size="default"
          @click="handlerSearch"
          :icon="useRenderIcon('fa fa-search')"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <el-row :gutter="2">
      <div class="avue-crud__menu">
        <div class="avue-crud__left">
          <el-button
            type="danger"
            @click="handlerLogoutBatch"
            :icon="useRenderIcon('fa fa-sign-out')"
            >强退</el-button
          >
        </div>
        <div class="avue-crud__right"></div>
      </div>
      <el-col :xs="10">
        <el-table
          :data="
            pageData.userOnlineList.slice(
              (pageData.pages.page - 1) * pageData.pages.pageSize,
              pageData.pages.page * pageData.pages.pageSize
            )
          "
          style="width: 100%"
          ref="userOnlineRef"
          size="large"
          border
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
          ></el-table-column>
          <el-table-column
            prop="tokenId"
            label="会话id"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="username"
            label="登录账号"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="ipaddr"
            label="登录ip"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="browser"
            label="浏览器"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="os"
            label="操作系统"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="loginTime"
            label="登录时间"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            label="操作"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
            <template #default="scope">
              <el-button
                size="small"
                @click="handleLogout(scope.row)"
                type="danger"
                plain
                :icon="useRenderIcon('fa fa-sign-out')"
                >强退</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          align="left"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageData.pages.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageData.pages.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageData.pages.total"
        ></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped></style>
