<script setup lang="ts">
import { onMounted, reactive } from "vue";
import PostList from "./list/index.vue";
import { Page, Result } from "/@/api/model/domain";
import { Post, PostQuery } from "/@/api/model/post_model";
import { postApi } from "/@/api/post";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { warnMessage } from "/@/utils/message";
const isEnabledOptions = reactive([
  { value: 1, label: "启用" },
  { value: 0, label: "禁用" }
]);

const pageData = reactive<{
  position: string;
  postList: Post[];
  searchInfo: PostQuery;
}>({
  position: "left",
  postList: [],
  searchInfo: {
    sortColumn: [],
    groupColumn: [],
    pageSize: 10,
    pageNum: 1,
    total: 0,
    number: "",
    name: "",
    isEnabled: null
  }
});
const getPage = async () => {
  const result: Result<Page<Post[]>> = await postApi.getPage(
    pageData.searchInfo
  );
  if (result.code === "0") {
    pageData.postList = result.data.records;
    pageData.searchInfo.total = Number(result.data.total);
  } else {
    warnMessage(result.message);
  }
};
const handlerRefresh = () => {
  getPage();
};
const handlerSearch = () => {
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
      size="large"
      :inline="true"
      :label-position="pageData.position"
    >
      <el-form-item>
        <el-input
          v-model="pageData.searchInfo.number"
          placeholder="岗位编码"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="pageData.searchInfo.name"
          placeholder="岗位名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="pageData.searchInfo.isEnabled"
          placeholder="岗位状态"
          clearable
        >
          <el-option
            v-for="item in isEnabledOptions"
            :key="Number(item.value)"
            :label="item.label"
            :value="Number(item.value)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          plain
          size="large"
          :icon="useRenderIcon('iconify-fa-search')"
          @click="handlerSearch"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <post-list
      :post-list="pageData.postList"
      :search-model="pageData.searchInfo"
      @handler-refresh="handlerRefresh"
    ></post-list>
  </div>
</template>

<style scoped></style>
