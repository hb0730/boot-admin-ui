<script setup lang="ts">
import { onMounted, reactive } from "vue";
import DictParent from "./parent/list/index.vue";
import DictEntryList from "./entry/list/index.vue";
import { Dict } from "/@/api/model/system/dict_model";
import { dictStoreHook } from "/@/store/modules/dict";
const pageData = reactive({
  parentId: null,
  data: null,
  dataSource: {
    enabledOptions: []
  }
});
const getEnableOptions = () => {
  const result = dictStoreHook().getEntry("sys_enable");
  pageData.dataSource.enabledOptions = result || [];
};
const handlerDictClick = (id: string, data: Dict) => {
  pageData.parentId = id;
  pageData.data = data;
};
onMounted(() => {
  getEnableOptions();
});
</script>

<template>
  <el-card shadow="never" :span="18">
    <el-row :gutter="20">
      <dict-parent
        @row-click="handlerDictClick"
        :dataSource="pageData.dataSource"
      />
      <dict-entry-list
        :parent-id="pageData.parentId"
        :dataSource="pageData.dataSource"
        :parent="pageData.data"
      />
    </el-row>
  </el-card>
</template>

<style scoped></style>
