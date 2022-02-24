<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { deptApi } from "/@/api/dept";
import { DeptTree } from "/@/api/model/dept_model";
import { Page, Result } from "/@/api/model/domain";
import { User, UserQuery } from "/@/api/model/user_model";
import { userApi } from "/@/api/user";
import { postApi } from "/@/api/post";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { warnMessage } from "/@/utils/message";
import UserList from "./list/index.vue";
import UserEdit from "./edit/index.vue";
import { Post, PostQuery } from "/@/api/model/post_model";
import { Role, RoleQuery } from "/@/api/model/role_model";
import { roleApi } from "/@/api/role";
const pageData = reactive<{
  isUpdate: boolean;
  dialogVisible: boolean;
  filterText: string;
  deptTreeData: DeptTree[];
  currentDeptTreeData: DeptTree;
  deptTreeProps: any;
  searchInfo: UserQuery;
  userList: User[];
  userInfo: User;
  postDataList: Post[];
  roleDataList: Role[];
}>({
  isUpdate: false,
  dialogVisible: false,
  filterText: "",
  deptTreeData: [],
  currentDeptTreeData: null,
  //树形
  deptTreeProps: {
    children: "children",
    label: "name"
  },
  // 用户检索信息
  searchInfo: {
    deptId: "",
    nickName: "",
    username: "",
    isEnabled: null,
    sortColumn: [],
    groupColumn: [],
    pageSize: 10,
    pageNum: 1,
    total: 0
  },
  // 用户列表
  userList: [],
  //用户信息
  userInfo: {
    id: "",
    username: "",
    nickName: "",
    phonenumber: "",
    gender: 0,
    isEnabled: null,
    email: "",
    isAdmin: 0,
    deptId: "",
    roleIds: [],
    postIds: [],
    description: ""
  },
  /**
   * 岗位列表
   */
  postDataList: [],
  //角色列表
  roleDataList: []
});
const isEnabledOptions = reactive([
  { value: 1, label: "启用" },
  { value: 0, label: "禁用" }
]);
const treeFilterNode = (value, data) => {
  if (!value) return true;
  return data.name.indexOf(value) !== -1;
};
const initUserInfo = (data: User) => {
  if (data) {
    pageData.userInfo = data;
  } else {
    pageData.userInfo = {
      id: "",
      username: "",
      nickName: "",
      phonenumber: "",
      gender: 0,
      isEnabled: null,
      email: "",
      isAdmin: 0,
      deptId: "",
      roleIds: [],
      postIds: [],
      description: ""
    };
  }
};
/**
 * 组织树点击
 */
const treeNodeClick = (data, _) => {
  pageData.currentDeptTreeData = data;
  initUserInfo(null);
  pageData.searchInfo.deptId = data.id;
  getPage();
};
const getTreeDept = async () => {
  const result: Result<DeptTree[]> = await deptApi.getTreDept();
  if (result.code === "0") {
    pageData.deptTreeData = result.data;
  }
};
const getPage = async () => {
  const result: Result<Page<User[]>> = await userApi.getUserPage(
    pageData.searchInfo
  );
  if (result.code === "0") {
    pageData.userList = result.data.records;
    pageData.searchInfo.total = Number(result.data.total);
  } else {
    warnMessage(result.message);
  }
};
const getPost = async () => {
  const query: PostQuery = { isEnabled: 1 };
  const result: Result<Post[]> = await postApi.getList(query);
  if (result.code === "0") {
    pageData.postDataList = result.data;
  }
};
const getRoleList = async () => {
  const query: RoleQuery = { isEnabled: 1 };
  const result: Result<Role[]> = await roleApi.getList(query);
  if (result.code === "0") {
    pageData.roleDataList = result.data;
  }
};
const handlerAddNew = () => {
  initUserInfo(null);
  if (pageData.currentDeptTreeData) {
    pageData.userInfo.deptId = pageData.currentDeptTreeData.id;
  } else {
    pageData.userInfo.deptId = undefined;
  }
  pageData.userInfo.isEnabled = 0;
  pageData.dialogVisible = true;
  pageData.isUpdate = false;
};
const handlerUpdate = (data: User) => {
  initUserInfo(data);
  pageData.dialogVisible = true;
  pageData.isUpdate = true;
};
const handlerRefresh = (pageSize: number, pageNum: number) => {
  pageData.searchInfo.pageNum = pageNum;
  pageData.searchInfo.pageSize = pageSize;
  getPage();
};
const closeDialog = () => {
  initUserInfo(null);
  pageData.dialogVisible = false;
  if (pageData.currentDeptTreeData) {
    pageData.userInfo.deptId = pageData.currentDeptTreeData.id;
  }
  getPage();
};
const handlerSearch = () => {
  pageData.searchInfo.pageNum = 1;
  getPage();
};
onMounted(() => {
  getPost();
  getRoleList();
  getTreeDept();
  getPage();
});
</script>

<template>
  <div class="app-container">
    <el-row>
      <el-col :span="6">
        <el-card shadow="never" class="box-card">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="pageData.filterText"
            :prefix-icon="useRenderIcon('iconify-fa-search')"
            size="large"
          >
          </el-input>
          <el-tree
            class="filter-tree"
            style="padding-top: 20px"
            node-key="id"
            ref="deptTree"
            default-expand-all
            :expand-on-click-node="false"
            :data="pageData.deptTreeData"
            :props="pageData.deptTreeProps"
            :filter-node-method="treeFilterNode"
            @node-click="treeNodeClick"
          ></el-tree>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card shadow="never" class="box-card">
          <el-row>
            <el-form
              :inline="true"
              :model="pageData.searchInfo"
              class="demo-form-inline"
              size="large"
            >
              <el-form-item>
                <el-input
                  v-model="pageData.searchInfo.nickName"
                  placeholder="用户昵称"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="pageData.searchInfo.username"
                  placeholder="用户账号"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model="pageData.searchInfo.isEnabled"
                  placeholder="用户状态"
                  clearable
                >
                  <el-option
                    v-for="item in isEnabledOptions"
                    :key="Number(item.value)"
                    :label="item.label"
                    :value="Number(item.value)"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button
                  plain
                  size="large"
                  @click="handlerSearch"
                  :icon="useRenderIcon('iconify-fa-search')"
                  >查询</el-button
                >
              </el-form-item>
            </el-form>
          </el-row>
          <UserList
            :user-list="pageData.userList"
            :search-model="pageData.searchInfo"
            @handler-add-new="handlerAddNew"
            @handler-update="handlerUpdate"
            @handler-refresh="handlerRefresh"
          ></UserList>
        </el-card>
      </el-col>
    </el-row>
    <UserEdit
      :is-update="pageData.isUpdate"
      :user-info="pageData.userInfo"
      :dialog-visible="pageData.dialogVisible"
      :dept-tree-data="pageData.deptTreeData"
      :post-data-list="pageData.postDataList"
      :role-data-list="pageData.roleDataList"
      @close-dialog="closeDialog"
    ></UserEdit>
  </div>
</template>

<style scoped>
.box-card {
  border: 0;
}
</style>
