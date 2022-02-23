<script lang="ts">
export default { name: "DictParent" };
</script>
<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { dictApi } from "/@/api/dict";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import DictParentEdit from "../edit/index.vue";
import { Dict, DictQuery } from "/@/api/model/dict_model";
import { Page, Result } from "/@/api/model/domain";
import { successMessage, warnMessage } from "/@/utils/message";
import { confirm } from "/@/utils/message/box";
const emit = defineEmits<{ (e: "rowClick", v: string, data: Dict) }>();
const pageData = reactive<{
  selection: any[];
  dictDataList: Dict[];
  isUpdate: boolean;
  dictDialogVisible: boolean;
  searchInfo: DictQuery;
  dictInfo: Dict;
}>({
  selection: [],
  dictDataList: [],
  isUpdate: false,
  dictDialogVisible: false,
  // 字典检索
  searchInfo: {
    name: "",
    type: "",
    sortColumn: [],
    groupColumn: [],
    pageSize: 10,
    pageNum: 1,
    total: 0
  },
  // 字典信息
  dictInfo: {
    id: "",
    name: "",
    type: "",
    description: ""
  }
});

const sizeChange = (pageSize: number) => {
  pageData.searchInfo.pageSize = pageSize;
  getPage();
};
const currentChange = (pageNum: number) => {
  pageData.searchInfo.pageNum = pageNum;
  getPage();
};
const handlerSearch = () => {
  pageData.searchInfo.pageNum = 1;
  getPage();
};
const getPage = async () => {
  const result: Result<Page<Dict[]>> = await dictApi.getPage(
    pageData.searchInfo
  );
  if (result.code === "0") {
    pageData.dictDataList = result.data.records;
    pageData.searchInfo.total = Number(result.data.total);
  } else {
    warnMessage(result.message);
  }
};
const handleSelectionChange = val => {
  pageData.selection = val;
};
const initDept = (data: Dict) => {
  if (data) {
    pageData.dictInfo = data;
  } else {
    pageData.dictInfo = { id: "", name: "", type: "", description: "" };
  }
};
const handlerAddNew = () => {
  initDept(null);
  pageData.isUpdate = false;
  pageData.dictDialogVisible = true;
};
const handlerEdit = (data: Dict) => {
  initDept(data);
  pageData.isUpdate = true;
  pageData.dictDialogVisible = true;
};
const handlerUpdate = () => {
  if (pageData.selection.length <= 0) {
    warnMessage("请选择");
  } else if (pageData.selection.length > 1) {
    warnMessage("请选择(有且只有一个)");
  } else {
    handlerEdit(pageData.selection[0]);
  }
};
const handlerDelete = (data: Dict) => {
  confirm("是否删除当前数据")
    .then(() => {
      let ids: string[] = [data.id];
      dictDelete(ids);
    })
    .catch(() => {});
};

const handlerBatchDelete = () => {
  if (pageData.selection.length <= 0) {
    warnMessage("请选择");
    return;
  }
  confirm("是否删除已选择数据")
    .then(() => {
      let ids: string[] = [];
      pageData.selection.forEach(item => {
        ids.push(item.id);
      });
      dictDelete(ids);
    })
    .catch(() => {});
};

const dictDelete = async (ids: string[]) => {
  if (ids.length <= 0) {
    return;
  }
  const result: Result<string> = await dictApi.deleteBatch(ids);
  if (result.code === "0") {
    successMessage("删除成功");
    getPage();
  } else {
    warnMessage(result.message);
  }
};
const handlerRefresh = () => {
  pageData.dictDialogVisible = false;
  pageData.isUpdate = false;
  getPage();
};
const dictRoleTableRowClick = (row, column, event) => {
  emit("rowClick", row.id, row);
};
onMounted(() => {
  getPage();
});
</script>

<template>
  <el-col
    style="padding-left: 5px; padding-right: 5px; margin-bottom: 10px"
    :xs="24"
    :sm="24"
    :md="10"
    :lg="11"
    :xl="11"
  >
    <el-card>
      <el-row>
        <el-form
          :inline="true"
          :model="pageData.searchInfo"
          class="demo-form-inline"
        >
          <el-form-item>
            <el-input
              v-model="pageData.searchInfo.name"
              placeholder="名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="pageData.searchInfo.type"
              placeholder="类型"
              clearable
            ></el-input>
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
      </el-row>
      <el-row :gutter="2">
        <div class="avue-crud__menu">
          <div class="avue-crud__left">
            <el-button
              type="success"
              size="default"
              :icon="useRenderIcon('iconify-plus')"
              @click="handlerAddNew"
              >新增</el-button
            >
            <el-button
              type="primary"
              size="default"
              :icon="useRenderIcon('iconify-edit')"
              @click="handlerUpdate"
              >修改</el-button
            >
            <el-button
              type="danger"
              size="default"
              :icon="useRenderIcon('iconify-fa-trash')"
              @click="handlerBatchDelete"
              >删除</el-button
            >
            <button
              class="el-button el-button--default"
              style="padding: 0 0 0 0px"
            >
              <el-upload
                ref="uploadRef"
                class="upload-demo"
                :multiple="false"
                :show-file-list="false"
                :limit="1"
                action=""
              >
                <el-button
                  type="info"
                  size="default"
                  :icon="useRenderIcon('iconify-fa-upload')"
                  >上传</el-button
                >
              </el-upload>
            </button>

            <el-button
              size="default"
              type="warning"
              :icon="useRenderIcon('iconify-fa-download')"
              >导出</el-button
            >
          </div>
          <div class="avue-crud__right">
            <el-button
              size="default"
              title="刷新"
              circle
              :icon="useRenderIcon('iconify-fa-refresh')"
              @click="handlerRefresh"
            ></el-button>
          </div>
        </div>
        <el-col :xs="10">
          <el-table
            :data="pageData.dictDataList"
            style="width: 100%"
            ref="dictListRef"
            size="large"
            border
            :fit="true"
            highlight-current-row
            :header-cell-style="{ 'text-align': 'center' }"
            @selection-change="handleSelectionChange"
            @row-click="dictRoleTableRowClick"
          >
            <el-table-column
              sortable
              resizable
              :show-overflow-tooltip="true"
              align="center"
              type="selection"
            ></el-table-column>
            <el-table-column
              prop="name"
              label="名称"
              sortable
              resizable
              :show-overflow-tooltip="true"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="type"
              label="类型"
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
            v-model:currentPage="pageData.searchInfo.pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageData.searchInfo.pageSize"
            layout="total,sizes, prev, pager, next, jumper"
            :total="pageData.searchInfo.total"
            @size-change="sizeChange"
            @current-change="currentChange"
          ></el-pagination>
        </el-col>
      </el-row>
    </el-card>
  </el-col>
  <dict-parent-edit
    :dialog-visible="pageData.dictDialogVisible"
    :is-update="pageData.isUpdate"
    :dict-info="pageData.dictInfo"
    @refresh="handlerRefresh"
  ></dict-parent-edit>
</template>

<style scoped></style>
