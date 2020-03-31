<template>
  <d2-container>
    <el-col :span="8">
      <el-card shadow="never">
        <el-row>
          <el-col :span="24">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-tree
              class="filter-tree"
              :data="orgTreeData"
              :props="orgTreeProps"
              node-key="id"
              default-expand-all
              :filter-node-method="treeFilterNode"
              @node-click="treeNodeClick"
              ref="orgTree"
            ></el-tree>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-card shadow="never">
        <el-row>
          <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
            <el-form-item>
              <el-input v-model="searchInfo.nickName" placeholder="用户名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="searchInfo.username" placeholder="用户账号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="searchInfo.isEnabled" placeholder="岗位状态" clearable>
                <el-option
                  v-for="item in isEnabledOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button plain size="medium" icon="fa fa-search">查询</el-button>
              <el-button
                plain
                type="primary"
                @click="handleAddNew"
                size="medium"
                icon="el-icon-plus"
              >新增</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row>
          <el-row :gutter="2">
            <el-col :xs="10">
              <el-table
                :data="userList"
                style="width: 100%;"
                border
                :fit="true"
                :header-cell-style="{'text-align':'center'}"
              >
                <el-table-column type="selection"></el-table-column>
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
                  prop="phone"
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
                    >{{scope.row.isEnabled==1?'启动':'禁用'}}</el-tag>
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
                >
                  <template slot-scope="scope">
                    <el-tooltip content="修改" placement="bottom" effect="light">
                      <el-button
                        type="text"
                        @click="handleUpdate(scope.row)"
                        icon="fa fa-pencil"
                        size="mini"
                      ></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="bottom" effect="light">
                      <el-button type="text" icon="fa fa-trash" size="mini"></el-button>
                    </el-tooltip>
                    <el-tooltip content="重置密码" placement="bottom" effect="light">
                      <el-button type="text" icon="fa fa-key" size="mini"></el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                align="left"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pages.page"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pages.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pages.total"
              ></el-pagination>
            </el-col>
          </el-row>
        </el-row>
      </el-card>
    </el-col>
    <el-dialog title="用户信息" :before-close="handleDialogClose" :visible.sync="dialogTableVisible">
      <el-form
        label-width="auto"
        :model="userInfo"
        :label-position="position"
        ref="userFormRef"
        required-asterisk
        :rules="userRules"
        center
      >
        <el-form-item required label="用户账号" prop="username">
          <el-input :disabled="isUpdate" v-model="userInfo.username" clearable></el-input>
        </el-form-item>
        <el-form-item required label="用户昵称" prop="nickName">
          <el-input v-model="userInfo.nickName" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="!isUpdate" required label="用户密码" prop="password">
          <el-input type="password" v-model="userInfo.password" clearable></el-input>
        </el-form-item>
        <el-form-item required label="所属组织" prop="deptId">
          <treeselect v-model="userInfo.deptId" :normalizer="normalizer" :options="orgTreeData" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select style="width:100%;" v-model="userInfo.sex" placeholder="请选择">
            <el-option
              v-for="item in sexOptions"
              :key="Number(item.value)"
              :value="Number(item.value)"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userInfo.phone" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userInfo.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="岗位" prop="postId">
          <el-select style="width:100%" v-model="userInfo.postId" multiple placeholder="请选择">
            <el-option v-for="item in postList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select style="width:100%" v-model="userInfo.roleId" multiple placeholder="请选择">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            style="width: 100%"
            controls-position="right"
            v-model="userInfo.sort"
            placeholder="排序"
            clearable
          ></el-input-number>
        </el-form-item>
        <el-form-item required label="用户状态" prop="isEnabled">
          <el-radio-group v-model="userInfo.isEnabled">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input type="textarea" v-model="userInfo.description" placeholder="备注" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="!isView" class="dialog-footer">
        <el-button type="primary" @click="handleSave" icon="fa fa-floppy-o" size="medium" plain>保存</el-button>
        <el-button size="medium" @click="handleDialogClose" plain>取 消</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>
<script>
import { mapActions } from "vuex";
import {
  orgTreePath,
  userAllPagePath,
  postAllPath,
  roleAllPath,
  userSavePath,
  userInfoAllPath,
  userUpdatePath
} from "@/api/baseUrl";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import util from "@/libs/util";
export default {
  components: { Treeselect },
  data() {
    return {
      isAll: 1,
      orgTreeData: [],
      position: "left",
      orgTreeProps: {
        children: "children",
        label: "name"
      },
      orgProps: {
        children: "children",
        value: "id",
        label: "name",
        checkStrictly: true,
        emitPath: false
      },
      filterText: "",
      currentTreeData: {},
      searchInfo: {
        isAll: -1,
        deptId: "",
        nickName: "",
        username: "",
        isEnabled: 0
      },
      isEnabledOptions: [
        {
          value: 1,
          label: "启用"
        },
        {
          value: 0,
          label: "禁用"
        }
      ],
      sexOptions: [],
      userList: [],
      // 分页
      pages: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      dialogTableVisible: false,
      isUpdate: false,
      userInfo: {
        username: "",
        nickName: "",
        password: 123456,
        deptId: null,
        sex: "1",
        phone: "",
        email: "",
        postId: [],
        roleId: [],
        sort: 0,
        isEnabled: 1,
        description: ""
      },
      roleList: [],
      postList: [],
      userRules: {
        username: [
          { required: true, message: "请输入用户账号", trigger: "blur" }
        ],
        nickName: [
          { required: true, message: "请输入用户昵称", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" }
        ],
        deptId: [{ required: true, message: "请选择用户组织", trigger: "blur" }]
      },
      orgTreeOptions: [],
      isView: false,
      mapInfo: new Map()
    };
  },
  mounted() {
    let _self = this;
    _self.getMap();
    _self.getOrgTree();
    _self.getUserPage();
    _self.getPostAll();
    _self.getRoleAll();
  },
  watch: {
    filterText(val) {
      this.$refs.orgTree.filter(val);
    }
  },
  methods: {
    ...mapActions("bootAdmin/org", ["orgTreeAll"]),
    ...mapActions("bootAdmin/user", [
      "userAllPage",
      "userSave",
      "userUpdate",
      "userInfoAll"
    ]),
    ...mapActions("bootAdmin/post", ["postAll"]),
    ...mapActions("bootAdmin/role", ["roleAll"]),
    ...mapActions("d2admin/dict", ["getDictMap"]),
    /**
     * 获取用户
     */
    getUserPage() {
      let _self = this;
      let url =
        userAllPagePath + "/" + _self.pages.page + "/" + _self.pages.pageSize;
      let params = JSON.parse(JSON.stringify(_self.searchInfo));
      _self.userAllPage({ url: url, data: params }).then(result => {
        _self.userList = result.list;
        _self.pages.total = Number(result.total);
      });
    },
    /**
     * 获取组织树
     */
    getOrgTree() {
      let _self = this;
      let url = orgTreePath + "/" + _self.isAll;
      let params = {};
      _self.orgTreeAll({ url: url, data: null }).then(result => {
        _self.orgTreeData = result;
      });
    },
    /**
     * 获取岗位
     */
    getPostAll() {
      let _self = this;
      let url = postAllPath;
      let s = {
        isAll: 1
      };
      let params = JSON.parse(JSON.stringify(s));
      _self.postAll({ url: url, data: params }).then(result => {
        _self.postList = result;
      });
    },
    /**
     * 获取全部角色
     */
    getRoleAll() {
      let _self = this;
      let url = roleAllPath;
      let s = {
        isAll: 1
      };
      let params = JSON.parse(JSON.stringify(s));
      _self.roleAll({ url: url, data: params }).then(result => {
        _self.roleList = result;
      });
    },
    treeFilterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    init() {
      let _self = this;
      _self.searchInfo = {
        isAll: -1,
        deptId: "",
        nickName: "",
        username: "",
        isEnabled: 0
      };
    },
    /**
     * 点击当前节点
     */
    treeNodeClick(data, node, obj) {
      let _self = this;
      _self.currentTreeData = data;
      _self.searchInfo = {
        isAll: -1,
        deptId: data.id,
        nickName: "",
        username: "",
        isEnabled: 0
      };
      _self.getUserPage();
    },
    handleSizeChange(val) {
      this.pages.pageSize = val;
    },
    handleCurrentChange(Page) {
      this.pages.page = Page;
    },
    /*关闭弹出 */
    handleDialogClose() {
      let _self = this;
      _self.dialogTableVisible = false;
      _self.init();
      _self.initUser();
    },
    /**
     * 初始化用户
     */
    initUser() {
      let _self = this;
      _self.userInfo = {
        username: "",
        nickName: "",
        password: 123456,
        deptId: null,
        sex: "1",
        phone: "",
        email: "",
        postId: [],
        roleId: [],
        sort: 0,
        isEnabled: 1,
        description: ""
      };
    },
    /**
     * 用户新增
     */
    handleAddNew() {
      let _self = this;
      _self.isUpdate = false;
      _self.isView = false;
      _self.initUser();
      _self.dialogTableVisible = true;
    },
    /**
     * 保存用户
     */
    handleSave() {
      let _self = this;
      _self.$refs.userFormRef.validate(valid => {
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
    save() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.userInfo));
      let url = userSavePath;
      _self.userSave({ url: url, data: params }).then(result => {
        _self.handleDialogClose();
      });
    },
    /**
     * 更新
     */
    update() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.userInfo));
      params.password = null;
      console.info(params);
      let url = userUpdatePath + "/" + params.id;
      _self.userUpdate({ url: url, data: params }).then(result => {
        _self.handleDialogClose();
      });
    },
    /**
     * 修改用户
     */
    handleUpdate(row) {
      let _self = this;
      _self.isUpdate = true;
      _self.isView = false;
      _self.getUserInfoAll(row.id);
    },
    /** */
    getUserInfoAll(id) {
      let _self = this;
      if (id) {
        let url = userInfoAllPath + "/" + id;
        _self.userInfoAll({ url: url, data: null }).then(result => {
          _self.userInfo = result;
          _self.dialogTableVisible = true;
        });
      }
    },
    /**
     * 树形
     */
    normalizer(node) {
      // 去掉children=[]的children属性
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
    /**
     * 获取数据字典类型
     */
    getMap() {
      let _self = this;
      _self.getDictMap().then(result => {
        _self.mapInfo = util.objToMap(result);
        _self.getMapValue("gender");
      });
    },
    /**获取map值 */
    getMapValue(type) {
      let _self = this;
      _self.sexOptions = util.dicts.getMapType(_self.mapInfo, type);
    }
  }
};
</script>
<style>
</style>