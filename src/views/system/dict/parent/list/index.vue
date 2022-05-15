<script lang="ts">
export default { name: "DictParent" };
</script>
<script setup lang="ts">
import { onMounted, reactive, toRef } from "vue";
import { dictApi } from "/@/api/system/dict";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import DictParentEdit from "../edit/index.vue";
import { Dict, DictQuery } from "/@/api/model/system/dict_model";
import { Page } from "/@/api/model/domain";
import { successMessage, warnMessage } from "/@/utils/message";
import { confirm } from "/@/utils/message/box";
const permission = reactive({
  add: ["dict:save"],
  edit: ["dict:update"],
  delete: ["dict:update"]
});
const emit = defineEmits<{ (e: "rowClick", v: string, data: Dict) }>();
const props = defineProps({
  dataSource: {
    require: true,
    type: [],
    default: []
  }
});
const dataSource = toRef(props, "dataSource");
const pageData = reactive<{
  loading: boolean;
  selection: any[];
  dictDataList: Dict[];
  isUpdate: boolean;
  dictDialogVisible: boolean;
  searchInfo: DictQuery;
  dictInfo: Dict;
}>({
  loading: false,
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
const getPage = () => {
  pageData.loading = true;
  dictApi
    .page(pageData.searchInfo)
    .then((res: Page<Dict[]> | string) => {
      if (res !== "fail") {
        pageData.dictDataList = (res as Page<Dict[]>).records;
        pageData.searchInfo.total = Number((res as Page<Dict[]>).total);
      }
    })
    .finally(() => (pageData.loading = false));
};
const handleSelectionChange = val => {
  pageData.selection = val;
};
const initDept = (data: Dict) => {
  if (data) {
    pageData.dictInfo = data;
  } else {
    pageData.dictInfo = {
      id: "",
      name: "",
      type: "",
      description: "",
      isEnabled: 0
    };
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
  await dictApi.deleteBatch(ids);
  successMessage("删除成功");
  getPage();
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
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="pageData.searchInfo.type"
              placeholder="类型"
              clearable
            />
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
      </el-row>
      <el-row :gutter="2">
        <div class="avue-crud__menu">
          <div class="avue-crud__left">
            <el-button
              type="success"
              size="default"
              :icon="useRenderIcon('iconify-plus')"
              v-auth="permission.add"
              @click="handlerAddNew"
              >新增</el-button
            >
            <el-button
              type="primary"
              size="default"
              :icon="useRenderIcon('iconify-edit')"
              v-auth="permission.edit"
              @click="handlerUpdate"
              >修改</el-button
            >
            <el-button
              type="danger"
              size="default"
              :icon="useRenderIcon('iconify-fa-trash')"
              v-auth="permission.delete"
              @click="handlerBatchDelete"
              >删除</el-button
            >
            <button class="el-button" style="padding: 0 0 0 0px">
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
            />
          </div>
        </div>
        <el-col :xs="10">
          <el-table
            v-loading="pageData.loading"
            :data="pageData.dictDataList"
            style="width: 100%"
            ref="dictListRef"
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
            />
            <el-table-column
              prop="name"
              label="名称"
              sortable
              resizable
              :show-overflow-tooltip="true"
              align="center"
            />
            <el-table-column
              prop="type"
              label="类型"
              sortable
              resizable
              :show-overflow-tooltip="true"
              align="center"
            />
            <el-table-column
              prop="description"
              label="备注"
              sortable
              resizable
              :show-overflow-tooltip="true"
              align="center"
            />
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
                  v-auth="permission.edit"
                  @click="handlerEdit(scope.row)"
                  size="small"
                />
                <el-button
                  title="删除"
                  type="danger"
                  :icon="useRenderIcon('iconify-fa-trash')"
                  v-auth="permission.delete"
                  @click="handlerDelete(scope.row)"
                  size="small"
                />
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
          />
        </el-col>
      </el-row>
    </el-card>
  </el-col>
  <dict-parent-edit
    :dialog-visible="pageData.dictDialogVisible"
    :is-update="pageData.isUpdate"
    :dict-info="pageData.dictInfo"
    :dataSource="dataSource"
    @refresh="handlerRefresh"
  />
</template>

<style scoped></style>
