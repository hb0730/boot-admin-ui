<script lang="ts">
export default { name: "DictEntryList" };
</script>
<script setup lang="ts">
import { toRef, reactive, watch, PropType } from "vue";
import { dictEntryApi } from "/@/api/dist_entry";
import { Dict, DictEntry, DictEntryQuery } from "/@/api/model/dict_model";
import { Page } from "/@/api/model/domain";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import DictEntryEdit from "../edit/index.vue";
import { successMessage } from "/@/utils/message";
import { confirm } from "/@/utils/message/box";
const pageData = reactive<{
  entryDataList: DictEntry[];
  isUpdate: boolean;
  dialogVisible: boolean;
  searchEntryInfo: DictEntryQuery;
  dictEntryInfo: DictEntry;
}>({
  entryDataList: [],
  isUpdate: false,
  dialogVisible: false,
  searchEntryInfo: {
    parentId: "",
    sortColumn: [],
    groupColumn: [],
    pageSize: 10,
    pageNum: 1,
    total: 0
  },
  dictEntryInfo: {
    id: "",
    parentId: "",
    name: "",
    value: "",
    sort: 999,
    description: ""
  }
});
const props = defineProps({
  parentId: {
    require: true,
    default: null,
    type: String
  },
  parent: Object as PropType<Dict>
});
const ifAddEntry = toRef(props, "parentId");
const parent = toRef(props, "parent");
const sizeChange = (pageSize: number) => {};
const currentChange = (pageNum: number) => {};
const getPage = async () => {
  const result: Page<DictEntry[]> = await dictEntryApi.getPage(
    pageData.searchEntryInfo
  );
  pageData.entryDataList = result.records;
  pageData.searchEntryInfo.total = Number(result.total);
};
const initDictEntry = (data: DictEntry) => {
  if (data) {
    pageData.dictEntryInfo = data;
  } else {
    pageData.dictEntryInfo = {
      id: "",
      parentId: parent.value.id,
      name: "",
      value: "",
      sort: 999,
      description: ""
    };
  }
};
const handlerAddNew = () => {
  initDictEntry(null);
  pageData.isUpdate = false;
  pageData.dialogVisible = true;
};
const handlerEdit = (data: DictEntry) => {
  initDictEntry(data);
  pageData.isUpdate = true;
  pageData.dialogVisible = true;
};
const handlerRefresh = () => {
  pageData.isUpdate = false;
  pageData.dialogVisible = false;
  getPage();
};
const handlerDelete = (data: DictEntry) => {
  confirm("是否删除当前数据")
    .then(() => {
      handlerDictEntryDelete([data.id]);
    })
    .catch(() => {});
};
const handlerDictEntryDelete = async (ids: string[]) => {
  if (ids.length <= 0) {
    return;
  }
  await dictEntryApi.deleteBatch(ids);
  successMessage("删除成功");
  getPage();
};
watch(
  () => {
    return props.parentId;
  },
  () => {
    if (props.parentId) {
      pageData.searchEntryInfo.parentId = props.parentId;
      getPage();
    }
  }
);
</script>

<template>
  <el-col
    style="padding-left: 5px; padding-right: 5px"
    :xs="24"
    :sm="24"
    :md="14"
    :lg="13"
    :xl="13"
  >
    <el-card>
      <template #header>
        <div class="clearfix">
          <span>字典项列表</span>
          <el-button
            style="float: right; padding: 4px 10px"
            :icon="useRenderIcon('iconify-plus')"
            type="primary"
            :disabled="
              ifAddEntry == null || ifAddEntry == undefined || ifAddEntry == ''
            "
            @click="handlerAddNew"
            >新增</el-button
          >
        </div>
      </template>
      <el-table
        :data="pageData.entryDataList"
        style="width: 100%"
        ref="dictEntryListRef"
        border
        :fit="true"
        highlight-current-row
        :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column
          prop="name"
          label="名称"
          sortable
          resizable
          :show-overflow-tooltip="true"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="value"
          label="值"
          sortable
          resizable
          :show-overflow-tooltip="true"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          sortable
          resizable
          :show-overflow-tooltip="true"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="description"
          label="备注"
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
              title="修改"
              type="primary"
              :icon="useRenderIcon('iconify-fa-edit')"
              @click="handlerEdit(scope.row)"
              size="small"
            ></el-button>
            <el-button
              title="删除"
              type="danger"
              :icon="useRenderIcon('iconify-fa-trash')"
              @click="handlerDelete(scope.row)"
              size="small"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:currentPage="pageData.searchEntryInfo.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageData.searchEntryInfo.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="pageData.searchEntryInfo.total"
        @size-change="sizeChange"
        @current-change="currentChange"
      ></el-pagination>
    </el-card>
  </el-col>
  <dict-entry-edit
    :is-update="pageData.isUpdate"
    :dialog-visible="pageData.dialogVisible"
    :dict-entry-info="pageData.dictEntryInfo"
    :dict-info="parent"
    @refresh="handlerRefresh"
  ></dict-entry-edit>
</template>

<style scoped></style>
