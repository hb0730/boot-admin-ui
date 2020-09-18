<template>
  <d2-container class="page">
    <el-col :span="6">
      <el-card shadow="never" class="box-card">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-tree
          class="filter-tree"
          style="padding-top:20px;"
          :data="deptTreeData"
          :props="deptTreeProps"
          node-key="id"
          default-expand-all
          :filter-node-method="treeFilterNode"
          @node-click="treeNodeClick"
          ref="deptTree"
        ></el-tree>
      </el-card>
    </el-col>
    <el-col :span="18">
      <el-card shadow="never" class="box-card">
        <el-row>
          <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
            <el-form-item>
              <el-input v-model="searchInfo.nickName" placeholder="用户昵称" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="searchInfo.username" placeholder="用户账号" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="searchInfo.isEnabled" placeholder="用户状态" clearable>
                <el-option
                  v-for="item in isEnabledOptions"
                  :key="Number(item.value)"
                  :label="item.label"
                  :value="Number(item.value)"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button plain size="medium" @click="handleCurrentChange(1)" icon="fa fa-search">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row>
          <el-row :gutter="2">
            <div class="avue-crud__menu">
              <div class="avue-crud__left">
                <button
                  type="button"
                  @click="handerAddNew"
                  class="el-button filter-item el-button--success el-button--mini"
                >
                  <i class="fa fa-plus"></i>
                  <span>新增</span>
                </button>
                <button
                  type="button"
                  class="el-button filter-item el-button--primary el-button--mini"
                  @click="handlerEdit"
                >
                  <i class="fa fa-edit"></i>
                  <span>修改</span>
                </button>
                <button
                  type="button"
                  class="el-button filter-item el-button--danger el-button--mini"
                  @click="handlerRemove"
                >
                  <i class="fa fa-remove"></i>
                  <span>删除</span>
                </button>
                <button
                  class="el-button filter-item el-button--info el-button--mini"
                  style="padding:0 0 0 0px"
                >
                  <el-upload
                    ref="upload"
                    action
                    :limit="1"
                    :show-file-list="false"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  >
                    <button class="el-button filter-item el-button--info el-button--mini">
                      <i class="fa fa-upload"></i>
                      <span>导入</span>
                    </button>
                  </el-upload>
                </button>
                <button
                  type="button"
                  class="el-button filter-item el-button--warning el-button--mini"
                >
                  <i class="fa fa-download"></i>
                  <span>导出</span>
                </button>
              </div>
              <div class="avue-crud__right">
                <button
                  type="button"
                  class="el-button el-tooltip el-button--default el-button--small is-circle"
                  aria-describedby="el-tooltip-2497"
                  @click="getPage"
                  tabindex="0"
                  title="刷新"
                >
                  <i class="el-icon-refresh"></i>
                </button>
              </div>
            </div>
            <el-col :xs="10">
              <el-table
                v-loading="loading"
                :data="userList"
                style="width: 100%;"
                ref="userListRef"
                border
                :fit="true"
                :header-cell-style="{'text-align':'center'}"
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
                  <template slot-scope="scope">
                    <el-tag
                      :type="scope.row.isEnabled === 1 ? 'success' : 'danger'"
                      disable-transitions
                    >{{getDictEntryInfo('sys_common_status',scope.row.isEnabled).label}}</el-tag>
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
                  <template slot-scope="scope">
                    <el-button
                      title="修改"
                      @click="handlerUpdate(scope.row)"
                      type="primary"
                      icon="fa fa-pencil"
                      size="mini"
                    ></el-button>
                    <el-button
                      title="删除"
                      @click="handlerDelete(scope.row)"
                      type="danger"
                      icon="fa fa-trash"
                      size="mini"
                    ></el-button>
                    <el-button
                      title="重置密码"
                      @click="handlerRestPassword(scope.row)"
                      type="warning"
                      icon="fa fa-key"
                      size="mini"
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                align="left"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="searchInfo.pageNum"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="searchInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="searchInfo.total"
              ></el-pagination>
            </el-col>
          </el-row>
        </el-row>
      </el-card>
    </el-col>
    <el-dialog
      title="用户信息"
      :before-close="handleDialogClose"
      :visible.sync="dialogTableVisible"
      :destroy-on-close="!dialogTableVisible"
    >
      <el-form
        label-width="auto"
        :model="userInfo"
        :label-position="position"
        ref="userFormRef"
        required-asterisk
        :rules="userRules"
        center
      >
        <el-row>
          <el-col :span="12">
            <el-form-item required label="用户账号：" prop="username">
              <el-input :disabled="isUpdate" v-model="userInfo.username" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="用户昵称" prop="nickName">
              <el-input v-model="userInfo.nickName" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号：" prop="phonenumber">
              <el-input v-model="userInfo.phonenumber" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱：" prop="email">
              <el-input v-model="userInfo.email" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item required label="所属部门：" prop="deptId">
              <treeselect
                v-model="userInfo.deptId"
                :normalizer="normalizer"
                :options="deptTreeData"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位：" prop="postIds">
              <el-select style="width:100%" v-model="userInfo.postIds" multiple placeholder="请选择">
                <el-option
                  v-for="item in postDataList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别：" prop="gender">
              <el-select style="width:100%;" v-model="userInfo.gender" placeholder="请选择">
                <el-option
                  v-for="item in sexOptions"
                  :key="Number(item.value)"
                  :value="Number(item.value)"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="状态：" prop="isEnabled">
              <el-radio-group :disabled="userInfo.isAdmin==1" v-model="userInfo.isEnabled">
                <el-radio
                  v-for="item in isEnabledOptions "
                  :key="Number(item.value)"
                  :label="Number(item.value)"
                >{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色" prop="roleIds">
              <el-select style="width:100%" v-model="userInfo.roleIds" multiple placeholder="请选择">
                <el-option
                  v-for="item in roleDataList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="description">
              <el-input type="textarea" v-model="userInfo.description" placeholder="备注" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :disabled="userInfo.isAdmin==1"
          @click="handlerSave"
          size="medium"
        >保存</el-button>
        <el-button size="medium" @click="handleDialogClose">取 消</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>
<script>
import { mapActions } from "vuex";
import util from "@/libs/util";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { MessageBox } from "element-ui";
export default {
  components: { Treeselect },
  watch: {
    filterText(val) {
      this.$refs.deptTree.filter(val);
    },
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 树形过滤
      filterText: "",
      position: "left",
      //树形
      deptTreeProps: {
        children: "children",
        label: "name",
      },
      // 部门树
      deptTreeData: [],
      //当前树形信息
      currentDeptTreeData: {},
      // 用户检索信息
      searchInfo: {
        deptId: "",
        nickName: "",
        username: "",
        isEnabled: "",
        sortColumn: [],
        groupColumn: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      /**
       * 岗位列表
       */
      postDataList: [],
      //角色列表
      roleDataList: [],
      // 用户列表
      userList: [],
      //用户信息
      userInfo: {
        id: "",
        username: "",
        nickName: "",
        phonenumber: "",
        gender: 0,
        isEnabled: 0,
        email: "",
        isAdmin: 0,
        deptId: "",
        roleIds: [],
        postIds: [],
        description: "",
      },
      userRules: {
        username: [
          { required: true, message: "请输入用户账号", trigger: "blur" },
        ],
        nickName: [
          { required: true, message: "请输入用户昵称", trigger: "blur" },
        ],
        deptId: [
          { required: true, message: "请选择所属部门", trigger: "blur" },
        ],
      },
      //是否修改
      isUpdate: false,
      //是否显示面板
      dialogTableVisible: false,
      //性别选项
      sexOptions: [],
      //启用选项
      isEnabledOptions: [],
    };
  },
  mounted() {
    let _self = this;
    _self.getDeptTree();
    _self.getPostList();
    _self.getRoleList();
    _self.getPage();
    _self.initDict();
  },
  methods: {
    ...mapActions("bootAdmin/dept", ["deptTree"]),
    ...mapActions("bootAdmin/post", ["postList"]),
    ...mapActions("bootAdmin/role", ["roleList"]),
    ...mapActions("bootAdmin/userList", [
      "userPage",
      "userSave",
      "userUpdate",
      "userDelete",
      "userRestPassword",
    ]),
    /**
     * 数据字典
     */
    initDict() {
      let _self = this;
      _self.isEnabledOptions = util.dict.getDictValue("sys_common_status");
      _self.sexOptions = util.dict.getDictValue("sys_user_gender");
    },
    getDictEntryInfo(type, entryValue) {
      return util.dict.getDictEntryValue(type, entryValue);
    },
    /**
     * 分页查询
     */
    getPage() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.searchInfo));
      _self.loading = true;
      _self.userPage({ data: params }).then((result) => {
        _self.userList = result.records;
        _self.searchInfo.total = Number(result.total);
        _self.loading = false;
      });
    },
    handleSizeChange(pageSize) {
      let _self = this;
      let info = _self.currentDeptTreeData;
      if (info) {
        _self.searchInfo.deptId = info.id;
      }
      _self.searchInfo.pageSize = pageSize;
      _self.getPage();
    },
    handleCurrentChange(pageNum) {
      let _self = this;
      let info = _self.currentDeptTreeData;
      if (info) {
        _self.searchInfo.deptId = info.id;
      }
      _self.searchInfo.pageNum = pageNum;
      _self.getPage();
    },
    /**
     * 获取岗位列表
     */
    getPostList() {
      let _self = this;
      let params = {
        isEnabled: 1,
      };
      _self.postList({ data: params }).then((result) => {
        _self.postDataList = result;
      });
    },
    /**
     * 角色列表
     */
    getRoleList() {
      let _self = this;
      let params = {
        isEnabled: 1,
      };
      _self.roleList({ data: params }).then((result) => {
        _self.roleDataList = result;
      });
    },
    /**
     * 组织树
     */
    getDeptTree() {
      let _self = this;
      _self.deptTree().then((result) => {
        _self.deptTreeData = result;
      });
    },
    /**
     * 组织树点击
     */
    treeNodeClick(data, node, obj) {
      let _self = this;
      _self.currentDeptTreeData = data;
      _self.initUserInfo();
      _self.searchInfo.deptId = data.id;
      _self.getPage();
    },
    /**
     * 树检索
     */
    treeFilterNode(value, data) {
      let _self = this;
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    /**
     *部门树形
     */
    normalizer(node) {
      // 去掉children=[]的children属性
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },
    /**
     * 初始化用户信息
     */
    initUserInfo() {
      let _self = this;
      _self.userInfo = {
        id: "",
        username: "",
        nickName: "",
        phonenumber: "",
        gender: 0,
        isEnabled: 0,
        email: "",
        isAdmin: 0,
        deptId: "",
        roleIds: [],
        postIds: [],
        description: "",
      };
    },
    /**
     * 关闭弹出
     */
    handleDialogClose() {
      let _self = this;
      _self.dialogTableVisible = false;
      _self.initUserInfo();
      let info = _self.currentDeptTreeData;
      if (info) {
        _self.searchInfo.deptId = info.id;
      }
      _self.getPage();
    },
    /**
     * 新增
     */
    handerAddNew() {
      let _self = this;
      _self.initUserInfo();
      _self.dialogTableVisible = true;
      _self.isUpdate = false;
    },
    /**
     * 保存
     */
    handlerSave() {
      let _self = this;
      _self.$refs.userFormRef.validate((valid) => {
        if (valid) {
          if (_self.isUpdate) {
            _self.update();
          } else {
            _self.save();
          }
        } else {
          this.$message.error("表单校验失败，请检查");
        }
      });
    },
    update() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.userInfo));
      let id = _self.userInfo.id;
      _self.userUpdate({ id: id, data: params }).then((result) => {
        _self.$message.success("修改成功");
        _self.handleDialogClose();
      });
    },
    save() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.userInfo));
      _self.userSave({ data: params }).then((result) => {
        _self.$message.success("修改成功");
        _self.handleDialogClose();
      });
    },
    /**
     * 修改
     */
    handlerUpdate(row) {
      let _self = this;
      _self.initUserInfo();
      _self.userInfo = JSON.parse(JSON.stringify(row));
      _self.isUpdate = true;
      _self.dialogTableVisible = true;
    },
    /**
     * 修改
     */
    handlerEdit() {
      let _self = this;
      let info = _self.$refs.userListRef.selection;
      if (info.length <= 0) {
        _self.$message({
          message: "请选择",
          type: "warning",
        });
      } else if (info.length > 1) {
        _self.$message({
          message: "请选择(有且只有一个)",
          type: "warning",
        });
      } else {
        _self.isUpdate = true;
        _self.initUserInfo();
        _self.userInfo = JSON.parse(JSON.stringify(info[0]));
        _self.dialogTableVisible = true;
      }
    },
    /**
     * 删除
     */
    handlerDelete(row) {
      let _self = this;
      MessageBox.confirm("是否删除该数据", "删除", {
        type: "warning",
      }).then(() => {
        let ids = [];
        ids.push(row.id);
        _self.delete(ids);
      });
    },
    /**
     * 删除
     */
    handlerRemove() {
      let _self = this;
      let info = _self.$refs.userListRef.selection;
      if (info.length > 0) {
        MessageBox.confirm("是否删除该数据", "删除", {
          type: "warning",
        }).then(() => {
          let ids = [];
          info.forEach((item) => {
            ids.push(item.id);
          });
          _self.delete(ids);
        });
      } else {
        _self.$message({
          message: "请选择",
          type: "warning",
        });
      }
    },
    delete(ids) {
      let _self = this;
      if (ids.length > 0) {
        let params = JSON.parse(JSON.stringify(ids));
        _self.userDelete({ data: params }).then((result) => {
          _self.$message.success("删除成功");
          _self.handleDialogClose();
        });
      }
    },
    /**
     * 重置密码
     */
    handlerRestPassword(row) {
      let _self = this;
      MessageBox.confirm("是否重置当前数据密码", "重置", {
        type: "warning",
      }).then(() => {
        _self.restPassword(row.id);
      });
    },
    restPassword(id) {
      let _self = this;
      _self.userRestPassword({ id: id }).then((result) => {
        _self.$message.success("重置成功");
      });
    },
  },
};
</script>

<style scoped  lang="scss">
.box-card {
  border: 0;
}
</style>