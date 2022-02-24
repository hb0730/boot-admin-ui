<script setup lang="ts">
import { ElTable } from "element-plus";
import { PropType, reactive, ref, Ref, toRef } from "vue";
import { Result } from "/@/api/model/domain";
import { User, UserQuery } from "/@/api/model/user_model";
import { userApi } from "/@/api/user";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { successMessage, warnMessage } from "/@/utils/message";
import { confirm } from "/@/utils/message/box";
const userListRef = ref<InstanceType<typeof ElTable>>();
const pageData = reactive({
  selection: []
});
const props = defineProps({
  userList: Object as PropType<User[]>,
  searchModel: Object as PropType<UserQuery>
});
const emit = defineEmits<{
  (e: "handlerAddNew");
  (e: "handlerUpdate", v: User);
  (e: "handlerRefresh", pageSize: number, pageNum: number);
}>();
const userList = toRef(props, "userList");
const searchModel: Ref<UserQuery> = toRef(props, "searchModel");
const sizeChange = (pageSize: number) => {
  emit("handlerRefresh", pageSize, searchModel.value.pageNum);
};
const currentChange = (pageNum: number) => {
  emit("handlerRefresh", searchModel.value.pageSize, pageNum);
};
const addNew = () => {
  emit("handlerAddNew");
};
const update = () => {
  if (pageData.selection.length <= 0) {
    warnMessage("请选择");
  } else if (pageData.selection.length > 1) {
    warnMessage("请选择(有且只有一个)");
  } else {
    emit("handlerUpdate", pageData.selection[0]);
  }
};
const handlerDelete = () => {
  if (pageData.selection.length <= 0) {
    warnMessage("请选择");
    return;
  } else {
    confirm("是否删除已选择数据")
      .then(() => {
        let ids: string[] = [];
        pageData.selection.forEach(item => {
          ids.push(item.id);
        });
        deleteByIds(ids);
      })
      .catch(() => {});
  }
};
const deleteByIds = async (ids: string[]) => {
  if (ids.length > 0) {
    const result: Result<string> = await userApi.deleteBatchById(ids);
    if (result.code === "0") {
      emit(
        "handlerRefresh",
        searchModel.value.pageSize,
        searchModel.value.pageNum
      );
    } else {
      warnMessage(result.message);
    }
  }
};
const handlerRefresh = () => {
  emit("handlerRefresh", searchModel.value.pageSize, searchModel.value.pageNum);
};
const handleSelectionChange = val => {
  pageData.selection = val;
};
const handlerRestPassword = data => {
  confirm("是否重置当前用户密码")
    .then(async () => {
      const result: Result<string> = await userApi.restPassword(data.id);
      if (result.code === "0") {
        successMessage("重置成功");
      } else {
        warnMessage(result.message);
      }
    })
    .catch(() => {});
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
            @click="addNew"
            :icon="useRenderIcon('iconify-plus')"
            >新增</el-button
          >
          <el-button
            type="primary"
            size="default"
            @click="update"
            :icon="useRenderIcon('iconify-edit')"
            >修改</el-button
          >
          <el-button
            type="danger"
            size="default"
            :icon="useRenderIcon('iconify-fa-trash')"
            @click="handlerDelete"
            >删除</el-button
          >
          <button
            class="el-button el-button--default"
            style="padding: 0 0 0 0px"
          >
            <el-upload
              ref="upload"
              class="upload-demo"
              :limit="1"
              action=""
              :auto-upload="false"
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
          style="width: 100%"
          ref="userListRef"
          :data="userList"
          border
          :fit="true"
          :header-cell-style="{ 'text-align': 'center' }"
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
            prop="nickName"
            label="用户昵称"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="username"
            label="用户账号"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="phonenumber"
            label="手机号"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="isEnabled"
            label="用户状态"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
            <template #default="scope">
              <el-tag
                :type="scope.row.isEnabled === 1 ? 'success' : 'warning'"
                disable-transitions
                >{{ scope.row.isEnabled === 1 ? "启用" : "禁用" }}</el-tag
              >
            </template>
          </el-table-column>
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
            min-width="150"
          >
            <template #default="scope">
              <el-button
                title="重置密码"
                @click="handlerRestPassword(scope.row)"
                type="warning"
                :icon="useRenderIcon('iconify-fa-key')"
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
      </el-col>
    </el-row>
  </div>
</template>

<style scoped></style>
