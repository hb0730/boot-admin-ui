<template>
  <d2-container class="page">
    <el-col :span="6">
      <el-card shadow="never">
        <el-row>
          <el-col :span="24">
            <el-button
              type="primary"
              @click="handleAddNew"
              size="medium"
              icon="el-icon-plus"
              plain
            >添加</el-button>
            <el-button
              type="danger"
              @click="handleDelete"
              size="medium"
              icon="el-icon-delete"
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
              ref="form"
              :model="menuInfo"
              label-width="auto"
              center
              :label-position="position"
              :rules="rules"
              required-asterisk
            >
              <el-form-item label="上级菜单">
                <treeselect
                  v-model="menuInfo.parentId"
                  :normalizer="normalizer"
                  :options="treeData"
                />
              </el-form-item>
              <el-form-item required label="名称" prop="name">
                <el-input v-model="menuInfo.name" clearable></el-input>
              </el-form-item>
              <el-form-item label="英文名称" prop="enname">
                <el-input v-model="menuInfo.enname" clearable></el-input>
              </el-form-item>
              <el-form-item required label="路径" prop="url">
                <el-input v-model="menuInfo.url" clearable></el-input>
              </el-form-item>
              <el-form-item label="图标" prop="icon">
                <e-icon-picker v-model="menuInfo.icon" clearable />
              </el-form-item>
              <el-form-item label="排序" prop="sort">
                <el-input-number
                  style="width: 100%"
                  controls-position="right"
                  v-model="menuInfo.sort"
                  placeholder="排序"
                  clearable
                ></el-input-number>
              </el-form-item>
              <el-form-item label="备注" prop="description">
                <el-input type="textarea" v-model="menuInfo.description" placeholder="备注" clearable></el-input>
              </el-form-item>
              <el-form-item label="是否启用" prop="isEnabled">
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
                @click="handleSave"
                plain
                class="button"
                v-if="!isUpdate"
              >新增</el-button>
              <el-button
                type="primary"
                @click="handleUpdate"
                size="medium"
                plain
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
            <el-form :inline="true" size="mini" :model="searchPermission">
              <el-form-item label="标识">
                <el-input v-model="searchPermission.mark" clearable placeholder="标识"></el-input>
              </el-form-item>
              <el-form-item label="名称">
                <el-input v-model="searchPermission.name" clearable placeholder="名称"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="handleSearchPermission"
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
              ref="permissionTree"
              node-key="id"
              :props="props"
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
                prop="mark"
                label="标识"
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
                  <el-button
                    title="修改"
                    @click="handlePermissionEdit(scope.row)"
                    type="text"
                    icon="el-icon-edit"
                    circle
                  ></el-button>
                  <el-button
                    title="删除"
                    type="text"
                    @click="handlePermissionDelete(scope.row)"
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
              :current-page="searchPermission.pageNum"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="searchPermission.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="searchPermission.total"
            ></el-pagination>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-dialog title="权限信息" :before-close="handleDialogClose" :visible.sync="dialogTableVisible">
      <el-form
        label-width="auto"
        :model="permissionInfo"
        :label-position="position"
        ref="permissionForm"
        required-asterisk
        :rules="permissionRules"
        center
      >
        <el-form-item required label="名称" prop="name">
          <el-input v-model="permissionInfo.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="英文名称" prop="enname">
          <el-input v-model="permissionInfo.enname" clearable></el-input>
        </el-form-item>
        <el-form-item required label="权限标识" prop="mark">
          <el-input v-model="permissionInfo.mark" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属菜单" prop="menuName">
          <el-input disabled v-model="permissionInfo.menuName" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            style="width: 100%"
            controls-position="right"
            v-model="permissionInfo.sort"
            placeholder="排序"
            clearable
          ></el-input-number>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input type="textarea" v-model="permissionInfo.description" placeholder="备注" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="isEnabled">
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
        <el-button type="primary" size="medium" @click="handlePermissionSave" plain>保存</el-button>
        <el-button size="medium" @click="handleDialogClose" plain>取 消</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>
<script>
import { mapActions } from "vuex";
import {
  menuTreePath,
  menuSavePath,
  menuUpdatePath,
  menuDeletePath,
  permissionSavePath,
  permissionPagePath,
  permissionUpdatePath,
  permissionDeletePath
} from "@/api/baseUrl";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { MessageBox } from "element-ui";
import util from "@/libs/util";
export default {
  components: { Treeselect },
  data() {
    return {
      position: "left",
      treeData: [],
      treeProps: {
        children: "children",
        label: "name"
      },
      i: 0,
      isUpdate: false,
      menuInfo: {
        parentId: null,
        id: "",
        name: "",
        enname: "",
        url: "",
        icon: "",
        sort: 0,
        description: "",
        isEnabled: 1
      },
      // 表单校验
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        url: [{ required: true, message: "请输入路径", trigger: "blur" }]
      },
      permissionRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        mark: [{ required: true, message: "请输入标识", trigger: "blur" }]
      },
      permissionList: [],
      props: {
        value: "id",
        label: "name"
      },
      searchPermission: {
        sortColumn: [],
        groupColumn: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
        mark: "",
        name: ""
      },
      dialogTableVisible: false,
      permissionInfo: {
        id: "",
        menuId: "",
        menuName: "",
        name: "",
        enname: "",
        mark: "",
        sort: 0,
        description: "",
        isEnabled: 1
      },
      isPermissionUpdate: false,
      isPermissionView: false,
      // 分页
      // pages: {
      //   page: 1,
      //   pageSize: 10,
      //   total: 0
      // },
      isAll: -1,
      mapInfo: {},
      isEnabledOptions: []
    };
  },
  mounted() {
    let _self = this;
    _self.getMenuTree();
    _self.getMap();
  },
  methods: {
    ...mapActions("bootAdmin/menu", [
      "menuTree",
      "menuSave",
      "menuUpdate",
      "menuDelete",
      "permissionPageList",
      "permissionSave",
      "permissionUpdate",
      "permissionDelete"
    ]),
    ...mapActions("d2admin/dict", ["getDictMap"]),
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
        parentId: data.parentId,
        id: data.id,
        name: data.name,
        enname: data.enname,
        url: data.url,
        icon: data.icon,
        sort: data.sort,
        description: data.description,
        isEnabled: data.isEnabled
      };
      _self.getPermissionPageList(data.id);
      _self.isUpdate = true;
    },
    /**
     * 获取树形菜单
     */
    getMenuTree() {
      let _self = this;
      let url = menuTreePath + "/" + _self.isAll;
      _self.menuTree({ url: url, data: null }).then(result => {
        _self.treeData = result;
      });
    },
    handleSave() {
      let _self = this;
      _self.$refs.form.validate(valid => {
        if (valid) {
          if (_self.isUpdate) {
          } else {
            _self.MenuSave();
          }
        } else {
          this.$message.error("表单校验失败，请检查");
        }
      });
    },
    /**
     * 新增
     */
    handleAddNew() {
      let _self = this;
      let currentNodes = _self.$refs.tree.getCheckedNodes(false);
      _self.isUpdate = false;
      if (currentNodes.length > 0) {
        let currentNode = currentNodes[0];
        _self.menuInfo = {
          parentId: currentNode.id,
          id: "",
          name: "",
          enname: "",
          url: "",
          icon: "",
          sort: 0,
          description: "",
          isEnabled: 1
        };
      } else {
        _self.menuInfo = {
          parentId: null,
          id: "",
          name: "",
          enname: "",
          url: "",
          icon: "",
          sort: 0,
          description: "",
          isEnabled: 1
        };
      }
    },
    /**
     * 菜单新增
     */
    MenuSave() {
      let _self = this;
      let url = menuSavePath;
      let params = JSON.parse(JSON.stringify(_self.menuInfo));
      _self.menuSave({ url: url, data: params }).then(result => {
        this.$message.success(result);
        this.$refs.form.resetFields()
        _self.getMenuTree();
        _self.menuInfo = {
          parentId: null,
          id: "",
          name: "",
          enname: "",
          url: "",
          icon: "",
          sort: 0,
          description: "",
          isEnabled: 1
        };
      });
    },
    /**
     * 修改
     */
    handleUpdate() {
      let _self = this;
      _self.$refs.form.validate(valid => {
        if (valid) {
          if (_self.isUpdate) {
            _self.MenuUpdate();
          } else {
          }
        } else {
          this.$message.error("表单校验失败，请检查");
        }
      });
    },
    MenuUpdate() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.menuInfo));
      let url = menuUpdatePath + "/" + params.id;
      _self.menuUpdate({ url: url, data: params }).then(result => {
        this.$message.success(result);
        this.$refs.form.resetFields()
        _self.getMenuTree();
        _self.menuInfo = {
          parentId: null,
          id: "",
          name: "",
          enname: "",
          url: "",
          icon: "",
          sort: 0,
          description: "",
          isEnabled: 1
        };
      });
    },
    /**
     * 删除
     */
    handleDelete() {
      let _self = this;
      let currentNodes = _self.$refs.tree.getCheckedNodes(false);
      _self.isUpdate = false;
      if (currentNodes.length > 0) {
        let currentNode = currentNodes[0];
        MessageBox.confirm("是否删除该数据", "删除", {
          type: "warning"
        }).then(() => {
          _self.MenuDelete(currentNode.id);
        });
      }
    },
    MenuDelete(id) {
      let _self = this;
      let url = menuDeletePath + "/" + id;
      _self.menuDelete({ url: url, data: null }).then(result => {
        this.$message.success(result);
        _self.getMenuTree();
        _self.i = 0;
      });
    },
    handleSizeChange(val) {
      this.searchPermission.pageSize = val;
      this.handleSearchPermission();
    },
    handleCurrentChange(val) {
      this.searchPermission.pageNum = val;
      this.handleSearchPermission();
    },
    /**
     * 获取分页的权限信息
     */
    getPermissionPageList(id) {
      let _self = this;
      let url = permissionPagePath + "/" + id;
      let params = JSON.parse(JSON.stringify(_self.searchPermission));
      _self.permissionPageList({ url: url, data: params }).then(result => {
        _self.permissionList = result.records;
        _self.searchPermission.total = Number(result.total);
      });
    },
    /**
     * 关闭弹框
     */
    handleDialogClose() {
      let _self = this;
      _self.dialogTableVisible = false;
      _self.permissionInfo = {
        id: "",
        menuId: "",
        menuName: "",
        name: "",
        enname: "",
        mark: "",
        sort: 0,
        description: "",
        isEnabled: 1
      };
      let currentNodes = _self.$refs.tree.getCheckedNodes(false);
      if (currentNodes.length > 0) {
        let currentNode = currentNodes[0];
        _self.getPermissionPageList(currentNode.id);
      }
    },
    /**
     * 添加权限
     */
    handlerPermissionAddNew(command) {
      let _self = this;
      if (command == "addNew") {
        let _self = this;
        let currentNodes = _self.$refs.tree.getCheckedNodes(false);
        _self.isUpdate = false;
        if (currentNodes.length > 0) {
          _self.isPermissionUpdate = false;
          let currentNode = currentNodes[0];
          _self.permissionInfo = {
            id: "",
            menuId: currentNode.id,
            menuName: currentNode.name,
            name: "",
            enname: "",
            mark: "",
            sort: 0,
            description: "",
            isEnabled: 1
          };
          _self.dialogTableVisible = true;
        } else {
          this.$message({
            message: "请选择菜单",
            type: "warning"
          });
        }
      }
    },
    /**
     * 添加权限
     */
    handlePermissionSave() {
      let _self = this;
      // permissionForm
      _self.$refs.permissionForm.validate(valid => {
        if (valid) {
          if (_self.isPermissionUpdate) {
            _self.PermissionUpdate();
          } else {
            _self.PermissionSave();
          }
        } else {
          this.$message.error("表单校验失败，请检查");
        }
      });
    },
    PermissionSave() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.permissionInfo));
      let url = permissionSavePath + "/" + params.menuId;
      _self.permissionSave({ url: url, data: params }).then(result => {
        this.$message.success(result);
        this.$refs.permissionForm.resetFields();
        _self.handleDialogClose();
      });
    },
    /**
     * 编辑权限
     */
    handlePermissionEdit(row) {
      let _self = this;
      let info = JSON.parse(JSON.stringify(row));
      _self.permissionInfo = info;
      let currentNodes = _self.$refs.tree.getCheckedNodes(false);
      if (currentNodes.length <= 0) {
        this.$message.warning("请选择菜单");
        return;
      }
      _self.permissionInfo.menuName = currentNodes[0].name;
      _self.dialogTableVisible = true;
      _self.isPermissionUpdate = true;
    },
    /**
     * 用户修改
     */
    PermissionUpdate() {
      let _self = this;
      let params = JSON.parse(JSON.stringify(_self.permissionInfo));
      let url = permissionUpdatePath + "/" + params.id;
      _self.permissionUpdate({ url: url, data: params }).then(result => {
        this.$message.success(result);
        this.$refs.permissionForm.resetFields();
        _self.handleDialogClose();
      });
    },
    /**
     * 删除权限
     */
    handlePermissionDelete(row) {
      let _self = this;
      let info = JSON.parse(JSON.stringify(row));
      MessageBox.confirm("是否删除该数据", "删除", {
        type: "warning"
      }).then(() => {
        _self.PermissionDelete(row.id);
      });
    },
    PermissionDelete(id) {
      let _self = this;
      let url = permissionDeletePath + "/" + id;
      _self.permissionDelete({ url: url, data: null }).then(result => {
        this.$message.success(result);
        _self.handleDialogClose();
      });
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
     * 权限检索
     */
    handleSearchPermission() {
      let _self = this;
      let currentNodes = _self.$refs.tree.getCheckedNodes(false);
      if (currentNodes.length > 0) {
        let currentNode = currentNodes[0];
        _self.getPermissionPageList(currentNode.id);
      }
    },
    /**
     * 获取数据字典类型
     */
    getMap() {
      let _self = this;
      _self.getDictMap().then(result => {
        _self.mapInfo = util.objToMap(result);
        _self.isEnabledOptions = _self.getMapType("system_enabled");
      });
    },
    /**获取map值 */
    getMapValue(type, value) {
      let _self = this;
      return util.dicts.getMapValue(_self.mapInfo, type, value);
    },
    getMapType(type) {
      let _self = this;
      return util.dicts.getMapType(_self.mapInfo, type);
    }
  }
};
</script>
<style scoped>
</style>