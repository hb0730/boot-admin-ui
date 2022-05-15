<script setup lang="ts">
import { reactive } from "vue";
import DictParent from "./parent/list/index.vue";
import DictEntryList from "./entry/list/index.vue";
import { Dict } from "/@/api/model/system/dict_model";
const pageData = reactive({
  parentId: null,
  data: null
});
const handlerDictClick = (id: string, data: Dict) => {
  pageData.parentId = id;
  pageData.data = data;
};
</script>

<template>
  <div>
    <el-row>
      <dict-parent @row-click="handlerDictClick" />
      <dict-entry-list :parent-id="pageData.parentId" :parent="pageData.data" />
    </el-row>
  </div>
</template>

<style scoped></style>
