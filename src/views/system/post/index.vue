<script setup lang="ts">
import { onMounted, reactive } from "vue";
import PostList from "./list/index.vue";
import { Page } from "/@/api/model/domain";
import { DictEntryCache } from "/@/api/model/system/dict_model";
import { Post, PostQuery } from "/@/api/model/system/post_model";
import { postApi } from "/@/api/system/post";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { dictStoreHook } from "/@/store/modules/dict";

const pageData = reactive<{
  position: string;
  isEnabledOptions: DictEntryCache[];
  postList: Post[];
  searchInfo: PostQuery;
}>({
  position: "left",
  isEnabledOptions: [],
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
  const result: Page<Post[]> = await postApi.page(pageData.searchInfo);
  pageData.postList = result.records;
  pageData.searchInfo.total = Number(result.total);
};
const handlerRefresh = () => {
  getPage();
};
const handlerSearch = () => {
  getPage();
};
const getDict = () => {
  pageData.isEnabledOptions = dictStoreHook().getEntry("sys_common_status");
};
onMounted(() => {
  getPage();
  getDict();
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
      :is-enabled-options="pageData.isEnabledOptions"
      @handler-refresh="handlerRefresh"
    ></post-list>
  </div>
</template>

<style scoped></style>
