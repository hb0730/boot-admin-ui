<script setup lang="ts">
import { onMounted } from "vue";
import * as $orgApi from "@/api/sys/org";
import { reactive } from "vue";
const pageData = reactive({
  formParam: {
    orgName: ""
  },
  treeParam: {
    loading: false,
    list: [],
    treeProp: {
      label: "name",
      children: "children"
    }
  }
});
const _loadData = () => {
  pageData.treeParam.loading = true;
  const query: any = { name: pageData.formParam.orgName };
  query.isEnable = 1;
  $orgApi
    .queryTree(query)
    .then((res: any) => {
      if (res.success) {
        pageData.treeParam.list = res.result;
      }
    })
    .finally(() => {
      pageData.treeParam.loading = false;
    });
};
const handleNodeClick = (data: any) => {
  emits("switchOrg", data);
};
const handleSearch = (val?: string) => {
  pageData.formParam.orgName = val;
  _loadData();
};
onMounted(() => {
  _loadData();
});
const emits = defineEmits(["switchOrg"]);
defineOptions({
  name: "UserOrgTree"
});
</script>

<template>
  <div>
    <div class="mb-4">
      <el-input
        v-model="pageData.formParam.orgName"
        clearable
        placeholder="根据部门搜索"
        @input="handleSearch"
      />
    </div>
    <el-tree
      :data="pageData.treeParam.list"
      :props="pageData.treeParam.treeProp"
      @node-click="handleNodeClick"
    />
  </div>
</template>
