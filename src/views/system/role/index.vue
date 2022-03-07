<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import RoleList from "./list/index.vue";
import { Role, RoleQuery } from "/@/api/model/system/role_model";
import { Page } from "/@/api/model/domain";
import { roleApi } from "/@/api/system/role";
const isEnabledOptions = reactive([
  { label: "启用", value: 1 },
  { label: "禁用", value: 0 }
]);
const pageData = reactive<{
  searchInfo: RoleQuery;
  roleInfo: Role;
  roleList: Role[];
}>({
  searchInfo: {
    sortColumn: [],
    groupColumn: [],
    pageSize: 10,
    pageNum: 1,
    total: 0,
    name: "",
    code: "",
    isEnabled: null
  },
  /**角色信息 */
  roleInfo: {
    id: "",
    name: "",
    code: "",
    sort: 999,
    isEnabled: 0,
    deptIds: [],
    description: "",
    permissionIds: null
  },
  roleList: []
});
const getPage = async () => {
  const result: Page<Role[]> = await roleApi.page(pageData.searchInfo);
  pageData.roleList = result.records;
  pageData.searchInfo.total = Number(result.total);
};
const handlerRefresh = (pageNum: number, pageSize: number) => {
  pageData.searchInfo.pageNum = pageNum;
  pageData.searchInfo.pageSize = pageSize;
  getPage();
};
const handlerSearch = () => {
  pageData.searchInfo.pageNum = 1;
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
      label-position="left"
      size="large"
    >
      <el-form-item>
        <el-input
          v-model="pageData.searchInfo.name"
          placeholder="角色名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="pageData.searchInfo.code"
          placeholder="标识"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="pageData.searchInfo.isEnabled"
          placeholder="是否启用"
          clearable
        >
          <el-option
            v-for="item in isEnabledOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          plain
          :icon="useRenderIcon('iconify-fa-search')"
          @click="handlerSearch"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <role-list
      :role-list="pageData.roleList"
      :search-info="pageData.searchInfo"
      @refresh="handlerRefresh"
    ></role-list>
  </div>
</template>

<style scoped></style>
