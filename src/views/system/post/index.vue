<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { SearchView, TableOpera } from "/@/components/searchTable";
import { postApi } from "/@/api/system/post";
import { filterObj, filterDict } from "/@/utils/utils";
import { Page } from "/@/api/model/domain";
import { Post } from "/@/api/model/system/post_model";
import { dictStoreHook } from "/@/store/modules/dict";
import Edit from "./modules/edit.vue";
import { successMessage, warnMessage } from "/@/utils/message";
import { confirm } from "/@/utils/message/box";
import { ElUpload } from "element-plus";
const postEditRef = ref<InstanceType<typeof Edit>>();
const uploadRef = ref<InstanceType<typeof ElUpload>>();
const pageData = reactive({
  permission: {
    add: ["post:add"],
    update: ["post:update"],
    delete: ["post:delete"],
    export: ["post:export"],
    upload: ["post:upload"]
  }
});
const searchParam = reactive({
  form: [
    {
      name: "岗位名称",
      key: "name",
      use: true,
      type: "input",
      tips: "岗位名称查询"
    },
    {
      name: "岗位编码",
      key: "number",
      use: true,
      type: "input",
      tips: "精确查询"
    },
    {
      name: "岗位状态",
      key: "isEnabled",
      use: true,
      type: "select",
      dataList: "enabledOptions",
      tips: "请选择"
    }
  ],
  dataSource: {
    enabledOptions: []
  },
  formInfo: {}
});
const tableParam = reactive({
  selection: [],
  loading: false,
  tableColumns: [
    {
      label: "",
      prop: "",
      align: "center",
      sortable: false,
      resizable: true,
      type: "selection",
      showOverflowTooltip: true
    },
    {
      label: "岗位编码",
      prop: "number",
      align: "center",
      sortable: true,
      resizable: true,
      type: "txt",
      showOverflowTooltip: true
    },
    {
      label: "岗位名称",
      prop: "name",
      align: "center",
      sortable: true,
      resizable: true,
      type: "txt",
      showOverflowTooltip: true
    },
    {
      label: "岗位状态",
      prop: "isEnabled",
      align: "center",
      sortable: true,
      resizable: true,
      type: "tag",
      showOverflowTooltip: true
    },
    {
      label: "排序",
      prop: "sort",
      align: "center",
      sortable: true,
      resizable: true,
      type: "txt",
      showOverflowTooltip: true
    },
    {
      label: "创建时间",
      prop: "createTime",
      align: "center",
      sortable: true,
      resizable: true,
      type: "txt",
      showOverflowTooltip: true
    },
    {
      label: "操作",
      prop: "",
      align: "center",
      sortable: false,
      resizable: true,
      type: "opera",
      showOverflowTooltip: true
    }
  ],
  tableData: [],
  /* 分页参数 */
  pagination: {
    current: 1,
    pageSize: 10,
    pageSizeOptions: ["10", "20", "50"],
    showTotal: (total, range) => {
      return range[0] + "-" + range[1] + " 共" + total + "条";
    },
    showQuickJumper: true,
    showSizeChanger: true,
    total: 0
  }
});
const loadData = (page?: Number) => {
  if (page === 1) {
    tableParam.pagination.current = 1;
  }
  const params = getQueryParams();
  tableParam.loading = true;
  postApi
    .page(params)
    .then((res: Page<Post[]> | string) => {
      if (res !== "fail") {
        tableParam.tableData = (res as Page<Post[]>).records;
        tableParam.pagination.total = Number((res as Page<Post[]>).total);
      }
    })
    .finally(() => {
      tableParam.loading = false;
    });
};
const getQueryParams = () => {
  const sqp = {};
  const param = Object.assign(sqp, searchParam.formInfo);
  param.pageNum = tableParam.pagination.current;
  param.pageSize = tableParam.pagination.pageSize;
  return filterObj(param);
};
/**
 * 字典的启用状态
 */
const getEnableOptions = () => {
  const result = dictStoreHook().getEntry("sys_enable");
  searchParam.dataSource.enabledOptions = result || [];
};
const handlerSearchForm = data => {
  searchParam.formInfo = data;
};
const handlerSearch = () => {
  loadData(1);
};
const handlerReset = data => {
  searchParam.formInfo = data;
  loadData(1);
};
const handlerEdit = (data?: any) => {
  if (data) {
    postEditRef.value?.open("edit", data, searchParam.dataSource);
  } else {
    if (tableParam.selection && tableParam.selection.length == 1) {
      postEditRef.value?.open(
        "edit",
        tableParam.selection[0],
        searchParam.dataSource
      );
    } else {
      warnMessage("请正确选择");
    }
  }
};
const handlerAdd = () => {
  postEditRef.value?.open("add", null, searchParam.dataSource);
};
const handlerSelectionChange = selection => {
  tableParam.selection = selection;
};
const handlerDelete = (data?: any) => {
  if (data) {
    handlerRemove([data.id]);
  } else {
    if (tableParam.selection && tableParam.selection.length > 0) {
      const result = tableParam.selection.map(v => v.id);
      handlerRemove(result);
    } else {
      warnMessage("请正确选择");
    }
  }
};
const handlerRemove = (ids: string[]) => {
  if (ids) {
    confirm("是否删除已选择")
      .then(() => {
        tableParam.loading = true;
        postApi
          .deleteBatch(ids)
          .then(res => {
            if (res !== "fail") {
              loadData();
            }
          })
          .finally(() => {
            tableParam.loading = false;
          });
      })
      .catch(() => {});
  }
};
const handlerExport = () => {
  confirm("是否导出当前全部数据")
    .then(async () => {
      tableParam.loading = true;
      await postApi.exportFile(searchParam.formInfo);
      tableParam.loading = false;
    })
    .catch(() => {});
};
const handlerUpload = async val => {
  const fileData: File[] = [val.file];
  tableParam.loading = true;
  postApi
    .uploadFile(fileData)
    .then(res => {
      if (res !== "fail") {
        successMessage("导入成功");
        loadData(1);
        uploadRef.value.clearFiles();
      }
    })
    .finally(() => (tableParam.loading = false));
};
const sizeChange = (pageSize: number) => {
  tableParam.pagination.pageSize = pageSize;
  loadData();
};
const currentChange = (pageNum: number) => {
  tableParam.pagination.current = pageNum;
  loadData();
};
onMounted(() => {
  loadData(1);
  getEnableOptions();
});
</script>

<template>
  <el-card shadow="never" :span="18">
    <!-- 查询区域 -->
    <search-view
      :search-form-config="searchParam.form"
      :data-source="searchParam.dataSource"
      @get-search-form="handlerSearchForm"
      @search-run="handlerSearch"
      @search-reset="handlerReset"
    />
    <!-- 按钮区域 -->
    <table-opera>
      <template v-slot:opera-left>
        <!---->
        <el-button
          type="primary"
          :icon="useRenderIcon('plus')"
          v-auth="pageData.permission.add"
          @click="handlerAdd"
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
        <button class="el-button" style="padding: 0 0 0 0px">
          <el-upload
            ref="uploadRef"
            class="upload-demo"
            :multiple="false"
            :show-file-list="false"
            :limit="1"
            action=""
            v-auth="pageData.permission.upload"
            :http-request="handlerUpload"
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
          type="warning"
          :icon="useRenderIcon('download')"
          v-auth="pageData.permission.export"
          @click="handlerExport"
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
          @click="loadData(1)"
        />
      </template>
    </table-opera>
    <!-- table区域 -->
    <div>
      <el-table
        :data="tableParam.tableData"
        v-loading="tableParam.loading"
        style="width: 100%"
        row-key="id"
        border
        @selection-change="handlerSelectionChange"
      >
        <template v-for="item in tableParam.tableColumns">
          <!--eslint-disable-next-line-->
          <el-table-column
            v-if="item.type === 'tag'"
            :prop="item.prop"
            :label="item.label"
            :sortable="item.sortable"
            :resizable="item.resizable"
            :show-overflow-tooltip="item.showOverflowTooltip"
            :align="item.align"
          >
            <!---->
            <template #default="scope">
              <!---->
              <el-tag
                :type="scope.row.isEnabled === 1 ? 'success' : 'danger'"
                disable-transitions
                >{{
                  filterDict(
                    searchParam.dataSource.enabledOptions,
                    scope.row.isEnabled.toString()
                  )?.label
                }}</el-tag
              >
            </template>
          </el-table-column>
          <!--eslint-disable-next-line-->
          <el-table-column
            v-else-if="item.type === 'opera'"
            :prop="item.prop"
            :label="item.label"
            :sortable="item.sortable"
            :resizable="item.resizable"
            :show-overflow-tooltip="item.showOverflowTooltip"
            :align="item.align"
          >
            <!---->
            <template v-slot="scope">
              <el-button
                size="small"
                type="text"
                :icon="useRenderIcon('edit')"
                v-auth="pageData.permission.update"
                @click="handlerEdit(scope.row)"
                >修改</el-button
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
          <!--eslint-disable-next-line-->
          <el-table-column
            v-else
            :type="item.type"
            :prop="item.prop"
            :label="item.label"
            :sortable="item.sortable"
            :resizable="item.resizable"
            :show-overflow-tooltip="item.showOverflowTooltip"
            :align="item.align"
          />
        </template>
        <!---->
      </el-table>
      <div class="pagination-container">
        <el-pagination
          v-model:currentPage="tableParam.pagination.current"
          :page-sizes="[10, 20, 50, 100]"
          v-model:page-size="tableParam.pagination.pageSize"
          layout="total,sizes, prev, pager, next, jumper"
          background
          v-model:total="tableParam.pagination.total"
          @current-change="currentChange"
          @size-change="sizeChange"
        />
      </div>
    </div>
    <edit ref="postEditRef" @ok="loadData(1)" />
  </el-card>
</template>

<style scoped></style>
