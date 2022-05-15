<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { dictStoreHook } from "/@/store/modules/dict";
import { SearchView, TableOpera } from "/@/components/searchTable";
import { filterDict } from "/@/utils/utils";
import Edit from "./modules/edit.vue";
import { deptApi } from "/@/api/system/dept";
import { warnMessage } from "/@/utils/message";
import { confirm } from "/@/utils/message/box";
const editRef = ref<InstanceType<typeof Edit>>();
const pageData = reactive({
  permission: {
    add: ["dept:save"],
    update: ["dept:save"],
    delete: ["dept:delete"]
  }
});
const searchParams = reactive({
  formInfo: {},
  form: [
    {
      name: "部门名称",
      key: "name",
      use: true,
      type: "input",
      tips: "部门名称查询"
    },
    {
      name: "状态",
      key: "isEnabled",
      use: true,
      type: "select",
      tips: "请选择",
      dataList: "enabledOptions"
    }
  ],
  dataSource: {
    enabledOptions: [],
    deptTree: []
  }
});
const tableParam = reactive({
  tableData: [],
  selectionData: [],
  //遮挡
  loading: false
});
const loadData = async () => {
  tableParam.loading = true;
  const result = await deptApi.getTreeDept(searchParams.formInfo);
  tableParam.loading = false;
  tableParam.tableData = result;
};
const handlerSearchForm = data => {
  searchParams.formInfo = data;
};
const handlerSearch = () => {
  loadData();
};
const handlerReset = data => {
  searchParams.formInfo = data;
  loadData();
};
const handlerSelectionChange = selection => {
  tableParam.selectionData = selection;
};
/**
 * cell 修改
 */
const handlerEdit = (data?: any) => {
  if (data) {
    editRef.value.open("edit", data, searchParams.dataSource);
  } else {
    if (tableParam.selectionData && tableParam.selectionData.length == 1) {
      editRef.value.open(
        "edit",
        tableParam.selectionData[0],
        searchParams.dataSource
      );
    } else {
      warnMessage("请正确选择");
    }
  }
};
const handlerAdd = (data?: any) => {
  if (data) {
    editRef.value.open("add", data, searchParams.dataSource);
  } else {
    if (tableParam.selectionData && tableParam.selectionData.length == 1) {
      editRef.value.open(
        "add",
        tableParam.selectionData[0],
        searchParams.dataSource
      );
    } else if (
      (tableParam.selectionData && tableParam.selectionData.length === 0) ||
      !tableParam.selectionData
    ) {
      editRef.value.open("add", { id: -1 }, searchParams.dataSource);
    } else {
      warnMessage("请正确选择");
    }
  }
};
const handlerDelete = (data?: any) => {
  if (data && data.length > 0) {
    handlerRemove([data.id]);
  } else {
    handlerRemove(tableParam.selectionData.map(v => v.id));
  }
};
const handlerRemove = (ids: string[]) => {
  if (ids && ids.length > 0) {
    confirm("是否删除及其下级部门")
      .then(() => {
        deptApi.deleteBatch(ids).then(res => {
          if (res !== "fail") {
            loadData();
          }
        });
      })
      .catch(() => {});
  } else {
    warnMessage("请选择");
  }
};
/**
 * 字典的启用状态
 */
const getEnableOptions = () => {
  const result = dictStoreHook().getEntry("sys_enable");
  searchParams.dataSource.enabledOptions = result || [];
};
/**
 * 全部的部门树
 */
const getDeptTree = async () => {
  searchParams.dataSource.deptTree = await deptApi.getTreDeptAll();
};
onMounted(() => {
  loadData();
  getDeptTree();
  getEnableOptions();
});
</script>

<template>
  <el-card shadow="never" :span="18">
    <!-- 查询区域 -->
    <search-view
      :search-form-config="searchParams.form"
      :data-source="searchParams.dataSource"
      @get-search-form="handlerSearchForm"
      @search-run="handlerSearch"
      @search-reset="handlerReset"
    />
    <!--opera-->
    <table-opera>
      <template v-slot:opera-left>
        <!---->
        <el-button
          type="primary"
          :icon="useRenderIcon('plus')"
          v-auth="pageData.permission.add"
          @click="handlerAdd()"
          >新增</el-button
        >
        <el-button
          type="success"
          :icon="useRenderIcon('edit')"
          v-auth="pageData.permission.update"
          @click="handlerEdit()"
          >修改</el-button
        >
        <el-button
          type="danger"
          :icon="useRenderIcon('delete')"
          v-auth="pageData.permission.delete"
          @click="handlerDelete()"
          >删除</el-button
        >
        <el-button type="warning" :icon="useRenderIcon('download')"
          >导出</el-button
        >
      </template>
      <template v-slot:opera-right>
        <!---->
        <el-button
          size="default"
          title="刷新"
          circle
          :icon="useRenderIcon('refresh-right')"
          @click="loadData"
        />
      </template>
    </table-opera>
    <!-- table区域 -->
    <div>
      <el-table
        v-loading="tableParam.loading"
        :data="tableParam.tableData"
        row-key="id"
        style="width: 100%"
        border
        @selection-change="handlerSelectionChange"
      >
        <!----->
        <el-table-column type="selection" />
        <el-table-column prop="name" label="部门名称" />
        <el-table-column prop="sort" label="排序" />
        <el-table-column prop="isEnabled" label="状态">
          <template #default="scope">
            <el-tag
              :type="scope.row.isEnabled === 1 ? 'success' : 'danger'"
              disable-transitions
              >{{
                filterDict(
                  searchParams.dataSource.enabledOptions,
                  scope.row.isEnabled.toString()
                )?.label
              }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template v-slot="scope">
            <el-button
              size="small"
              type="text"
              :icon="useRenderIcon('edit')"
              @click="handlerEdit(scope.row)"
              v-auth="pageData.permission.update"
              >修改</el-button
            >
            <el-button
              size="small"
              type="text"
              :icon="useRenderIcon('plus')"
              @click="handlerAdd(scope.row)"
              v-auth="pageData.permission.add"
              >新增</el-button
            >
            <el-button
              type="text"
              size="small"
              :icon="useRenderIcon('delete')"
              v-auth="pageData.permission.delete"
              @click="handlerDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <edit ref="editRef" @ok="loadData" />
  </el-card>
</template>

<style scoped></style>
