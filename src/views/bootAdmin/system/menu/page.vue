<template>
  <d2-container class="page">
    <el-col :span="6">
      <el-card shadow="never">
        <el-row>
          <el-col :span="24">
            <el-button
              type="primary"
              size="medium"
              icon="el-icon-plus"
              @click="handlerMenuAddNew"
              plain
            >添加</el-button>
            <el-button
              type="danger"
              size="medium"
              icon="el-icon-delete"
              @click="handlerMenuDelete"
              plain
            >删除</el-button>
          </el-col>
        </el-row>
        <el-row style="padding-top:10%;">
          <el-col>
            <el-tree
              :data="treeData"
              show-checkbox
              ref="tree"
              node-key="id"
              :props="treeProps"
              check-strictly
              :highlight-current="true"
              :expand-on-click-node="true"
              default-expand-all
              @check-change="handleNodeChangeCheckEvent"
              @check="handleNodeCheckClickEvent"
            ></el-tree>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card shadow="never">
        <el-row></el-row>
        <el-row style="padding-top:10%;">
          <el-col>
            <el-form
              ref="menuForm"
              :model="menuInfo"
              label-width="auto"
              center
              :label-position="position"
              :rules="menuRules"
              aria-required
            >
              <el-form-item label="上级菜单：">
                <treeselect
                  v-model="menuInfo.parentId"
                  :normalizer="normalizer"
                  :options="treeData"
                />
              </el-form-item>
              <el-form-item required label="名称：" prop="title">
                <el-input v-model="menuInfo.title" clearable></el-input>
              </el-form-item>
              <el-form-item required label="路由标题：" prop="enname">
                <el-input v-model="menuInfo.enname" clearable></el-input>
              </el-form-item>
              <el-form-item required label="菜单地址：" prop="path">
                <el-input v-model="menuInfo.path" clearable></el-input>
              </el-form-item>
              <el-form-item label="路由地址：" prop="component">
                <el-input v-model="menuInfo.component" clearable></el-input>
              </el-form-item>
              <el-form-item label="图标：" prop="icon">
                <e-icon-picker v-model="menuInfo.icon" clearable />
              </el-form-item>
              <el-form-item label="排序：" prop="sort">
                <el-input-number
                  style="width: 100%"
                  controls-position="right"
                  v-model="menuInfo.sort"
                  placeholder="排序"
                  clearable
                ></el-input-number>
              </el-form-item>
              <el-form-item label="备注：" prop="description">
                <el-input type="textarea" v-model="menuInfo.description" placeholder="备注" clearable></el-input>
              </el-form-item>
              <el-form-item label="是否启用：" prop="isEnabled">
                <el-radio-group v-model="menuInfo.isEnabled">
                  <el-radio
                    v-for="item in isEnabledOptions "
                    :key="Number(item.value)"
                    :label="Number(item.value)"
                  >{{item.label}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
            <div>
              <el-button
                type="primary"
                size="medium"
                plain
                @click="handlerMenuSave"
                class="button"
                v-if="!isUpdate"
              >新增</el-button>
              <el-button
                type="primary"
                size="medium"
                plain
                @click="handlerMenuUpdate"
                class="button"
                v-if="isUpdate"
              >修改</el-button>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="10">
      <el-card shadow="never">
        <el-row>
          <el-col>
            <el-form :inline="true" size="mini" :model="searchPermissionInfo">
              <el-form-item label="标识">
                <el-input v-model="searchPermissionInfo.permission" clearable placeholder="标识"></el-input>
              </el-form-item>
              <el-form-item label="名称">
                <el-input v-model="searchPermissionInfo.name" clearable placeholder="名称"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="handlerPermissionSearch"
                  plain
                  icon="fa fa-search"
                >搜索</el-button>
                <el-dropdown size="small" @command="handlerPermissionAddNew" class="filter-item">
                  <el-button plain type="primary">
                    更多
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu split-button slot="dropdown">
                    <el-dropdown-item command="addNew">添加</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row style="padding-top:10%;">
          <el-col>
            <el-table
              :data="permissionList"
              ref="permissionTableRef"
              check-strictly
              :highlight-current="true"
              default-expand-all
              style="width: 100%;"
              border
              :fit="true"
            >
              <el-table-column
                type="selection"
                sortable
                resizable
                :show-overflow-tooltip="true"
                align="center"
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
                prop="permission"
                label="标识"
                sortable
                resizable
                :show-overflow-tooltip="true"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="isEnabled"
                label="状态"
                sortable
                resizable
                :show-overflow-tooltip="true"
                align="center"
              >
                <template slot-scope="scope">
                  <el-tag
                    :type="scope.row.isEnabled === 1 ? 'primary' : 'warning'"
                    disable-transitions
                  >{{getDictEntryInfo("sys_common_status",scope.row.isEnabled).label}}</el-tag>
                </template>
              </el-table-column>
               <el-table-column
                prop="sort"
                label="排序"
                sortable
                resizable
                :show-overflow-tooltip="true"
                align="center"
              >
               </el-table-column>
              <el-table-column
                label="操作"
                sortable
                resizable
                :show-overflow-tooltip="true"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    title="修改"
                    @click="handlerPermissionEdit(scope.row)"
                    type="text"
                    icon="el-icon-edit"
                    circle
                  ></el-button>
                  <el-button
                    title="删除"
                    @click="handlerPermissionDelete(scope.row)"
                    type="text"
                    icon="el-icon-delete"
                    circle
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              align="left"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="searchPermissionInfo.pageNum"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="searchPermissionInfo.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="searchPermissionInfo.total"
            ></el-pagination>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-dialog
      title="权限信息"
      :destroy-on-close="true"
      :before-close="handleDialogClose"
      :visible.sync="dialogTableVisible"
    >
      <el-form
        label-width="auto"
        :model="permissionInfo"
        :label-position="position"
        ref="permissionForm"
        required-asterisk
        :rules="permissionRules"
        center
      >
        <el-form-item required label="名称：" prop="name">
          <el-input v-model="permissionInfo.name" clearable></el-input>
        </el-form-item>
        <el-form-item required label="权限标识：" prop="permission">
          <el-input v-model="permissionInfo.permission" clearable></el-input>
        </el-form-item>
        <el-form-item required label="所属菜单：" prop="menuId">
          <treeselect
            v-model="permissionInfo.menuId"
            :clearable="false"
            :normalizer="normalizer"
            :options="treeData"
          />
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input-number
            style="width: 100%"
            controls-position="right"
            v-model="permissionInfo.sort"
            placeholder="排序"
            clearable
          ></el-input-number>
        </el-form-item>
        <el-form-item label="备注：" prop="description">
          <el-input type="textarea" v-model="permissionInfo.description" placeholder="备注" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否启用：" prop="isEnabled">
          <el-radio-group v-model="permissionInfo.isEnabled">
            <el-radio
              v-for="item in isEnabledOptions "
              :key="Number(item.value)"
              :label="Number(item.value)"
            >{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handlerPermissionSave" size="medium" plain>保存</el-button>
        <el-button size="medium" @click="handleDialogClose" plain>取 消</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>
<script>
import { mapActions } from "vuex";
import util from "@/libs/util.js"
// https://www.vue-treeselect.cn/#vuex-support
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { MessageBox } from "element-ui";

export default {
  components: { Treeselect },
  data() {
    return {
      // 用于单选
      i: 0,
      position: "left",
      // 菜单树数据
      treeData: [],
      currentCheckMenuInfo: {},
      treeProps: {
        children: "children",
        label: "title",
      },
      // 菜单表单
      menuInfo: {
        id: "",
        parentId: -1,
        title: "",
        enname: "",
        path: "",
        component: "",
        icon: "",
        sort: 999,
        isEnabled: 0,
      },
      // 菜单表单规则
      menuRules: {
        title: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        enname: [
          { required: true, message: "请输入路由标题", trigger: "blur" },
        ],
        path: [{ required: true, message: "请输入菜单地址", trigger: "blur" }],
      },
      isEnabledOptions: [
      ],
      isUpdate: false,
      /**
       * 权限检索
       */
      searchPermissionInfo: {
        sortColumn: [],
        groupColumn: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      /**
       * 权限列表信息
       */
      permissionList: [],
      dialogTableVisible: false,
      /**
       * 权限表单信息
       */
      permissionInfo: {
        id: "",
        menuId: "",
        permission: "",
        description: "",
        isEnabled: 0,
        sort: 999,
      },
      permissionRules: {
        name: [{ required: true, message: "请输入权限名称", trigger: "blur" }],
        permission: [
          { required: true, message: "请输入权限标识符", trigger: "blur" },
        ],
        menuId: [
          { required: true, message: "请选择所属菜单", trigger: "change" },
        ],
      },
      isPermissionUpdate: false,
    };
  },
  mounted() {
    let _self = this;
    _self.getMenuTree();
    _self.initDict();
  },
  methods: {
    ...mapActions("bootAdmin/menu", [
      "queryTree",
      "updateById",
      "save",
      "deleteById",
    ]),
    ...mapActions("bootAdmin/permission", [
      "permissionByMenuId",
      "permissionSave",
      "permissionUpdate",
      "permissionDelete",
    ]),
    /**
     * 数据字典
     */
    initDict(){
      let _self=this;
       _self.isEnabledOptions = util.dict.getDictValue("sys_common_status");
    },
    getDictEntryInfo(type, entryValue) {
      return util.dict.getDictEntryValue(type, entryValue);
    },
    /**
     * 获取菜单树
     */
    getMenuTree() {
      let _self = this;
      _self.queryTree().then((result) => {
        _self.treeData = result;
      });
    },
    /**
     * 选中change(单选)
     */
    handleNodeChangeCheckEvent(data, checked, node) {
      this.i++;
      if (this.i % 2 === 0) {
        if (checked) {
          this.$refs.tree.setCheckedNodes([]);
          this.$refs.tree.setCheckedNodes([data]);
          // 交叉点击节点
        } else {
          this.$refs.tree.setCheckedNodes([]);
          // 点击已经选中的节点，置空
        }
      }
    },
    /**
     * 选中
     * @param data
     * @param node
     */
    handleNodeCheckClickEvent(data, node) {
      let _self = this;
      _self.menuInfo = {
        id: data.id,
        parentId: data.parentId,
        title: data.title,
        enname: data.enname,
        path: data.path,
        component: data.component,
        icon: data.icon,
        sort: data.sort,
        isEnabled: data.isEnabled,
      };
      _self.getPermissionById(data.id);
      _self.currentCheckMenuInfo = data;
      _self.isUpdate = true;
    },
    /**
     * 树形，选择器
     */
    normalizer(node) {
      // 去掉children=[]的children属性
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.title,
        children: node.children,
      };
    },
    /**
     * 初始化menuInfo
     */
    initMenuInfo() {
      let _self = this;
      _self.$refs.menuForm.resetFields();
      _self.menuInfo = {
        id: "",
        parentId: -1,
        title: "",
        enname: "",
        path: "",
        component: "",
        icon: "",
        sort: 999,
        isEnabled: 0,
      };
    },
    /**
     * 菜单新增
     */
    handlerMenuAddNew() {
      let _self = this;
      let currentNodes = _self.$refs.tree.getCheckedNodes(false);
      _self.isUpdate = false;
      let parentId = currentNodes.length > 0 ? currentNodes[0].id : -1;
      _self.initMenuInfo();
      _self.menuInfo.parentId = parentId;
    },
    /**
     * 菜单删除
     */
    handlerMenuDelete() {
      let _self = this;
      let currentNodes = _self.$refs.tree.getCheckedNodes(false);
      if (currentNodes.length <= 0) {
        this.$message.warning("请选择需要删除的数据");
      } else {
        let currentNode = currentNodes[0];
        MessageBox.confirm("是否删除该数据(包含子集)", "删除", {
          type: "warning",
        }).then(() => {
          _self.menuDelete(currentNode.id);
        });
      }
    },
    menuDelete(id) {
      let _self = this;
      if (id) {
        _self.deleteById({ id: id }).then((result) => {
          _self.$message.success("删除成功");
          _self.getMenuTree();
          _self.initMenuInfo();
        });
      }
    },
    /**
     * 菜单修改
     */
    handlerMenuUpdate() {
      let _self = this;
      _self.$refs.menuForm.validate((valid) => {
        if (valid) {
          _self.menuUpdate();
        } else {
          this.$message.error("表单校验失败，请检查");
        }
      });
    },
    menuUpdate() {
      let _self = this;
      let url = "/" + _self.menuInfo.id;
      let params = JSON.parse(JSON.stringify(_self.menuInfo));
      _self.updateById({ url: url, data: params }).then((result) => {
        _self.$message.success("修改成功");
        _self.getMenuTree();
        _self.initMenuInfo();
      });
    },
    /**
     * 菜单新增
     */
    handlerMenuSave() {
      let _self = this;
      _self.$refs.menuForm.validate((valid) => {
        if (valid) {
          _self.menuSave();
        } else {
          this.$message.error("表单校验失败，请检查");
        }
      });
    },
    menuSave() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.menuInfo));
      _self.save({ data: params }).then((result) => {
        _self.$message.success("新增成功");
        _self.getMenuTree();
        _self.initMenuInfo();
      });
    },
    /******权限 */
    getPermission() {
      let _self = this;
      let currentNodes = _self.$refs.tree.getCheckedNodes(false);
      if (currentNodes.length > 0) {
        _self.getPermissionById(currentNodes[0].id);
      }
    },
    handlerPermissionSearch() {
      let _self = this;
      _self.pageNum = 1;
      _self.getPermission();
    },
    handleSizeChange(val) {
      let _self = this;
      _self.searchPermissionInfo.pageSize = val;
      _self.getPermission();
    },
    handleCurrentChange(page) {
      let _self = this;
      _self.searchPermissionInfo.pageNum = page;
      _self.getPermission();
    },
    handlerPermissionAddNew(command) {
      let _self = this;
      if (command == "addNew") {
        let currentNodes = _self.$refs.tree.getCheckedNodes(false);
        if (currentNodes.length > 0) {
          let currentNode = currentNodes[0];
          _self.initPermissionInfo();
          _self.permissionInfo.menuId = currentNode.id;
          _self.dialogTableVisible = true;
        } else {
          this.$message({
            message: "请选择菜单",
            type: "warning",
          });
        }
      }
    },
    /**
     * 初始化权限info
     */
    initPermissionInfo() {
      let _self = this;
      _self.permissionInfo = {
        id: "",
        menuId: "",
        permission: "",
        description: "",
        isEnabled: 0,
        sort: 999,
      };
    },
    /**
     * 根据菜单获取权限信息
     */
    getPermissionById(id) {
      let _self = this;
      if (id) {
        let params = JSON.parse(JSON.stringify(_self.searchPermissionInfo));
        _self.permissionByMenuId({ id: id, data: params }).then((result) => {
          _self.permissionList = result.records;
          _self.searchPermissionInfo.total = Number(result.total);
        });
      }
    },
    /**
     * 权限信息保存
     */
    handlerPermissionSave() {
      let _self = this;
      _self.$refs.permissionForm.validate((valid) => {
        if (valid) {
          if (_self.isPermissionUpdate) {
            _self.updatePermission();
          } else {
            _self.savePermission();
          }
        } else {
          this.$message.error("表单校验失败，请检查");
        }
      });
    },
    /**
     * 权限修改
     */
    handlerPermissionEdit(data) {
      let _self = this;
      _self.permissionInfo = data;
      _self.isPermissionUpdate = true;
      _self.dialogTableVisible = true;
    },
    /**
     * 删除权限
     */
    handlerPermissionDelete(data) {
      let _self = this;
      if (data) {
        MessageBox.confirm("是否删除该数据", "删除", {
          type: "warning",
        }).then(() => {
          _self.deletePermission(data.id);
        });
      } else {
        this.$message.warning("请选择要删除的数据");
      }
    },
    deletePermission(id) {
      let _self = this;
      if (id) {
        _self.permissionDelete({ id: id }).then((result) => {
          _self.$message.success("删除成功");
          _self.handleDialogClose();
        });
      }
    },
    savePermission() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.permissionInfo));
      _self.permissionSave({ data: params }).then((result) => {
        _self.$message.success("保存成功");
        _self.handleDialogClose();
      });
    },
    updatePermission() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.permissionInfo));
      let id = _self.permissionInfo.id;
      _self.permissionUpdate({ id: id, data: params }).then((result) => {
        _self.$message.success("修改成功");
        _self.handleDialogClose();
      });
    },
    /**
     * 弹出关闭
     */
    handleDialogClose() {
      let _self = this;
      _self.initPermissionInfo();
      _self.getPermission();
      _self.isPermissionUpdate = false;
      _self.dialogTableVisible = false;
    },
  },
};
</script>
<!--queryTree-->