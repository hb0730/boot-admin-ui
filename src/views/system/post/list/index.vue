<script lang="ts">
export default { name: "PostList" };
</script>
<script setup lang="ts">
import { toRef, PropType, reactive, Ref, ref } from "vue";
import { Post, PostQuery } from "/@/api/model/post_model";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import PostEdit from "../edit/index.vue";
import { ElTable, ElUpload } from "element-plus";
import { successMessage, warnMessage } from "/@/utils/message";
import { confirm } from "/@/utils/message/box";
import { postApi } from "/@/api/post";
import { Result } from "/@/api/model/domain";
const postListRef = ref<InstanceType<typeof ElTable>>();
const uploadRef = ref<InstanceType<typeof ElUpload>>();
const emit = defineEmits<{
  (e: "handlerRefresh"): void;
}>();
const pageData = reactive<{
  dialogTableVisible: boolean;
  selection: Post[];
  postInfo: Post;
  isUpdate: boolean;
}>({
  dialogTableVisible: false,
  selection: [],
  postInfo: {
    id: "",
    name: "",
    number: "",
    isEnabled: 0,
    sort: 999,
    description: ""
  },
  isUpdate: false
});
const props = defineProps({
  postList: Array as PropType<Post[]>,
  searchModel: Object as PropType<PostQuery>
});
const postList = toRef(props, "postList");
const searchModel: Ref<PostQuery> = toRef(props, "searchModel");

const sizeChange = (pageSize: number) => {};
const currentChange = (pageNum: number) => {};
const handleSelectionChange = val => {
  pageData.selection = val;
};
const initPostInfo = (data: Post) => {
  if (data) {
    pageData.postInfo = data;
  } else {
    pageData.postInfo = {
      id: "",
      name: "",
      number: "",
      isEnabled: 0,
      sort: 999,
      description: ""
    };
  }
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
const handlerEdit = (data: Post) => {
  initPostInfo(data);
  pageData.isUpdate = true;
  pageData.dialogTableVisible = true;
};
const handlerDelete = (data: Post) => {
  confirm("是否删除当前数据")
    .then(() => {
      let ids: string[] = [data.id];
      postDelete(ids);
    })
    .catch(() => {});
};
const handlerDeleteBatch = () => {
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
      postDelete(ids);
    })
    .catch(() => {});
};
const handlerRefresh = () => {
  pageData.dialogTableVisible = false;
  emit("handlerRefresh");
};
const handlerAddNew = () => {
  initPostInfo(null);
  pageData.isUpdate = false;
  pageData.dialogTableVisible = true;
};
const postDelete = async (ids: string[]) => {
  if (ids.length <= 0) {
    return;
  }
  const result: Result<string> = await postApi.deleteBatch(ids);
  if (result.code === "0") {
    handlerRefresh();
  } else {
    warnMessage(result.message);
  }
};
const handlerExport = () => {
  confirm("是否导出当前全部数据")
    .then(async () => {
      await postApi.exportFile(searchModel.value);
    })
    .catch(() => {});
};
const handlerUpload = async val => {
  const fileData: File[] = [val.file];
  const result: Result<string> = await postApi.uploadFile(fileData);
  if (result.code === "0") {
    successMessage("导入成功");
    handlerRefresh();
    uploadRef.value.clearFiles();
  } else {
    warnMessage(result.message);
  }
};
</script>
<template>
  <div>
    <el-row>
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
            @click="handlerDeleteBatch"
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
            size="default"
            type="warning"
            :icon="useRenderIcon('iconify-fa-download')"
            @click="handlerExport"
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
      <el-table
        :data="postList"
        style="width: 100%"
        ref="postListRef"
        size="large"
        border
        :fit="true"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          sortable
          resizable
          :show-overflow-tooltip="true"
          align="center"
          type="selection"
        ></el-table-column>
        <el-table-column
          prop="number"
          label="岗位编码"
          sortable
          resizable
          :show-overflow-tooltip="true"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="岗位名称"
          sortable
          resizable
          :show-overflow-tooltip="true"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="isEnabled"
          label="岗位状态"
          sortable
          resizable
          :show-overflow-tooltip="true"
          align="center"
        >
          <template #default="scope">
            <el-tag
              :type="scope.row.isEnabled === 1 ? 'success' : 'danger'"
              disable-transitions
              >{{ scope.row.isEnabled === 1 ? "启用" : "禁用" }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          sortable
          resizable
          :show-overflow-tooltip="true"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
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
        v-model:currentPage="searchModel.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="searchModel.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="searchModel.total"
        @size-change="sizeChange"
        @current-change="currentChange"
      ></el-pagination>
    </el-row>

    <post-edit
      :post-info="pageData.postInfo"
      :dialog-visible="pageData.dialogTableVisible"
      :is-update="pageData.isUpdate"
      @refresh="handlerRefresh"
    ></post-edit>
  </div>
</template>

<style scoped></style>
